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

export function padEnd(
    str: string,
    maxLength: number,
    fillString = ' ',
    ignoreEscape = true
): string {
    const l = ignoreEscape ? getPrintableRowLength(str) : str.length;
    if (l >= maxLength) return str;
    const r = str + fillString.repeat(maxLength - l);
    return r;
}

export function horizontalConcat(left: string, right: string): string {
    function getMaxRowLength(rows: string[]): number {
        let l = 0;
        rows.map((r) => removeEscape(r)) // remove \x1b
            .forEach((r) => (l = r.length > l ? r.length : l));
        return l;
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
