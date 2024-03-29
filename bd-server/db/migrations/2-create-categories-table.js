const DataTypes = require('sequelize').DataTypes;

const timestampAttributes = require('../helpers/timestamps').timestampAttributes;
const handleError = require('../helpers/console').handleError;

const categoryTableName = 'category';

module.exports = {
  categoryTableName,
  /**
   *
   * @param {import('sequelize').QueryInterface} queryInterface
   * @param {import('sequelize').Sequelize} Sequelize
   */
  up: async (queryInterface, Sequelize) => {
    await queryInterface.sequelize.query('CREATE EXTENSION IF NOT EXISTS "uuid-ossp"');
    return await queryInterface
      .createTable(categoryTableName, {
        id: {
          type: DataTypes.UUID,
          primaryKey: true,
          allowNull: false,
          defaultValue: Sequelize.literal('uuid_generate_v4()'),
        },
        name: {
          type: DataTypes.STRING,
          allowNull: false,
        },
        description: {
          type: DataTypes.STRING,
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
    return await queryInterface.dropTable(categoryTableName).catch(handleError);
  },
};
