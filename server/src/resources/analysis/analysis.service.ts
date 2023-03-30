import DamageModel from '@/resources/damage/damage.model';
import EntityModel from '@/resources/entity/entity.model';
import PointModel from '@/resources/point/point.model';
import {
    Analysis,
    Assignment,
    Point,
} from '@/resources/analysis/analysis.interface';
import { lookBestOption } from '@/utils/algorithms/hungarian.algorithm';

class AnalysisService {
    private damage = DamageModel;
    private entity = EntityModel;
    private point = PointModel;

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
   
    private async dbFilling(data: Analysis): Promise<void | Error> {
        try {
            await Promise.all([
                this.entity.destroy({ truncate: true, cascade: true }),
                this.point.destroy({ truncate: true, cascade: true }),
            ]);
            const points_ids: Array<number> = [];
            const entities_ids: Array<number> = [];
            await Promise.all(
                data.columns.map(async (item) => {
                    const entity = await this.entity.create({
                        name_A: item,
                        y: true,
                    });
                    entities_ids.push(entity.dataValues.entity_id);
                })
            );
            await Promise.all(
                data.rows.map(async (item) => {
                    const point = await this.point.create({
                        name_B: item,
                        z: true,
                    });
                    points_ids.push(point.dataValues.point_id);
                })
            );
            points_ids.sort((a: any, b: any) => a - b);
            entities_ids.sort((a: any, b: any) => a - b);

            const damage = data.data.flatMap((array, point_row) =>
                array.map((item, entity_column) => ({
                    entity_id: entities_ids[entity_column],
                    point_id: points_ids[point_row],
                    C: item,
                }))
            );
            await this.damage.bulkCreate(damage);
        } catch (error: any) {
            throw new Error(error.message);
        }
    }

    public async analysis(
        columns: Array<string>,
        rows: Array<string>,
        data: Array<Array<number>>
    ): Promise<Assignment | Error> {
        try {
            const analysis = lookBestOption({ columns, rows, data });
            return analysis;
        } catch (error: any) {
            throw new Error(error.message);
        }
    }

    public async save(
        columns: Array<string>,
        rows: Array<string>,
        data: Array<Array<number>>
    ): Promise<void | Error> {
        try {
            await this.dbFilling({ columns, rows, data });
        } catch (error: any) {
            throw new Error(error.message);
        }
    }

    public async delete0(
        columns: Array<string>,
        rows: Array<string>,
        data: Array<Array<number>>
    ): Promise<void | Error> {
        try {
            await this.entity.destroy({
                where: {},
                truncate: true,
                cascade: true,
            });
            await this.point.destroy({
                where: {},
                truncate: true,
                cascade: true,
            });
        } catch (error: any) {
            throw new Error(error.message);
        }
    }

    public async find(): Promise<Array<Array<string>> | Error> {
        try {
            const pointsData = [] as any;
            const entitiesData = [] as any;
            const damageData = [] as any;

            const points = await this.point.findAll();
            points.map((item) => {
                pointsData.push(item.dataValues);
            });
            const entities = await this.entity.findAll();
            entities.map((item) => {
                entitiesData.push(item.dataValues);
            });
            const damage = await this.damage.findAll();
            damage.map((item) => {
                damageData.push(item.dataValues);
            });

            const damageArray = [] as any;
            for (let i = 0; i < pointsData.length; i++) {
                const array = damageData.filter(
                    (item: any) => item.point_id === pointsData[i].point_id
                );
                damageArray.push(array);
            }
            damageArray.sort((a: any, b: any) => a[0].point_id - b[0].point_id);
            pointsData.sort((a: any, b: any) => a.point_id - b.point_id);
            entitiesData.sort((a: any, b: any) => a.entity_id - b.entity_id);
            for (let i = 0; i < damageArray.length; i++) {
                damageArray[i].sort(
                    (a: any, b: any) => a.entity_id - b.entity_id
                );
            }
            let result = [] as Array<Array<string>>;
            for (let i = 0; i < pointsData.length + 1; i++) {
                let array = [];
                if (i === 0) {
                    array.push('');
                    for (let k = 0; k < entitiesData.length; k++) {
                        array.push(entitiesData[k].name_A);
                    }
                    result.push(array);
                } else {
                    array.push(pointsData[i - 1].name_B);
                    for (let m = 0; m < damageArray.length; m++) {
                        array.push(damageArray[i - 1][m].C + '');
                    }
                    result.push(array);
                }
            }
            return result;
        } catch (error: any) {
            throw new Error(error.message);
        }
    }
}

export default AnalysisService;
