import { Table } from 'console-table-printer';
import { ComplexOptions } from 'console-table-printer/dist/src/models/external-table';
import { IStringIndexedObject } from 'references';

export function removeEscape(str: string) {
    return str.replace(
        // eslint-disable-next-line no-control-regex
        /\x1b\[([0-9,A-Z]{1,2}(;[0-9]{1,2})?(;[0-9]{3})?)?[m|K]?/gi,
        ''
    );
}

export function getPrintableRowLength(str: string): number {
    return removeEscape(str).length;
}

export function createTable(
    data: { [index: string]: any },
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
    return createTable(
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

export function createThreeTable(
    data: IStringIndexedObject<any>,
    title?: string
): Table {
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

export function horizontalConcat(left: string, right: string): string {
    function getMaxRowLength(rows: string[]): number {
        let l = 0;
        rows.map((r) => removeEscape(r)) // remove \x1b
            .forEach((r) => (l = r.length > l ? r.length : l));
        return l;
    }
    function padEnd(row: string, max_length: number): string {
        const l = getPrintableRowLength(row);
        if (l >= max_length) return row;
        const r = row + ' '.repeat(max_length - l);
        return r;
    }
    const l_rows = left.split('\n');
    const l_row_count = l_rows.length;
    const l_row_length = getMaxRowLength(l_rows);

    const r_rows = right.split('\n');
    const r_row_count = r_rows.length;
    const r_row_length = getMaxRowLength(r_rows);

    const last_row_i = l_row_count > r_row_count ? l_row_count : r_row_count;

    let result = '';
    for (let i = 0; i < last_row_i; i++) {
        result +=
            (l_row_count > i
                ? padEnd(l_rows[i], l_row_length)
                : ' '.repeat(l_row_length)) +
            (r_row_count > i
                ? padEnd(r_rows[i], r_row_length)
                : ' '.repeat(r_row_length)) +
            (i + 1 < last_row_i ? '\n' : '');
    }

    return result;
}
