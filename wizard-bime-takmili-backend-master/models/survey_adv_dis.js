const Sequelize = require('sequelize');
module.exports = function(sequelize) {
  return sequelize.define('survey_adv_dis', {
    id: {
      autoIncrement: true,
      type: Sequelize.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    survey_user_id_fk: {
      type: Sequelize.INTEGER,
      allowNull: true
    },
    comment: {
      type: Sequelize.TEXT,
      allowNull: true
    },
    type: {
      type: Sequelize.STRING(45),
      allowNull: true
    },
    survey_id_fk: {
      type: Sequelize.INTEGER,
      allowNull: true
    },
    personnel_id_fk: {
      type: Sequelize.INTEGER,
      allowNull: true
    }
  }, {
    sequelize,
    tableName: 'survey_adv_dis',
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
