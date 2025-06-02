#!/bin/bash
set -e

echo "🔄 デプロイ開始"

# backend.service 設定
sudo cp ./systemd/backend.service /etc/systemd/system/backend.service
echo "✅ systemd ファイルを更新"

# メンテナンス切替スクリプト
sudo cp ./scripts/switch_maintenance.sh /usr/local/bin/switch_maintenance.sh
sudo chmod +x /usr/local/bin/switch_maintenance.sh
echo "✅ switch_maintenance.sh を更新 & 実行権限付与"

# maintenance.html 配置
sudo mkdir -p /var/www/maintenance
sudo cp ./assets/maintenance.html /var/www/maintenance/maintenance.html
echo "✅ maintenance.html を配置"

# systemd 再読み込み + 再起動
sudo systemctl daemon-reexec
sudo systemctl daemon-reload
sudo systemctl restart backend.service
echo "✅ systemctl 再読み込み & backend.service 再起動"