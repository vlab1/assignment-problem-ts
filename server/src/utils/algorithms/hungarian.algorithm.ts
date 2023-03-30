import {
    Analysis,
    Assignment,
    Point,
} from '@/resources/analysis/analysis.interface';
var munkres = require('munkres-js');

function lookBestOption(dataObj: Analysis): Assignment {
    const matrix: number[][] = [];
    // Меняем все значения на отрицательные. Теперь самое максимальное число - минимальное
    for (let i = 0; i < dataObj.data.length; i++) {
        matrix.push([]);
        for (let j = 0; j < dataObj.data[i].length; j++) {
            matrix[i].push(-1 * dataObj.data[i][j]);
        }
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
