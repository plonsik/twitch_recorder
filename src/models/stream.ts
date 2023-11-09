import {Table, Column, DataType, HasMany, Model} from 'sequelize-typescript';
import {ChatMessage} from './chat-message';
import {PenaltyLog} from './penalty-log';

@Table({
  timestamps: false,
  tableName: 'Streams',
})
export class Stream extends Model<{
  startTime: string;
}> {
  @Column(DataType.STRING)
  startTime!: string;

  @HasMany(() => PenaltyLog)
  penaltyLogs!: PenaltyLog[];

  @HasMany(() => ChatMessage)
  chatMessages!: ChatMessage[];
}
