import axios from "axios";
import FormData from "form-data";
import fs from "fs";

export const uploadImageToBase = async ({
  imagePath,
  accessToken,
}: {
  imagePath: string;
  accessToken: string;
}) => {
  const url = "https://api.thebase.in/1/items"; // 商品登録エンドポイント

  const formData = new FormData();
  formData.append("name", "Temporary Image Upload");
  formData.append("price", "100");
  formData.append("stock", "1");
  formData.append("item_images[0]", fs.createReadStream(imagePath));

  const response = await axios.post(url, formData, {
    headers: {
      ...formData.getHeaders(),
      Authorization: `Bearer ${accessToken}`,
    },
  });

  return response.data.item_images[0].image_url; // cdn URL
};