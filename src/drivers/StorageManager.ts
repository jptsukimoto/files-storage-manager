import { DiskConfigMap, DriverType, } from "../types";
import { LocalDriver } from "./LocalDriver";
import { S3Driver } from "./S3Driver";
import { StorageDriver } from "./StorageDriver";

export class StorageManager {
    private disks: Map<string, StorageDriver> = new Map()

    register<T extends DriverType>(
        name: string,
        driverType: T,
        config: DiskConfigMap[T]
    ): void {
        let driver: StorageDriver
        switch (driverType) {
            case 'local':
                driver = new LocalDriver(config as any)
                break;
            case 's3':
                driver = new S3Driver(config as any)
                break;
            default:
                throw new Error(`Driver ${driverType} not supported`)
        }
        this.disks.set(name, driver)
    }

    find(name: string): StorageDriver | undefined {
        return this.disks.get(name)
    }
}