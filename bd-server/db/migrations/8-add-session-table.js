const DataTypes = require('sequelize').DataTypes;

const timestampAttributesOriginal = require('../helpers/timestamps').timestampAttributesOriginal;
const handleError = require('../helpers/console').handleError;

const tableName = 'Session';

module.exports = {
  tableName,
  /**
   *
   * @param {import('sequelize').QueryInterface} queryInterface
   */
  up: async (queryInterface) => {
    return await queryInterface
      .createTable(tableName, {
        sid: {
          type: DataTypes.STRING,
          primaryKey: true,
          allowNull: false,
        },
        expires: {
          type: DataTypes.DATE,
        },
        data: {
          type: DataTypes.TEXT,
        },
        ...timestampAttributesOriginal,
      })
      .catch(handleError);
  },
  /**
   *
   * @param {import('sequelize').QueryInterface} queryInterface
   */
  down: async (queryInterface) => {
    return await queryInterface.dropTable(tableName).catch(handleError);
  },
};
