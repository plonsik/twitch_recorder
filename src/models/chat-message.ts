import {Table, Column, Model, DataType, BelongsTo, ForeignKey} from 'sequelize-typescript';
import {Stream} from './stream';

@Table({
  updatedAt: false,
  tableName: 'ChatMessages',
})
export class ChatMessage extends Model<{
  username: string;
  message: string;
  streamId: number;
}> {
  @Column(DataType.STRING)
  username!: string;

  @Column(DataType.TEXT('long'))
  message!: string;

  @BelongsTo(() => Stream)
  stream!: Stream;

  @ForeignKey(() => Stream)
  @Column(DataType.NUMBER)
  streamId!: number;
}
