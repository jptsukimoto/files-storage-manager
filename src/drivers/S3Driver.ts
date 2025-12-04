import { DeleteObjectCommand, GetObjectCommand, PutObjectCommand, S3Client } from "@aws-sdk/client-s3";
import { StorageDriver } from "./StorageDriver";
import { IFile, S3Config } from "../types";


export class S3Driver extends StorageDriver {
    private s3Client: S3Client

    constructor(private config: S3Config) {
        super()
        this.s3Client = new S3Client({
            region: config.region,
            credentials: (!config.accessKeyId || !config.secretAccessKey) ? undefined : {
                accessKeyId: config.accessKeyId,
                secretAccessKey: config.secretAccessKey
            }
        })
    }

    async put(filePath: string, data: Buffer): Promise<void> {
        await this.s3Client.send(new PutObjectCommand({
            Bucket: this.config.bucket,
            Key: filePath,
            Body: data
        }))
    }

    async get(filePath: string): Promise<IFile> {
        const response = await this.s3Client.send(new GetObjectCommand({
            Bucket: this.config.bucket,
            Key: filePath
        }))
        const byteArray = await response.Body?.transformToByteArray()
        if (!byteArray) throw new Error('Empty file or not found');
        return {
            path: filePath,
            data: Buffer.from(byteArray)
        }
    }

    async delete(filePath: string): Promise<void> {
        await this.s3Client.send(new DeleteObjectCommand({
            Bucket: this.config.bucket,
            Key: filePath
        }))
    }
}