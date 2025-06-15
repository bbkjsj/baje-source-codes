const Sequelize = require('sequelize');
module.exports = function(sequelize) {
  return sequelize.define('survey_disadv_reaction', {
    id: {
      autoIncrement: true,
      type: Sequelize.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    dis_adv_id_fk: {
      type: Sequelize.INTEGER,
      allowNull: true
    },
    reaction: {
      type: Sequelize.STRING(100),
      allowNull: true
    },
    personnel_id_fk: {
      type: Sequelize.INTEGER,
      allowNull: true
    },
    date: {
      type: Sequelize.DATE,
      allowNull: true
    }
  }, {
    sequelize,
    tableName: 'survey_disadv_reaction',
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
