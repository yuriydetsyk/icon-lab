const DataTypes = require('sequelize').DataTypes;

const timestampAttributes = require('../helpers/timestamps').timestampAttributes;
const handleError = require('../helpers/console').handleError;

const tableName = 'user';

module.exports = {
  tableName,
  /**
   *
   * @param {import('sequelize').QueryInterface} queryInterface
   * @param {import('sequelize').Sequelize} Sequelize
   */
  up: async (queryInterface, Sequelize) => {
    await queryInterface.sequelize.query('CREATE EXTENSION IF NOT EXISTS "uuid-ossp"');
    return await queryInterface
      .createTable(tableName, {
        id: {
          type: DataTypes.UUID,
          primaryKey: true,
          allowNull: false,
          defaultValue: Sequelize.literal('uuid_generate_v4()'),
        },
        email: {
          type: DataTypes.STRING,
          allowNull: false,
        },
        password: {
          type: DataTypes.STRING,
          allowNull: false,
        },
        isAdmin: {
          type: DataTypes.BOOLEAN,
          allowNull: false,
          field: 'is_admin',
        },
        firstName: {
          type: DataTypes.STRING,
          field: 'first_name',
        },
        lastName: {
          type: DataTypes.STRING,
          field: 'last_name',
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
