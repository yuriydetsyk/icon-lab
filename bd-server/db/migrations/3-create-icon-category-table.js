const DataTypes = require('sequelize').DataTypes;

const timestampAttributes = require('../helpers/timestamps').timestampAttributes;
const handleError = require('../helpers/console').handleError;
const iconTableName = require('./1-create-icons-table').iconTableName;
const categoryTableName = require('./2-create-categories-table').categoryTableName;

const iconCategoryTableName = 'icon_category';

module.exports = {
  iconCategoryTableName,
  /**
   *
   * @param {import('sequelize').QueryInterface} queryInterface
   */
  up: async (queryInterface) => {
    return await queryInterface
      .createTable(iconCategoryTableName, {
        iconId: {
          allowNull: false,
          type: DataTypes.UUID,
          references: { model: iconTableName, key: 'id' },
          onDelete: 'CASCADE',
          field: 'icon_id',
        },
        categoryId: {
          allowNull: false,
          type: DataTypes.UUID,
          references: { model: categoryTableName, key: 'id' },
          onDelete: 'CASCADE',
          field: 'category_id',
        },
        ...timestampAttributes,
      })
      .catch(handleError);
  },
  /**
   *
   * @param {import('sequelize').QueryInterface} queryInterface
   */
  down: async (queryInterface) => {
    return await queryInterface.dropTable(iconCategoryTableName).catch(handleError);
  },
};
