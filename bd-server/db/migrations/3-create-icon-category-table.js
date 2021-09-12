const DataTypes = require('sequelize').DataTypes;

const timestampAttributes = require('../helpers/timestamps').timestampAttributes;
const handleError = require('../helpers/console').handleError;
const iconsTableName = require('./1-create-icons-table').iconsTableName;
const categoriesTableName = require('./2-create-categories-table').categoriesTableName;

const iconCategoryTableName = 'icons_categories';

module.exports = {
  iconCategoryTableName,
  /**
   *
   * @param {import('sequelize').QueryInterface} queryInterface
   */
  up: async (queryInterface) => {
    return await queryInterface
      .createTable(iconCategoryTableName, {
        icon_id: {
          allowNull: false,
          type: DataTypes.UUID,
          references: { model: iconsTableName, key: 'id' },
          onDelete: 'CASCADE',
        },
        category_id: {
          allowNull: false,
          type: DataTypes.UUID,
          references: { model: categoriesTableName, key: 'id' },
          onDelete: 'CASCADE',
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
