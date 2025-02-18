import * as fs from 'fs';
import * as path from 'path';

async function* readJsonFiles(input: string): AsyncGenerator<any, void, unknown> {
    const files = await fs.promises.readdir(input);
    console.log("🚀 ~ function*readJsonFiles ~ files:", files)

    for (const file of files) {
        const filePath = path.join(input, file);
        const stat = await fs.promises.stat(filePath);

        if (stat.isDirectory()) {
            yield* readJsonFiles(filePath); // Recursively read subdirectories
        } else if (stat.isFile() && path.extname(file) === '.json') {
            const fileContent = await fs.promises.readFile(filePath, 'utf-8');
            try {
                const jsonData = JSON.parse(fileContent);
                yield jsonData;
            } catch (error) {
                console.error(`Error parsing JSON from file: ${filePath}`, error);
            }
        }
    }
}

(async () => {
    const input = './input'; // Change to your directory (Windows path)
    const output = './output'; // Change to your directory (Windows path)
    try {
        for await (const jsonData of readJsonFiles(input)) {
            console.log('JSON data:', jsonData);
        }
    } catch (error) {
        console.error('Error reading JSON files:', error);
    }
})();
