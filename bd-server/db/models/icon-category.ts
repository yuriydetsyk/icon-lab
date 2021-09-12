import { Column, CreatedAt, ForeignKey, Model, Table, UpdatedAt } from 'sequelize-typescript';
import Category from './category';
import Icon from './icon';

@Table({ tableName: 'icons_categories' })
export default class IconCategory extends Model {
  @ForeignKey(() => Icon)
  @Column({ field: 'icon_id' })
  public iconId: string;

  @ForeignKey(() => Category)
  @Column({ field: 'category_id' })
  public categoryId: string;

  @CreatedAt
  @Column({ field: 'created_at' })
  public createdAt: Date;

  @UpdatedAt
  @Column({ field: 'updated_at' })
  public updatedAt?: Date;
}
