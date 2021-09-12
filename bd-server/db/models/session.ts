import { Column, CreatedAt, Model, Table, UpdatedAt } from 'sequelize-typescript';

@Table({ tableName: 'Session' })
export default class Session extends Model {
  @Column({ primaryKey: true })
  public sid: string;

  @Column
  public expires: Date;

  @Column
  public data: string;

  @CreatedAt
  @Column
  public createdAt: Date;

  @UpdatedAt
  @Column
  public updatedAt?: Date;
}
