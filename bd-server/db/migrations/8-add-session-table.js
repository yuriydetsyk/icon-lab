const DataTypes = require('sequelize').DataTypes;

const timestampAttributes = require('../helpers/timestamps').timestampAttributes;
const handleError = require('../helpers/console').handleError;

const tableName = 'session';

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
        ...timestampAttributes,
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
