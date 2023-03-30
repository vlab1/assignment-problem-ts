"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const damage_model_1 = __importDefault(require("@/resources/damage/damage.model"));
const entity_model_1 = __importDefault(require("@/resources/entity/entity.model"));
const point_model_1 = __importDefault(require("@/resources/point/point.model"));
const hungarian_algorithm_1 = require("@/utils/algorithms/hungarian.algorithm");
class AnalysisService {
    constructor() {
        this.damage = damage_model_1.default;
        this.entity = entity_model_1.default;
        this.point = point_model_1.default;
    }
    // private lookBestOption(dataObj: Analysis): Assignment {
    //     const numRows = dataObj.data.length;
    //     const numCols = dataObj.data[0].length;
    //     // Генерация всех возможных вариантов
    //     const options: Point[][] = [];
    //     const permute = (i: number, assignment: Point[]) => {
    //         if (i === numRows) {
    //             options.push([...assignment]);
    //         } else {
    //             for (let j = 0; j < numCols; j++) {
    //                 assignment[i] = {
    //                     row: i,
    //                     column: j,
    //                     data: dataObj.data[i][j],
    //                 };
    //                 permute(i + 1, assignment);
    //             }
    //         }
    //     };
    //     permute(0, Array(numRows).fill({ row: '', column: '', data: 0 }));
    //     // Поиск наибольшого суммарного урона
    //     let maxTotalDamage = 0;
    //     let bestAssignment: Point[] = [];
    //     for (const assignment of options) {
    //         const rowSums = Array(numRows).fill(0);
    //         const colSums = Array(numCols).fill(0);
    //         let totalDamage = 0;
    //         for (const point of assignment) {
    //             const { row, column, data } = point;
    //             rowSums[row] += data;
    //             colSums[column] -= -data;
    //             totalDamage += data;
    //         }
    //         const isFeasible =
    //             rowSums.every((sum) => sum > 0) &&
    //             colSums.every((sum) => sum > 0);
    //         if (isFeasible && totalDamage > maxTotalDamage) {
    //             maxTotalDamage = totalDamage;
    //             bestAssignment = assignment;
    //         }
    //     }
    //     return { maxTotalDamage, result: bestAssignment };
    // }
    // private async dbFilling(data: Analysis): Promise<void | Error> {
    //     try {
    //         await this.entity.destroy({
    //             truncate: true,
    //             cascade: true,
    //         });
    //         await this.point.destroy({
    //             truncate: true,
    //             cascade: true,
    //         });
    //         const points_ids: Array<number> = [];
    //         const entities_ids: Array<number> = [];
    //         await Promise.all(
    //             data.columns.map(async (item) => {
    //                 const entity = await this.entity.create({
    //                     name_A: item,
    //                     y: true,
    //                 });
    //                 entities_ids.push(entity.dataValues.entity_id);
    //             })
    //         );
    //         await Promise.all(
    //             data.rows.map(async (item) => {
    //                 const point = await this.point.create({
    //                     name_B: item,
    //                     z: true,
    //                 });
    //                 points_ids.push(point.dataValues.point_id);
    //             })
    //         );
    //          points_ids.sort((a: any, b: any) => a - b);
    //          entities_ids.sort((a: any, b: any) => a - b);
    //         await Promise.all(
    //             data.data.map(async (array, point_row) => {
    //                 array.map(async (item, entity_column) => {
    //                     await this.damage.create({
    //                         entity_id: entities_ids[entity_column],
    //                         point_id: points_ids[point_row],
    //                         C: item,
    //                     });
    //                 });
    //             })
    //         );
    //     } catch (error: any) {
    //         throw new Error(error.message);
    //     }
    // }
    dbFilling(data) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                yield Promise.all([
                    this.entity.destroy({ truncate: true, cascade: true }),
                    this.point.destroy({ truncate: true, cascade: true }),
                ]);
                const points_ids = [];
                const entities_ids = [];
                yield Promise.all(data.columns.map((item) => __awaiter(this, void 0, void 0, function* () {
                    const entity = yield this.entity.create({
                        name_A: item,
                        y: true,
                    });
                    entities_ids.push(entity.dataValues.entity_id);
                })));
                yield Promise.all(data.rows.map((item) => __awaiter(this, void 0, void 0, function* () {
                    const point = yield this.point.create({
                        name_B: item,
                        z: true,
                    });
                    points_ids.push(point.dataValues.point_id);
                })));
                points_ids.sort((a, b) => a - b);
                entities_ids.sort((a, b) => a - b);
                const damage = data.data.flatMap((array, point_row) => array.map((item, entity_column) => ({
                    entity_id: entities_ids[entity_column],
                    point_id: points_ids[point_row],
                    C: item,
                })));
                yield this.damage.bulkCreate(damage);
            }
            catch (error) {
                throw new Error(error.message);
            }
        });
    }
    analysis(columns, rows, data) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const analysis = (0, hungarian_algorithm_1.lookBestOption)({ columns, rows, data });
                return analysis;
            }
            catch (error) {
                throw new Error(error.message);
            }
        });
    }
    save(columns, rows, data) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                yield this.dbFilling({ columns, rows, data });
            }
            catch (error) {
                throw new Error(error.message);
            }
        });
    }
    delete0(columns, rows, data) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                yield this.entity.destroy({
                    where: {},
                    truncate: true,
                    cascade: true,
                });
                yield this.point.destroy({
                    where: {},
                    truncate: true,
                    cascade: true,
                });
            }
            catch (error) {
                throw new Error(error.message);
            }
        });
    }
    find() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const pointsData = [];
                const entitiesData = [];
                const damageData = [];
                const points = yield this.point.findAll();
                points.map((item) => {
                    pointsData.push(item.dataValues);
                });
                const entities = yield this.entity.findAll();
                entities.map((item) => {
                    entitiesData.push(item.dataValues);
                });
                const damage = yield this.damage.findAll();
                damage.map((item) => {
                    damageData.push(item.dataValues);
                });
                const damageArray = [];
                for (let i = 0; i < pointsData.length; i++) {
                    const array = damageData.filter((item) => item.point_id === pointsData[i].point_id);
                    damageArray.push(array);
                }
                damageArray.sort((a, b) => a[0].point_id - b[0].point_id);
                pointsData.sort((a, b) => a.point_id - b.point_id);
                entitiesData.sort((a, b) => a.entity_id - b.entity_id);
                for (let i = 0; i < damageArray.length; i++) {
                    damageArray[i].sort((a, b) => a.entity_id - b.entity_id);
                }
                let result = [];
                for (let i = 0; i < pointsData.length + 1; i++) {
                    let array = [];
                    if (i === 0) {
                        array.push('');
                        for (let k = 0; k < entitiesData.length; k++) {
                            array.push(entitiesData[k].name_A);
                        }
                        result.push(array);
                    }
                    else {
                        array.push(pointsData[i - 1].name_B);
                        for (let m = 0; m < damageArray.length; m++) {
                            array.push(damageArray[i - 1][m].C + '');
                        }
                        result.push(array);
                    }
                }
                return result;
            }
            catch (error) {
                throw new Error(error.message);
            }
        });
    }
}
exports.default = AnalysisService;
