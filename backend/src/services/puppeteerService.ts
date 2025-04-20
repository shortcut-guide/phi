import { PuppeteerData } from "../models/PuppeteerData.ts";
import apiHelper from "../utils/microcmsHelper.ts";

const uploadJson = async (jsonData: any): Promise<PuppeteerData> => {
  return await apiHelper.post("/puppeteer-json", { json_data: jsonData });
};

const getData = async (
    search: string,
    page: number,
    sort: string,
    order: string
): Promise<PuppeteerData[]> => {
    return await apiHelper.get(`/puppeteer-json?filters=product_name[contains]${search}&orders=${sort}[${order}]&limit=10&offset=${(page - 1) * 10}`);
};

const updateData = async (id: string, updatedData: any): Promise<PuppeteerData> => {
    return await apiHelper.put(`/puppeteer-json/${id}`, { json_data: updatedData });
};

const deleteData = async (id: string): Promise<void> => {
    await apiHelper.delete(`/puppeteer-json/${id}`, {});
};

export default { uploadJson, getData, updateData, deleteData };