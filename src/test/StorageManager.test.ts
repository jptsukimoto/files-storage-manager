import { StorageManager } from '../drivers/StorageManager';

jest.mock('fs/promises')

describe('StorageManager', () => {
    let storageManager = new StorageManager()

    beforeEach(() => {
        storageManager = new StorageManager()
        jest.clearAllMocks()
    })

    test('Deve registrar um driver Local corretamente', async () => {
        const name = 'meu-local'
        const driverType = 'local'
        const config = { rootFolder: '/tmp' }
        storageManager.register(name, driverType, config)
        expect(storageManager.find(name)).toEqual({"config": {"rootFolder": "/tmp"}})
    })
})