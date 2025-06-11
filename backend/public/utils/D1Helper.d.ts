import { D1Database } from "@cloudflare/workers-types";
export declare class D1Helper {
    private db;
    constructor(db: D1Database);
    getAllContents(): Promise<any[]>;
    insertContent(title: string, body: string, visible: boolean): Promise<number>;
    deleteContent(id: number): Promise<boolean>;
}
