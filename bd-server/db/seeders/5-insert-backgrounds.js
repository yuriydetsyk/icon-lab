const createdAtFn = require('../helpers/timestamps').createdAtFn;
const tableName = require('../migrations/6-create-backgrounds-table').backgroundTableName;
const handleError = require('../helpers/console').handleError;

const createdAt = createdAtFn();
const backgrounds = [
  {
    name: 'Folder',
    tags: ['folder'],
    url: `https://iconlab.img.chunkup.com/backgrounds/${process.env.ICONLAB_ENV}/folder.svg`,
  },
].map((item) => ({ ...item, created_at: createdAt }));

module.exports = {
  /**
   *
   * @param {import('sequelize').QueryInterface} queryInterface
   */
  up: async (queryInterface) => {
    return await queryInterface.bulkInsert(tableName, backgrounds).catch(handleError);
  },

  /**
   *
   * @param {import('sequelize').QueryInterface} queryInterface
   */
  down: async (queryInterface) => {
    return await queryInterface.bulkDelete(tableName).catch(handleError);
  },
};
