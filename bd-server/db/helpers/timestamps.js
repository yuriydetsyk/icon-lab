const Sequelize = require('sequelize');

module.exports = {
  createdAtFn: () => Sequelize.fn('NOW'),
  updatedAtFn: () => Sequelize.fn('NOW'),
  timestampAttributes: {
    created_at: {
      allowNull: false,
      type: Sequelize.DATE,
    },
    updated_at: {
      type: Sequelize.DATE,
    },
  },
  timestampAttributesOriginal: {
    createdAt: {
      allowNull: false,
      type: Sequelize.DATE,
    },
    updatedAt: {
      type: Sequelize.DATE,
    },
  },
};
