const Sequelize = require('sequelize');
module.exports = function(sequelize) {
  return sequelize.define('survey_disadv_comment_reaction', {
    id: {
      autoIncrement: true,
      type: Sequelize.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    personnel_id_fk: {
      type: Sequelize.INTEGER,
      allowNull: true
    },
    survey_advdis_comment_id_fk: {
      type: Sequelize.INTEGER,
      allowNull: true
    },
    reaction: {
      type: Sequelize.STRING(200),
      allowNull: true
    },
    date: {
      type: Sequelize.DATE,
      allowNull: true
    }
  }, {
    sequelize,
    tableName: 'survey_disadv_comment_reaction',
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
