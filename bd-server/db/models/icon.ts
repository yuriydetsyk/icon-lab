import { BelongsToMany, Column, CreatedAt, DataType, ForeignKey, Model, Table, UpdatedAt } from 'sequelize-typescript';

import { IconType } from '../../src/models/enums/icon-type';
import Category from './category';
import IconCategory from './icon-category';

@Table({ tableName: 'icons' })
export default class Icon extends Model {
  @Column
  public name: string;

  @Column(DataType.ARRAY(DataType.STRING))
  public tags?: string[];

  @Column
  public url: string;

  @Column
  public type: IconType;

  @BelongsToMany(() => Category, () => IconCategory)
  public categories?: Category[];

  @Column({ field: 'is_premium' })
  public isPremium: boolean;

  @ForeignKey(() => Icon)
  @Column({ field: 'original_id' })
  public originalId: string;

  @CreatedAt
  @Column({ field: 'created_at' })
  public createdAt: Date;

  @UpdatedAt
  @Column({ field: 'updated_at' })
  public updatedAt?: Date;
}
