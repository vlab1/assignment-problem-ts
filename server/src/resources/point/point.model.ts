import { DataTypes, Optional } from 'sequelize'
import * as sequelize from 'sequelize-typescript'
import Point from '@/resources/point/point.interface';
import DamageModel from '@/resources/damage/damage.model';

@sequelize.Table
export default class PointModel extends sequelize.Model<Point, Optional<Point, 'point_id'>> {
	@sequelize.PrimaryKey
	@sequelize.AutoIncrement
	@sequelize.AllowNull(false)
	@sequelize.Column(sequelize.DataType.INTEGER)
	point_id!: number

	@sequelize.AllowNull(false)
	@sequelize.Unique
	@sequelize.Column(sequelize.DataType.STRING)
	name_B!: string

	@sequelize.AllowNull
	@sequelize.Column(sequelize.DataType.BOOLEAN)
	z?: boolean

	@sequelize.HasMany(() => DamageModel  , {
		onUpdate: "CASCADE",
		onDelete: "CASCADE",
		hooks: true
	})
	damages!: DamageModel[];

	@sequelize.AllowNull
	@sequelize.CreatedAt
	@sequelize.Column(sequelize.DataType.DATE)
	createdAt?: Date

	@sequelize.AllowNull
	@sequelize.UpdatedAt
	@sequelize.Column(sequelize.DataType.DATE)
	updatedAt?: Date
}
