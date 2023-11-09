import {Table, Column, DataType, Model} from 'sequelize-typescript';

@Table({
  updatedAt: false,
  tableName: 'SystemLogs',
})
export class SystemLog extends Model<{
  level: string;
  message: string;
}> {
  @Column(DataType.STRING)
  level!: string;

  @Column(DataType.TEXT('long'))
  message!: string;
}
