const createdAtFn = require('../helpers/timestamps').createdAtFn;
const tableName = require('../migrations/4-create-users-table').tableName;
const handleError = require('../helpers/console').handleError;

const createdAt = createdAtFn();
const users = [
  {
    email: 'yuron.sd@gmail.com',
    password: '$2b$10$M0tc797VDfJ8K.15txUeKefRE3gE1vK/5Fv7sEy3CSvKh89HZrA2C',
    is_admin: true,
    first_name: 'Yuriy',
    last_name: 'Detsyk',
  },
  {
    email: 'natalie.bosa@gmail.com',
    password: '$2b$10$zEJ8Wez0RR47J5aRLM2OFuNwKaJed3DpdV3iF7Lfg8PteBDI9qDd.',
    is_admin: true,
    first_name: 'Natalie',
    last_name: 'Bosa',
  },
].map((item) => ({ ...item, created_at: createdAt }));

module.exports = {
  /**
   *
   * @param {import('sequelize').QueryInterface} queryInterface
   */
  up: async (queryInterface) => {
    return await queryInterface.bulkInsert(tableName, users).catch(handleError);
  },

  /**
   *
   * @param {import('sequelize').QueryInterface} queryInterface
   */
  down: async (queryInterface) => {
    return await queryInterface.bulkDelete(tableName).catch(handleError);
  },
};
