import { Command } from 'commander';

const program = new Command();
program
    .requiredOption('-c, --serialport <path>', 'serial port')
    .option('-d, --delay <second>', 'poll delay', '2')
    .option('-t, --polling-times <n>', 'auto exit after polling N times', '0')
    .option('-s, --summary', 'summary mode');

program.parse(process.argv);

export default program;
