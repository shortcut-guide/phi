[Unit]
Description=Switch to Maintenance Mode
After=network.target

[Service]
Type=oneshot
ExecStart=/usr/local/bin/switch_maintenance.sh start_maintenance