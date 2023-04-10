import {
    Analysis,
    Assignment,
    Point,
} from '@/resources/analysis/analysis.interface';
var munkres = require('munkres-js');

function lookBestOption(dataObj: Analysis): Assignment {
    const matrix: number[][] = [];
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
    function findIndex(L: Array<Array<number>>, n: number) {
        return L.findIndex((subArray) => subArray.includes(n));
    }
    function canPlace(nums: Array<number>) {
        const stack = [
            {
                index: 0,
                nums: nums,
            },
        ];

        while (stack.length) {
            const state = stack.pop() as any;
            const { index, nums } = state;

            if (index === nums.length - 1) {
                const L1 = [...L];
                const array = [...nums];
                for (let j = 0; j < array.length; j++) {
                    const index = findIndex(L1, array[j]);
                    if (index === -1) {
                        break;
                    }
                    L1.splice(index, 1);
                }
                if (L1.length === 0) {
                    return true;
                }
            } else {
                for (let i = index; i < nums.length; i++) {
                    const newNums = [...nums];
                    const temp = newNums[index];
                    newNums[index] = newNums[i];
                    newNums[i] = temp;

                    stack.push({
                        index: index + 1,
                        nums: newNums,
                    });
                }
            }
        }

        return false;
    }
 
    bool = !canPlace(N);

    if (bool) {
        throw new Error('Problem has no solution');
    }

    const indexes = munkres(matrix);
  
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
