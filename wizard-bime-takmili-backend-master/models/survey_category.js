const Sequelize = require('sequelize');
module.exports = function(sequelize) {
  return sequelize.define('survey_category', {
    id: {
      autoIncrement: true,
      type: Sequelize.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    name: {
      type: Sequelize.STRING(200),
      allowNull: true
    },
    is_enable: {
      type: Sequelize.TINYINT,
      allowNull: true
    },
    description: {
      type: Sequelize.TEXT,
      allowNull: true
    }
  }, {
    sequelize,
    tableName: 'survey_category',
    timestamps: false,
    indexes: [
      {
        name: "PRIMARY",
        unique: true,
        using: "BTREE",
        fields: [
          { name: "id" },
        ]
      },
    ]
  });
};
