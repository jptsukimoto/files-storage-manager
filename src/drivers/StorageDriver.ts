import { IFile } from "../types";

export abstract class StorageDriver {
    abstract put(path: string, content: Buffer): Promise<void>
    abstract get(path: string): Promise<IFile>
    abstract delete(path: string): Promise<void>
}