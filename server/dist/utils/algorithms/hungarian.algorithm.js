"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.lookBestOption = void 0;
var munkres = require('munkres-js');
function lookBestOption(dataObj) {
    const matrix = [];
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
    const result = [];
    for (const [row, column] of indexes) {
        const data = dataObj.data[row][column];
        result.push({ row, column, data });
        maxTotalDamage += data;
    }
    return { maxTotalDamage, result };
}
exports.lookBestOption = lookBestOption;
