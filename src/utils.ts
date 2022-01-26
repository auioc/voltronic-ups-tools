import { Table } from 'console-table-printer';
import { ComplexOptions } from 'console-table-printer/dist/src/models/external-table';
import { IData } from './data/base';

export function delay(ms: number) {
    return new Promise<void>((resolve) => {
        setTimeout(() => resolve(), ms);
    });
}

export function isoDate(timestamp: number): string {
    const d = new Date(timestamp);
    return (
        d.getFullYear() +
        '-' +
        (d.getMonth() + 1).toString().padStart(2, '00') +
        '-' +
        d.getDate().toString().padStart(2, '00') +
        'T' +
        d.getHours().toString().padStart(2, '00') +
        ':' +
        d.getMinutes().toString().padStart(2, '00') +
        ':' +
        d.getSeconds().toString().padStart(2, '00') +
        '.' +
        d.getMilliseconds().toString().padStart(3, '000')
    );
}

export function createTable(
    data: IData,
    options: ComplexOptions,
    shouldAdd: (key: string) => boolean,
    createRow: (key: string, value: any) => { [index: string]: any }
): Table {
    const table = new Table(options);

    for (const key in data) {
        if (Object.prototype.hasOwnProperty.call(data, key) && shouldAdd(key)) {
            table.addRow(createRow(key, data[key]));
        }
    }

    return table;
}

function parsePrototypeName(name: string): string {
    return name
        .substring(2) // remove prefix
        .split('_')
        .map((c) => c.charAt(0).toUpperCase() + c.slice(1)) // capitalize first letter
        .join(' ');
}

function getUnitByName(name: string): string {
    if (name.indexOf('temperature') !== -1) return '°C';
    if (name.indexOf('voltage') !== -1) return 'V';
    if (name.indexOf('current') !== -1) return 'A';
    if (name.indexOf('frequency') !== -1) return 'Hz';
    if (name.indexOf('level') !== -1) return '%';
    return '';
}

export function createTwoTable(data: IData, title?: string): Table {
    return createTable(
        data,
        {
            columns: [
                { name: 'name', title: 'Name', alignment: 'left' },
                { name: 'value', title: 'Value', alignment: 'left' },
            ],
            title: title,
        },
        (key) => key.slice(0, 2) === 'b_',
        (key, value) => ({
            name: parsePrototypeName(key),
            value: value,
        })
    );
}

export function createThreeTable(data: IData, title?: string): Table {
    return createTable(
        data,
        {
            columns: [
                { name: 'name', title: 'Name', alignment: 'left' },
                { name: 'value', title: 'Value', alignment: 'left' },
                { name: 'unit', title: 'Unit', alignment: 'left' },
            ],
            title: title,
        },
        (key) => key.slice(0, 2) === 't_',
        (key, value) => ({
            name: parsePrototypeName(key),
            value: value,
            unit: getUnitByName(key),
        })
    );
}
