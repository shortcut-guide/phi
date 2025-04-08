import axios from 'axios';
import crypto from 'crypto';

const getProductDetails = async (productId) => {
  const url = 'https://api.taobao.com/router/rest';

  const params = {
    method: 'taobao.item.get',
    app_key: process.env.TAOBAO_APP_KEY,
    session: process.env.TAOBAO_APP_SECRET,
    timestamp: new Date().toISOString().slice(0, 19).replace('T', ' '),
    format: 'json',
    v: '2.0',
    sign_method: 'md5',
    fields: 'num_iid,title,weight,volume,location',
    num_iid: productId,
  };

  // シグネチャの生成
  const sign = generateSign(params, process.env.TAOBAO_APP_SECRET);
  const fullParams = { ...params, sign };

  // POSTリクエストで送信
  const response = await axios.post(url, null, { params: fullParams });

  return response.data;
};

// MD5で署名を作成する関数
function generateSign(params, secret) {
  const sortedKeys = Object.keys(params).sort();
  const baseString = sortedKeys.reduce((str, key) => {
    return str + key + params[key];
  }, secret) + secret;

  return crypto.createHash('md5').update(baseString).digest('hex').toUpperCase();
}

export default getProductDetails;