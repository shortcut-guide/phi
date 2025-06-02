#!/bin/bash

set -e

SCRIPT_PATH=$(realpath "$0")
TMP_SCRIPT="/tmp/deploy-config.sh"
cp "$SCRIPT_PATH" "$TMP_SCRIPT"


# 一時ディレクトリでsparse-checkoutして maintenance/ ディレクトリのみを展開
sudo rm -rf /tmp/phis-temp
# ✅ 修正（直接展開）
sudo git clone --filter=blob:none --no-checkout "https://x-access-token:${GH_TOKEN_WRITE}@github.com/shortcut-guide/phis.git" /tmp/phis-temp
cd /tmp/phis-temp
sudo git sparse-checkout init --cone
sudo git sparse-checkout set .
sudo git checkout develop

sudo rm -rf /var/www/maintenance
sudo mkdir -p /var/www/maintenance
sudo mv -r /tmp/phis-temp/maintenance* /var/www/maintenance

sudo mv "$TMP_SCRIPT" /var/www/maintenance/deploy-config.sh
sudo chmod +x /var/www/maintenance/deploy-config.sh


echo "🔄 デプロイ開始"

# systemd 設定更新
sudo cp /var/www/maintenance/systemd/backend.service /etc/systemd/system/backend.service
sudo cp /var/www/maintenance/systemd/maintenance.service /etc/systemd/system/maintenance.service
echo "✅ systemd ファイルを更新"

# メンテナンス切替スクリプト
sudo cp /var/www/maintenance/scripts/switch_maintenance.sh /usr/local/bin/switch_maintenance.sh
sudo chmod +x /usr/local/bin/switch_maintenance.sh
echo "✅ switch_maintenance.sh を更新 & 実行権限付与"

# maintenance.html 配置
sudo mkdir -p /var/www/maintenance/assets
sudo cp /var/www/maintenance/assets/maintenance.html /var/www/maintenance/assets/maintenance.html
echo "✅ maintenance.html を配置"

# Webhook用スクリプト設置
sudo mkdir -p /var/www/webhook
sudo cp /var/www/maintenance/webhook/maintenance.js /var/www/webhook/maintenance.js
sudo chmod +x /var/www/webhook/maintenance.js
echo "✅ maintenance.js を /var/www/webhook/ に配置"

# systemd reload + backend.service reboot + maintenance.service reboot
sudo systemctl daemon-reexec
sudo systemctl daemon-reload
sudo systemctl restart backend.service || echo "⚠️ backend.service の再起動に失敗"
sudo systemctl restart maintenance.service || echo "⚠️ backend.service の再起動に失敗"

# --- cron ---

# 引数: 開始時刻と終了時刻を受け取る (例: "21:00" "22:00")
START_TIME=$1
END_TIME=$2

if [[ -n "$START_TIME" && -n "$END_TIME" ]]; then
  echo "⏰ 指定時間にメンテナンス切替を予約: $START_TIME → $END_TIME"

  # cron 時間整形
  START_MIN=$(echo "$START_TIME" | cut -d':' -f2)
  START_HOUR=$(echo "$START_TIME" | cut -d':' -f1)
  END_MIN=$(echo "$END_TIME" | cut -d':' -f2)
  END_HOUR=$(echo "$END_TIME" | cut -d':' -f1)

  # 現在の crontab バックアップ
  crontab -l | grep -v "switch_maintenance.sh" > /tmp/current_cron || true

  # 予約追加
  echo "$START_MIN $START_HOUR * * * /usr/local/bin/switch_maintenance.sh start_maintenance" >> /tmp/current_cron
  echo "$END_MIN $END_HOUR * * * /usr/local/bin/switch_maintenance.sh stop_maintenance" >> /tmp/current_cron

  # 登録
  crontab /tmp/current_cron
  rm /tmp/current_cron

  echo "✅ crontab にスケジュール登録完了"
else
  echo "⚠️ メンテナンス時間が未指定のため、cron 登録スキップ"
fi
