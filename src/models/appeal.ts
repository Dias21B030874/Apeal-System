import { DataTypes, Model, Sequelize } from 'sequelize';
import sequelize from '../utils/database';

class Appeal extends Model {

  public id!: number;
  public topic!: string;
  public text!: string;
  public status!: 'Новое' | 'В работе' | 'Завершено' | 'Отменено';
  public resolution!: string | null;
  public cancellationReason!: string | null;
  public createdAt!: Date;
  public updatedAt!: Date;
}

Appeal.init({
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  topic: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  text: {
    type: DataTypes.TEXT,
    allowNull: false,
  },
  status: {
    type: DataTypes.ENUM('Новое', 'В работе', 'Завершено', 'Отменено'),
    defaultValue: 'Новое',
  },
  resolution: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
  cancellationReason: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
}, {
  sequelize,
  modelName: 'Appeal',
  tableName: 'appeals',
  timestamps: true
});

export default Appeal;