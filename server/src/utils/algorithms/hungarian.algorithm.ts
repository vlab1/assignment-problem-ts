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

    //
    // function findIndex(L: Array<Array<number>>, n: number) {
    //     for (let i = 0; i < L.length; i++) {
    //         if (L[i].includes(n)) {
    //             return i;
    //         }
    //     }
    //     return -1; // если N не найден в L
    // }
    // function permute(nums: Array<number>) {
    //     const result = [] as any;

    //     function dfs(current: any, remaining: any) {
    //         if (remaining.length === 0) {
    //             result.push(current);
    //             return;
    //         }

    //         for (let i = 0; i < remaining.length; i++) {
    //             dfs(
    //                 current.concat(remaining[i]),
    //                 remaining.slice(0, i).concat(remaining.slice(i + 1))
    //             );
    //         }
    //     }

    //     dfs([], nums);

    //     return result;
    // }

    // const permutations = permute(N);
    // const answers = [] as Array<number>;
    // permutations.forEach((array: Array<number>, i: number) => {
    //     let L1 = JSON.parse(JSON.stringify(dataObj.rows_L));
    //     array.forEach((item: number, j: number) => {
    //         const index = findIndex(L1, item);
    //         if (index > -1) {
    //             L1.splice(index, 1);
    //         }
    //     });
    //     answers.push(L1.length);
    // });
    // if (!answers.includes(0)) {
    //     bool = true;
    // }

    // function permute(nums: Array<number>) {
    //     const result = [] as any;

    //     function swap(i: number, j: number) {
    //         const temp = nums[i];
    //         nums[i] = nums[j];
    //         nums[j] = temp;
    //     }

    //     function generate(index: number) {
    //         if (index === nums.length - 1) {
    //             result.push([...nums]);
    //             return;
    //         }

    //         generate(index + 1);

    //         for (let i = index + 1; i < nums.length; i++) {
    //             swap(index, i);
    //             generate(index + 1);
    //             swap(index, i);
    //         }
    //     }

    //     generate(0);

    //     return result;
    // }

    // function findIndex(L: Array<Array<number>>, n: number) {
    //     return L.findIndex((subArray) => subArray.includes(n));
    // }

    // function permute(nums: Array<number>) {
    //     const result = [];

    //     const stack = [
    //         {
    //             index: 0,
    //             nums: nums,
    //         },
    //     ];

    //     while (stack.length) {
    //         const state = stack.pop() as any;
    //         const { index, nums } = state;

    //         if (index === nums.length - 1) {
    //             result.push([...nums]);
    //         } else {
    //             for (let i = index; i < nums.length; i++) {
    //                 const newNums = [...nums];
    //                 const temp = newNums[index];
    //                 newNums[index] = newNums[i];
    //                 newNums[i] = temp;

    //                 stack.push({
    //                     index: index + 1,
    //                     nums: newNums,
    //                 });
    //             }
    //         }
    //     }

    //     return result;
    // }

    // function canPlace(L: Array<Array<number>>, N: Array<number>) {
    //     const permutations = permute(N);
    //     for (let i = 0; i < permutations.length; i++) {
    //         const L1 = [...L];
    //         const array = permutations[i];
    //         for (let j = 0; j < array.length; j++) {
    //             const index = findIndex(L1, array[j]);
    //             if (index === -1) {
    //                 break;
    //             }
    //             L1.splice(index, 1);
    //         }
    //         if (L1.length === 0) {
    //             return true;
    //         }
    //     }
    //     return false;
    // }
    // bool = !canPlace(L, N);

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

    //

    // for (let i = 0; i < L.length; i++) {
    //     L[i] = [...new Set(L[i])];
    // }
    // L = L.flat();
    // const countL = L.reduce((acc: any, val: any) => {
    //     acc[val] = acc[val] ? acc[val] + 1 : 1;
    //     return acc;
    // }, {});
    // const countN = N.reduce((acc: any, val: any) => {
    //     acc[val] = acc[val] ? acc[val] + 1 : 1;
    //     return acc;
    // }, {});
    // for (let key in countN) {
    //     if (key in countL && countN[key] > countL[key]) {
    //         bool = true;
    //     }
    // }
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
