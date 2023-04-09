import {
    Analysis,
    Assignment,
    Point,
} from '@/resources/analysis/analysis.interface';
var munkres = require('munkres-js');

function lookBestOption(dataObj: Analysis): Assignment {
    const matrix: number[][] = [];
    // Меняем все значения на отрицательные. Теперь самое максимальное число - минимальное
    // for (let i = 0; i < dataObj.data.length; i++) {
    //     matrix.push([]);
    //     for (let j = 0; j < dataObj.data[i].length; j++) {
    //         matrix[i].push(-1 * dataObj.data[i][j]);
    //     }
    // }
    for (let i = 0; i < dataObj.data.length; i++) {
        matrix.push([]);
        for (let j = 0; j < dataObj.data[i].length; j++) {
            if (dataObj.columns_S[i] > dataObj.rows_H[j]) {
                matrix[i].push(Infinity);
            } else if (!dataObj.rows_L[j].includes(dataObj.columns_N[i])) {
                matrix[i].push(Infinity);
            } else {
                matrix[i].push(-1 * dataObj.data[i][j]);
            }
        }
    }
    let bool = false;
    for (let i = 0; i < matrix.length; i++) {
        let count = 0;
        for (let j = 0; j < matrix.length; j++) {
            if (matrix[i][j] === Infinity) {
                count++;
            }
        }
        if (count === matrix.length) {
            bool = true;
        }
    }
    for (let i = 0; i < matrix.length; i++) {
        let count = 0;
        for (let j = 0; j < matrix.length; j++) {
            if (matrix[j][i] === Infinity) {
                count++;
            }
        }
        if (count === matrix.length) {
            bool = true;
        }
    }
    let L = JSON.parse(JSON.stringify(dataObj.rows_L));
    let N = JSON.parse(JSON.stringify(dataObj.columns_N));
    for (let i = 0; i < L.length; i++) {
        L[i] = [...new Set(L[i])];
    }
    L = L.flat();
    const countL = L.reduce((acc: any, val: any) => {
        acc[val] = acc[val] ? acc[val] + 1 : 1;
        return acc;
    }, {});
    const countN = N.reduce((acc: any, val: any) => {
        acc[val] = acc[val] ? acc[val] + 1 : 1;
        return acc;
    }, {});
    for (let key in countN) {
        if (key in countL && countN[key] > countL[key]) {
            bool = true;
        }
    }
    if (bool) {
        throw new Error('Problem has no solution');
    }
    // Решение задачи о назначениях с помощью алгоритма венгерского
    const indexes = munkres(matrix);
    // Подсчет суммарного урона и формирование результата
    let maxTotalDamage = 0;
    const result: Point[] = [];
    for (const [row, column] of indexes) {
        const data = dataObj.data[row][column];
        result.push({ row, column, data });
        maxTotalDamage += data;
    }

    return { maxTotalDamage, result };
}

export { lookBestOption };
