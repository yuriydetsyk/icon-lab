import { Column, CreatedAt, DataType, Model, Table, UpdatedAt } from 'sequelize-typescript';

@Table({ tableName: 'backgrounds' })
export default class Background extends Model {
  @Column
  public name: string;

  @Column(DataType.ARRAY(DataType.STRING))
  public tags?: string[];

  @Column
  public url: string;

  @CreatedAt
  @Column({ field: 'created_at' })
  public createdAt: Date;

  @UpdatedAt
  @Column({ field: 'updated_at' })
  public updatedAt?: Date;
}
