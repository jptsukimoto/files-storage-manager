import { 
    S3Client, 
    PutObjectCommand, 
    GetObjectCommand, 
    DeleteObjectCommand 
} from '@aws-sdk/client-s3';
import { S3Driver } from '../drivers/S3Driver';

jest.mock('@aws-sdk/client-s3', () => {
    return {
        __esModule: true,
        S3Client: jest.fn(),
        PutObjectCommand: jest.fn(),
        GetObjectCommand: jest.fn(),
        DeleteObjectCommand: jest.fn()
    }
})

describe('S3Driver', () => {
    const config = {
        bucket: 'test-bucket',
        region: 'us-east-1',
        accessKeyId: 'fake',
        secretAccessKey: 'fake'
    }
    let driver: S3Driver
    let mockSend: jest.Mock

    beforeEach(() => {
        jest.clearAllMocks()
        mockSend = jest.fn()
        const MockedS3Client = S3Client as unknown as jest.Mock;
        MockedS3Client.mockImplementation(() => {
            return {
                send: mockSend
            }
        })
        driver = new S3Driver(config)
    })

    test('Deve enviar um arquivo para o S3 usando PutObject', async () => {
        mockSend.mockResolvedValue({})
        const filePath = 'uploads/test-file.txt'
        const data = Buffer.from('file content')
        await driver.put(filePath, data)
        const PutCommandMock = PutObjectCommand as unknown as jest.Mock
        expect(PutCommandMock).toHaveBeenCalledWith({
            Bucket: config.bucket,
            Key: filePath,
            Body: data
        })
        expect(mockSend).toHaveBeenCalledTimes(1)
        expect(mockSend).toHaveBeenCalledWith(expect.any(PutObjectCommand))
    })

    test('Deve buscar um arquivo no S3 usando GetObjectCommand e retornar objeto IFile', async () => {
        const filePath = 'uploads/test-file.txt'
        const data = Buffer.from('file content')
        mockSend.mockResolvedValue({
            Body: {
                transformToByteArray: jest.fn().mockResolvedValue(new Uint8Array(data))
            }
        })
        const result = await driver.get(filePath)
        const GetCommandMock = GetObjectCommand as unknown as jest.Mock
        expect(GetCommandMock).toHaveBeenCalledWith({
            Bucket: config.bucket,
            Key: filePath
        })
        expect(mockSend).toHaveBeenCalledTimes(1)
        expect(mockSend).toHaveBeenCalledWith(expect.any(GetObjectCommand))
        expect(result.path).toBe(filePath)
        expect(result.data).toEqual(data)
    })

    test('Deve deletar um arquivo no S3 usando DeleteObjectCommand', async () => {
        mockSend.mockResolvedValue({})
        const filePath = 'uploads/test-file.txt'
        await driver.delete(filePath)
        const DeleteCommandMock = DeleteObjectCommand as unknown as jest.Mock
        expect(DeleteCommandMock).toHaveBeenCalledWith({
            Bucket: config.bucket,
            Key: filePath
        })
        expect(mockSend).toHaveBeenCalledTimes(1)
        expect(mockSend).toHaveBeenCalledWith(expect.any(DeleteObjectCommand))
    })

    test('Deve lançar erros da AWS', async () => {
        mockSend.mockRejectedValue(new Error('Error'))
        const filePath = 'uploads/test-file.txt'
        const data = Buffer.from('file content')
        await expect(driver.put(filePath, data)).rejects.toThrow('Error')
        await expect(driver.get(filePath)).rejects.toThrow('Error')
        await expect(driver.delete(filePath)).rejects.toThrow('Error')
    })
})