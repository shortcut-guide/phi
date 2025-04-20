import { Request, Response } from "express";
import puppeteerService from "../services/puppeteerService";

const uploadJson = async (req: Request, res: Response) => {
    try {
        const data = await puppeteerService.uploadJson(req.body);
        res.status(201).json({ message: "データ登録成功", data });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const getData = async (req: Request, res: Response) => {
    try {
        const { search, page, sort, order } = req.query;
        const data = await puppeteerService.getData(
            search as string,
            parseInt(page as string) || 1,
            sort as string || "uploaded_at",
            order as string || "desc"
        );
        res.json(data);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const updateData = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const updatedData = await puppeteerService.updateData(id, req.body);
        res.json({ message: "データ更新成功", updatedData });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const deleteData = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        await puppeteerService.deleteData(id);
        res.json({ message: "データ削除成功" });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

export default { uploadJson, getData, updateData, deleteData };