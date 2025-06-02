#!/bin/bash
set -e

ACTION=$1

LIVE_CONF="/etc/nginx/sites-enabled/phis.conf"
MAINTENANCE_CONF="/etc/nginx/sites-available/phis.maintenance.conf"
LIVE_AVAILABLE="/etc/nginx/sites-available/phis.live.conf"

if [ "$ACTION" == "start_maintenance" ]; then
  echo "🔧 Switching to maintenance mode..."
  ln -sf "$MAINTENANCE_CONF" "$LIVE_CONF"
  nginx -s reload
elif [ "$ACTION" == "stop_maintenance" ]; then
  echo "✅ Restoring live configuration..."
  ln -sf "$LIVE_AVAILABLE" "$LIVE_CONF"
  nginx -s reload
else
  echo "❌ Invalid argument: use start_maintenance or stop_maintenance"
  exit 1
fi