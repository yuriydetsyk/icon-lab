const handleError = require('../helpers/console').handleError;

const tableName = 'icons';
const columnName = 'tags';
const indexName = 'icons_tags_index';

module.exports = {
  /**
   *
   * @param {import('sequelize').QueryInterface} queryInterface
   */
  up: async (queryInterface) => {
    return await queryInterface.sequelize
      .query(`CREATE INDEX ${indexName} ON ${tableName} USING GIN(${columnName})`)
      .catch(handleError);
  },
  /**
   *
   * @param {import('sequelize').QueryInterface} queryInterface
   */
  down: async (queryInterface) => {
    return await queryInterface.sequelize.query(`DROP INDEX ${indexName}`).catch(handleError);
  },
};
