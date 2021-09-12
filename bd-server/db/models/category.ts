import { Table, Column, Model, CreatedAt, UpdatedAt, BelongsToMany } from 'sequelize-typescript';
import Icon from './icon';
import IconCategory from './icon-category';

@Table({ tableName: 'categories' })
export default class Category extends Model {
  @Column
  public name: string;

  @Column
  public description?: string;

  @BelongsToMany(() => Icon, () => IconCategory)
  public icons?: Icon[];

  @CreatedAt
  @Column({ field: 'created_at' })
  public createdAt: Date;

  @UpdatedAt
  @Column({ field: 'updated_at' })
  public updatedAt?: Date;
}
