
import _ from 'lodash';

export const fromIsoString = (value: Date | string) => {
    
    const date = value instanceof Date
        ? value
        : new Date(value);

    const year = `${date.getFullYear()}`;
    const month = `${_.padStart(`${date.getMonth() + 1}`, 2, '0')}`;
    const day = `${_.padStart(`${date.getDate()}`, 2, '0')}`;
    const hour = `${_.padStart(`${date.getHours()}`, 2, '0')}`;
    const minute = `${_.padStart(`${date.getMinutes()}`, 2, '0')}`;

    return `${year}-${month}-${day}T${hour}:${minute}`;
}
