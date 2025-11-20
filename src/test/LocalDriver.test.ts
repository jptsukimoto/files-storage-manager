import fs from 'fs/promises';
import path from 'path';
import { LocalDriver } from '../drivers/LocalDriver';

jest.mock('fs/promises', () => ({
    __esModule: true,
    default: {
        mkdir: jest.fn(),
        writeFile: jest.fn(),
        readFile: jest.fn(),
        unlink: jest.fn()
    }
}))

describe('LocalDriver', () => {
    const rootFolder = '/tmp/test'
    let driver: LocalDriver

    const mockedFs = fs as unknown as {
        mkdir: jest.Mock;
        writeFile: jest.Mock;
        readFile: jest.Mock;
        unlink: jest.Mock;
    };

    beforeEach(() => {
        jest.clearAllMocks()
        driver = new LocalDriver({ rootFolder })
        mockedFs.mkdir.mockResolvedValue(undefined);
        mockedFs.writeFile.mockResolvedValue(undefined);
        mockedFs.unlink.mockResolvedValue(undefined);
    })

    test('Deve criar diretório e salvar o arquivo', async () => {
        const fileName = 'dir/test-file.txt'
        const data = Buffer.from('file content')
        await driver.put(fileName, data)
        expect(mockedFs.mkdir).toHaveBeenCalledWith(
            expect.stringContaining('dir'),
            { recursive: true }
        )
        expect(mockedFs.writeFile).toHaveBeenCalledWith(
            path.join(rootFolder, fileName),
            data
        )
    })

    test('Deve ler o arquivo e retornar objeto IFile', async () => {
        const fileName = 'dir/test-file.txt'
        const data = Buffer.from('file content')
        mockedFs.readFile.mockResolvedValue(data)
        const result = await driver.get(fileName)
        expect(mockedFs.readFile).toHaveBeenCalledWith(
            path.join(rootFolder, fileName)
        )
        expect(result.path).toBe(fileName)
        expect(result.data).toEqual(data)
    })

    test('Deve deletar o arquivo', async () => {
        const fileName = 'dir/test-file.txt'
        await driver.delete(fileName)
        expect(mockedFs.unlink).toHaveBeenCalledWith(
            path.join(rootFolder, fileName)
        )
    })

    test('Deve lançar erro ao tentar ler um arquivo que não existe', async () => {
        const fileName = 'dir/test-file.txt'
        mockedFs.readFile.mockRejectedValue(new Error('ENOENT'))
        await expect(driver.get(fileName)).rejects.toThrow('ENOENT')
    })
})