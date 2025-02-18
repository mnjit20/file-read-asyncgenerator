import * as fs from 'fs';
import * as path from 'path';

interface JsonFile {
    file: string;
    content: any;
}

async function* readJsonFiles(directory: string): AsyncGenerator<JsonFile, void, unknown> {
    const files = await fs.promises.readdir(directory);

    for (const file of files) {
        const filePath = path.join(directory, file);
        const stat = await fs.promises.stat(filePath);

        if (stat.isDirectory()) {
            yield* readJsonFiles(filePath); // Recursively read subdirectories
        } else if (stat.isFile() && path.extname(file) === '.json') {
            const fileContent = await fs.promises.readFile(filePath, 'utf-8');
            try {
                const jsonData = JSON.parse(fileContent);
                yield { file: filePath, content: jsonData };
            } catch (error) {
                console.error(`Error parsing JSON from file: ${filePath}`, error);
            }
        }
    }
}

(async () => {
    const directory1 = './input'; // Change to your first directory (Windows path)
    const directory2 = './output'; // Change to your second directory (Windows path)

    try {
        const files1: JsonFile[] = [];
        const files2: JsonFile[] = [];

        for await (const jsonData of readJsonFiles(directory1)) {
            files1.push(jsonData);
        }

        for await (const jsonData of readJsonFiles(directory2)) {
            files2.push(jsonData);
        }

        console.log('Comparing files...');
        files1.forEach((file1: JsonFile) => {
            const match = files2.find((file2: JsonFile) => path.basename(file1.file) === path.basename(file2.file));
            if (match) {
                if (JSON.stringify(file1.content) === JSON.stringify(match.content)) {
                    console.log(`Match found: ${file1.file} and ${match.file} have the same content.`);
                } else {
                    console.log(`Difference found: ${file1.file} and ${match.file} have different content.`);
                }
            } else {
                console.log(`No matching file for ${file1.file} in the second directory.`);
            }
        });
    } catch (error) {
        console.error('Error reading JSON files:', error);
    }
})();