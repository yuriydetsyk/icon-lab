import { Column, CreatedAt, Model, Table, UpdatedAt } from 'sequelize-typescript';

@Table({ tableName: 'users' })
export default class User extends Model {
  @Column
  public email: string;

  @Column
  public password: string;

  @Column
  public isAdmin: boolean;

  @Column
  public firstName?: string;

  @Column
  public lastName?: string;

  @CreatedAt
  @Column({ field: 'created_at' })
  public createdAt: Date;

  @UpdatedAt
  @Column({ field: 'updated_at' })
  public updatedAt?: Date;
}
