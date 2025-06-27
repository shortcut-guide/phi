INSERT INTO products (
  id, name, shop_name, platform, base_price, ec_data, created_at, updated_at
) VALUES
  ('prod001', 'ワイヤレスイヤホン', '自社公式', 'amazon', 3980, '{"stock":20,"rating":4.2,"reviewCount":120}', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
  ('prod002', 'USB急速充電器', 'ABC商店', 'rakuten', 1980, '{"stock":50,"rating":4.5,"reviewCount":78}', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
  ('prod003', 'スマホスタンド', 'XYZショップ', 'base', 980, '{"stock":100,"rating":4.0,"reviewCount":200}', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
  ('prod004', 'ゲーミングマウス', 'ゲーマーズ', 'amazon', 2980, '{"stock":15,"rating":4.7,"reviewCount":340}', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
  ('prod005', 'Bluetoothスピーカー', 'SoundWave', 'rakuten', 4480, '{"stock":35,"rating":4.3,"reviewCount":210}', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
  ('prod006', 'ノートPCスタンド', '自社公式', 'base', 2580, '{"stock":60,"rating":4.1,"reviewCount":112}', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
  ('prod007', 'モバイルバッテリー', '電池屋', 'amazon', 3680, '{"stock":40,"rating":4.6,"reviewCount":190}', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
  ('prod008', 'LEDデスクライト', 'ライトの店', 'rakuten', 2780, '{"stock":22,"rating":4.4,"reviewCount":89}', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
  ('prod009', 'HDMIケーブル2m', 'CableMart', 'base', 580, '{"stock":200,"rating":3.9,"reviewCount":50}', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
  ('prod010', '防水スマホケース', 'アウトドアショップ', 'amazon', 1580, '{"stock":90,"rating":4.2,"reviewCount":140}', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);