import * as SerialPort from 'serialport';

export const port = new SerialPort(
    'COM3',
    {
        baudRate: 2400,
        dataBits: 8,
        stopBits: 1,
        parity: 'none',
    },
    (err) => {
        if (err) {
            console.error('Open serial port failed: ', err.message);
            process.exit(1);
        }
    }
);

process.on('SIGINT', () => {
    port.close();
    process.exit();
});
