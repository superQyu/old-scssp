const fs = require('fs');
const path = require('path');
const argv = process.argv.slice(2);

const ignoreList = ['.git', '.husky', '.idea', '.github', 'node_modules'];

function generateDirectoryStructure(dirPath, targetFile, indentation = '') {
  const files = fs.readdirSync(dirPath, { withFileTypes: true });
  let structure = '';
  files.forEach((file, index) => {
    const filePath = path.join(dirPath, file.name);
    const isLast = index === files.length - 1;

    structure += `${indentation}${isLast ? '└──' : '├──'} ${file.name}\n`;

    if (file.isDirectory() && ignoreList.indexOf(file.name) == -1) {
      const nestedIndentation = `${indentation}${isLast ? '   ' : '│  '}`;
      structure += generateDirectoryStructure(filePath, targetFile, nestedIndentation);
    }
  });

  if (!indentation) {
    fs.writeFileSync(targetFile, structure);
    console.log('\x1B[32m%s\x1B[0m', `Directory structure generated in ${targetFile}`);
  }

  return structure;
}

const rootDirectory =
  argv
    .slice(argv.length / 2 + (argv.length % 2 === 0 ? 0 : 1))
    .map((name) => `${__dirname}\\${name}`)[0] || __dirname;
const outputFile = 'treer.txt';

generateDirectoryStructure(rootDirectory, `${rootDirectory}\\${outputFile}`);
