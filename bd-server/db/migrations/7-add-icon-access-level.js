const handleError = require('../helpers/console').handleError;
const DataTypes = require('sequelize').DataTypes;

const tableName = 'icon';
const isPremiumColumnName = 'is_premium';
const originalIdColumnName = 'original_id';

module.exports = {
  /**
   *
   * @param {import('sequelize').QueryInterface} queryInterface
   */
  up: async (queryInterface) => {
    await queryInterface
      .addColumn(tableName, isPremiumColumnName, {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false,
      })
      .catch(handleError);
    return await queryInterface
      .addColumn(tableName, originalIdColumnName, {
        type: DataTypes.UUID,
        references: { model: tableName, key: 'id' },
        onDelete: 'CASCADE',
      })
      .catch(handleError);
  },
  /**
   *
   * @param {import('sequelize').QueryInterface} queryInterface
   */
  down: async (queryInterface) => {
    await queryInterface.removeColumn(tableName, isPremiumColumnName).catch(handleError);
    return await queryInterface.removeColumn(tableName, originalIdColumnName).catch(handleError);
  },
};
