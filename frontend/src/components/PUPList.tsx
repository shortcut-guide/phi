import { useState, useEffect } from "react";
import type { PuppeteerItem } from "@/f/types/puppeteer";
import clsx from "clsx";
import { messages } from "@/f/config/messageConfig";

const lang = "__MSG_LANG__";
const t = ((messages.puppeteerPage as any)[lang]) ?? {};

const PUPList = () => {
    const [data, setData] = useState<PuppeteerItem[]>([]);
    const [search, setSearch] = useState("");
    const [page, setPage] = useState(1);
    const [sort, setSort] = useState("uploaded_at");
    const [order, setOrder] = useState("desc");

    useEffect(() => {
        const fetchData = async () => {
            const res = await fetch(`/api/puppeteer/data?search=${search}&page=${page}&sort=${sort}&order=${order}`);
            const result = await res.json();
            setData(result.contents);
        };
        fetchData();
    }, [search, page, sort, order]);

    const handleDelete = async (id: string) => {
        if (!confirm(t.confirmDelete)) return;
        try {
            const res = await fetch(`/api/puppeteer/delete?id=${id}`, { method: 'DELETE' });
            if (!res.ok) throw new Error('Delete failed');
            setData(prev => prev.filter(item => item.id !== id));
        } catch (error) {
            console.error("Delete error:", error);
            alert(t.deleteError || "Failed to delete item.");
        }
    };

    const gridContainer = clsx("grid grid-cols-3 gap-4 p-4 border-b border-gray-300 bg-white shadow-md rounded-md dark:bg-gray-800");
    const gridHeader = clsx("font-bold bg-gray-100 p-4 text-gray-800 dark:bg-gray-700 dark:text-white");
    const gridItem = clsx("p-4 border-b border-gray-200 text-gray-700 dark:text-gray-300");
    const actions = clsx("flex space-x-4");
    const inputStyle = clsx("formkit-input w-full max-w-md");
    const buttonStyle = clsx("bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-700 transition");
    
    return (
        <div className="bg-gray-100 dark:bg-gray-900 p-6">
            <h3 className="text-2xl font-bold mb-4 text-gray-800 dark:text-white">{t.title}</h3>
            <div className="flex space-x-4 mb-4">
                <input className="*:inputStyle" type="text" placeholder={t.placeholder} onChange={(e) => setSearch(e.target.value)} />
                <button className="buttonStyle" onClick={() => setOrder(order === "desc" ? "asc" : "desc")}>{t.sortLabel}: {order}</button>
            </div>

            <div className="gridContainer">
                <div className="gridHeader">{t.ecSite}</div>
                <div className="gridHeader">{t.uploadedAt}</div>
                <div className="gridHeader">{t.actions}</div>
            </div>

            {data.map(item => (
                <div key={item.id} className={gridContainer}>
                    <div className="gridItem">{item.ec_site}</div>
                    <div className="gridItem">{new Date(item.uploaded_at).toLocaleString()}</div>
                    <div className="gridItem actions">
                        <a className="text-blue-500 hover:underline" href={`/edit?id=${item.id}`}>{t.edit}</a>
                        <button className="text-red-500 hover:underline" onClick={() => handleDelete(item.id)}>{t.delete}</button>
                    </div>
                </div>
            ))}

            <div className="flex justify-between mt-4">
                <button className="buttonStyle" onClick={() => setPage(page - 1)} disabled={page <= 1}>{t.prev}</button>
                <button className="buttonStyle" onClick={() => setPage(page + 1)}>{t.next}</button>
            </div>
        </div>
    );
};

export default PUPList;