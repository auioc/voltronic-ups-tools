export function groupArray<T>(
    array: T[],
    groupLength: number,
    fixedLength = false,
    placeholder?: T
): T[][] {
    let index = 0;
    const groupedArray = [];

    while (index < array.length) {
        const childArray = array.slice(index, (index += groupLength));

        if (fixedLength) {
            fillArray(placeholder, groupLength, childArray);
        }

        groupedArray.push(childArray);
    }

    return groupedArray;
}

export function fillArray<T>(item: T, length: number, array = [] as T[]) {
    if (array.length >= length) return array;

    for (let i = 0, l = length - array.length; i < l; i++) {
        array.push(item);
    }

    return array;
}
