import { Command } from 'commander';

const program = new Command();
program
    .requiredOption('-c, --serialport <path>', 'serial port')
    .option('-d, --delay <second>', 'poll delay', '2')
    .option('-s, --summary', 'summary mode');

program.parse(process.argv);

export default program;
