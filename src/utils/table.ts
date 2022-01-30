import { Table } from 'console-table-printer';
import {
    ColumnOptionsRaw,
    ComplexOptions,
} from 'console-table-printer/dist/src/models/external-table';
import { RowOptionsRaw } from 'console-table-printer/dist/src/utils/table-helpers';
import { IKeyValueObject, IStringIndexedObject } from 'references';
import { groupArray } from './array';
import { horizontalConcat } from './string';

export function createTableFromStringIndexedObject(
    data: IStringIndexedObject<any>,
    options: ComplexOptions,
    shouldAdd: (key: string, value: any) => boolean,
    createRow: (key: string, value: any) => { [index: string]: any }
): Table {
    const table = new Table(options);

    for (const key in data) {
        if (
            Object.prototype.hasOwnProperty.call(data, key) &&
            shouldAdd(key, data[key])
        ) {
            table.addRow(createRow(key, data[key]));
        }
    }

    return table;
}

export function createNameValueTable(
    data: IStringIndexedObject<any>,
    title?: string
): Table {
    return createTableFromStringIndexedObject(
        data,
        {
            columns: [
                { name: 'name', title: 'Name', alignment: 'left' },
                { name: 'value', title: 'Value', alignment: 'left' },
            ],
            title: title,
        },
        () => true,
        (key, value) => ({ name: key, value: value })
    );
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

export function createTwoTable(
    data: IStringIndexedObject<any>,
    title?: string
): Table {
    return createTableFromStringIndexedObject(
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

export function createThreeTable(
    data: IStringIndexedObject<any>,
    title?: string
): Table {
    return createTableFromStringIndexedObject(
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

export function createKeyValueTable(
    data: [IKeyValueObject<any>, RowOptionsRaw][],
    tableTitle?: string,
    keyColumnOptions?: ColumnOptionsRaw,
    ValueColumnOptions?: ColumnOptionsRaw
): Table {
    const table = new Table({
        columns: [
            keyColumnOptions === undefined
                ? { name: 'key', title: 'Key', alignment: 'left' }
                : ((c) => {
                      c.name = 'key';
                      return c;
                  })(keyColumnOptions),
            ValueColumnOptions === undefined
                ? { name: 'value', title: 'Value', alignment: 'left' }
                : ((c) => {
                      c.name = 'value';
                      return c;
                  })(ValueColumnOptions),
        ],
        title: tableTitle,
    });

    data.forEach((row) => {
        table.addRow(row[0], row[1]);
    });

    return table;
}

export function splitTable(
    table: Table,
    maxRows: number,
    fixedRows = false
): string {
    const rows = table.table.rows;
    if (rows.length < maxRows) {
        return table.render();
    }

    const placeholder = { text: {}, color: '', separator: false };

    let result = '';
    groupArray(rows, maxRows, fixedRows, placeholder).forEach((rows) => {
        table.table.rows = rows;
        result = horizontalConcat(result, table.render());
    });

    return result;
}

export function getColorByRange(
    value: number,
    low: number,
    high: number,
    reverse = false,
    noGreen = true
): RowOptionsRaw {
    if (value > high) {
        return noGreen ? {} : { color: reverse ? 'green' : 'red' };
    }
    if (value > low) {
        return { color: 'yellow' };
    }
    return noGreen ? {} : { color: reverse ? 'red' : 'green' };
}

export function getColorByFixed(
    value: number,
    fixedValue: number,
    low: number,
    high: number,
    noGreen = true
): RowOptionsRaw {
    const d = Math.abs(fixedValue - value);
    if (d > high) {
        return { color: 'red' };
    }
    if (d > low) {
        return { color: 'yellow' };
    }
    return noGreen ? {} : { color: 'green' };
}
