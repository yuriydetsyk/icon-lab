const createdAtFn = require('../helpers/timestamps').createdAtFn;
const tableName = require('../migrations/1-create-icons-table').iconsTableName;
const handleError = require('../helpers/console').handleError;

const createdAt = createdAtFn();
const icons = [
  {
    name: 'Doge',
    tags: ['doge'],
    url: `https://img.icon-lab.co/icons/${process.env.API_ENV}/doge.png`,
    type: 'R',
  },
  {
    name: 'Troll',
    tags: ['troll'],
    url: `https://img.icon-lab.co/icons/${process.env.API_ENV}/troll.png`,
    type: 'R',
  },
  {
    name: 'Facepalm',
    tags: ['facepalm'],
    url: `https://img.icon-lab.co/icons/${process.env.API_ENV}/facepalm.png`,
    type: 'R',
  },
  {
    name: 'Success',
    tags: ['success'],
    url: `https://img.icon-lab.co/icons/${process.env.API_ENV}/success.png`,
    type: 'R',
  },
  {
    name: 'Megusta',
    tags: ['megusta'],
    url: `https://img.icon-lab.co/icons/${process.env.API_ENV}/megusta.png`,
    type: 'R',
  },
  {
    name: 'Chat Right',
    tags: ['chat-right'],
    url: `https://img.icon-lab.co/icons/${process.env.API_ENV}/chat-right.svg`,
    type: 'V',
  },
  {
    name: 'Book',
    tags: ['book'],
    url: `https://img.icon-lab.co/icons/${process.env.API_ENV}/book.svg`,
    type: 'V',
  },
  {
    name: 'Compass',
    tags: ['compass'],
    url: `https://img.icon-lab.co/icons/${process.env.API_ENV}/compass.svg`,
    type: 'V',
  },
  {
    name: 'Check',
    tags: ['check'],
    url: `https://img.icon-lab.co/icons/${process.env.API_ENV}/check.svg`,
    type: 'V',
  },
  {
    name: 'Folder',
    tags: ['folder'],
    url: `https://img.icon-lab.co/icons/${process.env.API_ENV}/folder.svg`,
    type: 'V',
  },
  {
    name: 'Settings',
    tags: ['settings'],
    url: `https://img.icon-lab.co/icons/${process.env.API_ENV}/settings.svg`,
    type: 'V',
  },
  {
    name: 'Chat Left Blank',
    tags: ['chat-left-blank'],
    url: `https://img.icon-lab.co/icons/${process.env.API_ENV}/chat-left-blank.svg`,
    type: 'V',
  },
  {
    name: 'Camera',
    tags: ['camera'],
    url: `https://img.icon-lab.co/icons/${process.env.API_ENV}/camera.svg`,
    type: 'V',
  },
  {
    name: 'Mail',
    tags: ['mail'],
    url: `https://img.icon-lab.co/icons/${process.env.API_ENV}/mail.svg`,
    type: 'V',
  },
  {
    name: 'Calendar',
    tags: ['calendar'],
    url: `https://img.icon-lab.co/icons/${process.env.API_ENV}/calendar.svg`,
    type: 'V',
  },
].map((item) => ({ ...item, created_at: createdAt }));

module.exports = {
  /**
   *
   * @param {import('sequelize').QueryInterface} queryInterface
   */
  up: async (queryInterface) => {
    return await queryInterface.bulkInsert(tableName, icons).catch(handleError);
  },

  /**
   *
   * @param {import('sequelize').QueryInterface} queryInterface
   */
  down: async (queryInterface) => {
    return await queryInterface.bulkDelete(tableName).catch(handleError);
  },
};
