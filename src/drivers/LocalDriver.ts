import path from "path";
import fs from 'fs/promises';
import { IFile, LocalConfig } from "../types";
import { StorageDriver } from "./StorageDriver";

export class LocalDriver extends StorageDriver {
    constructor(private config: LocalConfig) {
        super()
    }

    private getFullPath(filePath: string): string {
        return path.join(this.config.rootFolder, filePath)
    }

    async put(filePath: string, data: Buffer): Promise<void> {
        const fullPath = this.getFullPath(filePath)
        await fs.mkdir(path.dirname(fullPath), { recursive: true })
        await fs.writeFile(fullPath, data)
    }

    async get(filePath: string): Promise<IFile> {
        const fullPath = this.getFullPath(filePath)
        const data = await fs.readFile(fullPath)
        return { path: filePath, data}
    }

    async delete(filePath: string): Promise<void> {
        await fs.unlink(this.getFullPath(filePath))
    }
}