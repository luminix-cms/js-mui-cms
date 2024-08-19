
export const trim = (value: string, mask: string) => {
    while (~mask.indexOf(value[0])) {
        value = value.slice(1);
    }
    while (~mask.indexOf(value[value.length - 1])) {
        value = value.slice(0, -1);
    }
    return value;
}

export const removeSurrounding = (value: string, prefix: string, suffix: string) => {
    if (value.startsWith(prefix)) {
        value = value.slice(prefix.length);
    }
    if (value.endsWith(suffix)) {
        value = value.slice(0, -suffix.length);
    }
    return value;
}
