const Sequelize = require('sequelize');
module.exports = function(sequelize) {
  return sequelize.define('survey_advdis_comment', {
    id: {
      autoIncrement: true,
      type: Sequelize.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    survey_advdis_id_fk: {
      type: Sequelize.INTEGER,
      allowNull: true
    },
    date: {
      type: Sequelize.DATE,
      allowNull: true
    },
    personnel_id_fk: {
      type: Sequelize.INTEGER,
      allowNull: true
    },
    description: {
      type: Sequelize.TEXT,
      allowNull: true
    },
    type: {
      type: Sequelize.STRING(200),
      allowNull: true
    }
  }, {
    sequelize,
    tableName: 'survey_advdis_comment',
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
