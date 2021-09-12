const createdAtFn = require('../helpers/timestamps').createdAtFn;
const tableName = require('../migrations/2-create-categories-table').categoriesTableName;
const handleError = require('../helpers/console').handleError;

const createdAt = createdAtFn();
const categories = [
  {
    name: 'Work',
    description: 'Everything related to jobs, careers etc.',
  },
  {
    name: 'Raster',
    description: 'Contains only raster icons',
  },
].map((item) => ({ ...item, created_at: createdAt }));

module.exports = {
  /**
   *
   * @param {import('sequelize').QueryInterface} queryInterface
   */
  up: async (queryInterface) => {
    return await queryInterface.bulkInsert(tableName, categories).catch(handleError);
  },

  /**
   *
   * @param {import('sequelize').QueryInterface} queryInterface
   */
  down: async (queryInterface) => {
    return await queryInterface.bulkDelete(tableName).catch(handleError);
  },
};
