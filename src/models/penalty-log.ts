import {Table, Column, DataType, Model, BelongsTo, ForeignKey} from 'sequelize-typescript';
import {Stream} from './stream';

@Table({
  updatedAt: false,
  tableName: 'PenaltyLogs',
})
export class PenaltyLog extends Model<{
  username: string;
  type: 'BAN' | 'TIMEOUT';
  streamId: number;
}> {
  @Column(DataType.STRING)
  username!: string;

  @Column(DataType.STRING)
  type!: string;

  @BelongsTo(() => Stream)
  stream!: Stream;

  @ForeignKey(() => Stream)
  @Column(DataType.NUMBER)
  streamId!: number;
}
