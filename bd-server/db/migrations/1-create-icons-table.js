const DataTypes = require('sequelize').DataTypes;

const timestampAttributes = require('../helpers/timestamps').timestampAttributes;
const handleError = require('../helpers/console').handleError;

const iconsTableName = 'icons';

module.exports = {
  iconsTableName,
  /**
   *
   * @param {import('sequelize').QueryInterface} queryInterface
   * @param {import('sequelize').Sequelize} Sequelize
   */
  up: async (queryInterface, Sequelize) => {
    await queryInterface.sequelize.query('CREATE EXTENSION IF NOT EXISTS "uuid-ossp"');
    return await queryInterface
      .createTable(iconsTableName, {
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
        tags: {
          type: DataTypes.ARRAY(DataTypes.STRING),
        },
        url: {
          type: DataTypes.STRING,
          allowNull: false,
        },
        type: {
          type: DataTypes.STRING,
          allowNull: false,
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
    return await queryInterface.dropTable(iconsTableName).catch(handleError);
  },
};
