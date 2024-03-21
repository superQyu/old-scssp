const { spawn } = require('child_process');
const argv = process.argv.slice(2);

const name = argv
  .slice(argv.length / 2 + (argv.length % 2 === 0 ? 0 : 1))
  .map((name) => `apps/${name}`)[0];

const run = spawn(process.platform === 'win32' ? 'pnpm.cmd' : 'pnpm', ['run', '-C', name, 'dev']);

run.stdout.on('data', (res) => console.log(`${res}`));
run.stderr.on('data', (err) => console.error(`${err}`));
run.on('close', (code) =>
  console.error(
    `\x1B[31mchild process exited with code ${code} : No startup project specified\x1B[0m`
  )
);
run.on('error', (code) => console.error(`\x1B[31mcode\x1B[0m`));
