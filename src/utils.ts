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
