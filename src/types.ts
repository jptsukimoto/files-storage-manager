export interface IFile {
    path: string;
    data: Buffer;
}

export interface LocalConfig {
    rootFolder: string;
}

export interface S3Config {
    bucket: string;
    region: string;
    accessKeyId?: string;
    secretAccessKey?: string;
}

export type DiskConfigMap = {
    local: LocalConfig;
    s3: S3Config;
}

export type DriverType = keyof DiskConfigMap;