import { Command } from 'commander';

const program = new Command();
program
    .requiredOption('-c, --serialport <path>', 'serial port')
    .option('-d, --delay <second>', 'poll delay', '2')
    .option('-t, --polling-times <n>', 'auto exit after polling N times', '0')
    .option('-s, --display-mode <mode>', 'display mode', 'raw');

program.addHelpText(
    'after',
    `Shortcuts:
  q  exit
  s  switch display mode cyclically among 'Raw', 'Summary' and 'Verbose'`
);

program.parse(process.argv);

export default program;
