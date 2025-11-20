import { LocalConfig } from "../types";
import { LocalDriver } from "./LocalDriver";
import { StorageDriver } from "./StorageDriver";

export class StorageManager {
    private disks: Map<string, StorageDriver> = new Map()

    register(
        name: string,
        driverType: string,
        config: LocalConfig
    ): void {
        let driver: StorageDriver
        switch (driverType) {
            case 'local':
                driver = new LocalDriver(config)
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