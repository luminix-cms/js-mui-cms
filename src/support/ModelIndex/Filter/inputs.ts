/* eslint-disable @typescript-eslint/no-explicit-any */

import _ from 'lodash';

export const changeValueFromArray = (input: any): any =>
{
    if (!Array.isArray(input)) {
        console.log('1 not array. will not change...', input);
        return input;
    }
    console.log('1 is array. will change...', input);

    let output: any;
    
    if (_.isEmpty(input)) {
        output = '';
    } else {
        output = input[0];
    }

    return output;
};

export const changeValueToArray = (input: any): any =>
{
    if (Array.isArray(input)) {
        console.log('2 is array. will not change...', input);
        return input;
    }
    console.log('2 not array. will change...', input);

    let output: any;

    if (_.isEmpty(input)) {
        output = [];
    } else {
        output = [input, ''];
    }

    return output;
};
