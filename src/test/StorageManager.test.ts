import { S3Client } from '@aws-sdk/client-s3';
import { S3Driver } from '../drivers/S3Driver';
import { StorageManager } from '../drivers/StorageManager';
import { LocalDriver } from '../drivers/LocalDriver';
import { DiskConfigMap } from '../types';

jest.mock('fs/promises')
jest.mock('@aws-sdk/client-s3', () => {
    return {
        __esModule: true,
        S3Client: jest.fn(),
        PutObjectCommand: jest.fn(),
        GetObjectCommand: jest.fn(),
        DeleteObjectCommand: jest.fn()
    }
})

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
        expect(storageManager.find(name)).toBeInstanceOf(LocalDriver)
        expect(storageManager.find(name)).toEqual({"config": {"rootFolder": "/tmp"}})
    })

    test('Deve registrar um driver S3 corretamente', async () => {
        const name = 'meu-s3'
        const driverType = 's3'
        const config = {
            bucket: 'test-bucket',
            region: 'us-east-1',
            accessKeyId: 'fake',
            secretAccessKey: 'fake'
        }
        storageManager.register(name, driverType, config)
        const mockS3Instance = (S3Client as unknown as jest.Mock).mock.instances[0];
        expect(storageManager.find(name)).toBeInstanceOf(S3Driver)
        expect(storageManager.find(name)).toEqual({
            config: {
                bucket: 'test-bucket',
                region: 'us-east-1',
                accessKeyId: 'fake',
                secretAccessKey: 'fake'
            },
            s3Client: mockS3Instance
        })
    })

    test('Deve lançar um erro ao registrar um driver sem suporte', async () => {
        const name = 'meu-s3'
        const driverType = 'x'
        const config = {
            bucket: 'test-bucket',
            region: 'us-east-1',
            accessKeyId: 'fake',
            secretAccessKey: 'fake'
        }
        
        expect(() => storageManager.register(name, driverType as keyof DiskConfigMap, config)).toThrow('Driver x not supported')
    })

    test('Deve retornar undefined ao buscar um disco não registrado', async () => {
        expect(storageManager.find('driver-x')).toBeUndefined()
    })

    
})