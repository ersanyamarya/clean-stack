import { existsSync, readFileSync } from 'fs';
import { loadDataFromFIle } from './load_data';

vi.mock('fs', () => ({
  existsSync: vi.fn(),
  readFileSync: vi.fn(),
}));

describe('loadDataFromFile', () => {
  const mockFilePath = '/test/path/file.json';
  const mockData = { key: 'value' };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should throw error if file does not exist', () => {
    vi.mocked(existsSync).mockReturnValue(false);

    expect(() => loadDataFromFIle(mockFilePath)).toThrow('File does not exist');
    expect(existsSync).toHaveBeenCalledWith(mockFilePath);
  });

  it('should load and parse data from file successfully', () => {
    vi.mocked(existsSync).mockReturnValue(true);
    vi.mocked(readFileSync).mockReturnValue(JSON.stringify(mockData));

    const result = loadDataFromFIle(mockFilePath);

    expect(result).toEqual(mockData);
    expect(existsSync).toHaveBeenCalledWith(mockFilePath);
    expect(readFileSync).toHaveBeenCalledWith(mockFilePath, 'utf-8');
  });
});
