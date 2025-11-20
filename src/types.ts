export interface IFile {
    path: string;
    data: Buffer;
}

export interface LocalConfig {
    rootFolder: string;
}

export type DiskConfigMap = {
    local: LocalConfig;
}

export type DriverType = keyof DiskConfigMap;