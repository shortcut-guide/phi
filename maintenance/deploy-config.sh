#!/bin/bash
set -e

# カレントディレクトリ固定
DIR="$(cd "$(dirname "$0")" && pwd)"
cd "$DIR"

echo "🔄 デプロイ開始"

# systemd 設定更新
sudo cp "$DIR/systemd/backend.service" /etc/systemd/system/backend.service
sudo cp "$DIR/systemd/maintenance.service" /etc/systemd/system/maintenance.service
echo "✅ systemd ファイルを更新"

# メンテナンス切替スクリプト
sudo cp "$DIR/scripts/switch_maintenance.sh" /usr/local/bin/switch_maintenance.sh
sudo chmod +x /usr/local/bin/switch_maintenance.sh
echo "✅ switch_maintenance.sh を更新 & 実行権限付与"

# maintenance.html 配置
sudo mkdir -p /var/www/maintenance/assets
sudo cp "$DIR/assets/maintenance.html" /var/www/maintenance/assets/maintenance.html
echo "✅ maintenance.html を配置"

# Webhook用スクリプト設置
sudo mkdir -p /var/www/webhook
sudo cp "$DIR/webhook/maintenance.js" /var/www/webhook/maintenance.js
sudo chmod +x /var/www/webhook/maintenance.js
echo "✅ maintenance.js を /var/www/webhook/ に配置"

# systemd 再読み込み + backend.service 再起動
sudo systemctl daemon-reexec
sudo systemctl daemon-reload
sudo systemctl restart backend.service || echo "⚠️ backend.service の再起動に失敗"

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
