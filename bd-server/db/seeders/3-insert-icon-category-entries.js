const createdAtFn = require('../helpers/timestamps').createdAtFn;
const tableName = require('../migrations/3-create-icon-category-table').iconCategoryTableName;
const categoryTableName = require('../migrations/2-create-categories-table').categoryTableName;
const iconTableName = require('../migrations/1-create-icons-table').iconTableName;
const handleError = require('../helpers/console').handleError;

const createdAt = createdAtFn();

module.exports = {
  /**
   *
   * @param {import('sequelize').QueryInterface} queryInterface
   */
  up: async (queryInterface) => {
    const [icons] = await queryInterface.sequelize.query(`SELECT * FROM ${iconTableName} LIMIT 10`);
    const [categories] = await queryInterface.sequelize.query(`SELECT * FROM ${categoryTableName}`);
    const iconCategoryEntries = icons.map((icon) => {
      return {
        icon_id: icon.id,
        category_id: categories[Math.floor(Math.random() * categories.length)].id,
        created_at: createdAt,
      };
    });
    return await queryInterface.bulkInsert(tableName, iconCategoryEntries).catch(handleError);
  },

  down: async () => await Promise.resolve().catch(handleError),
};
