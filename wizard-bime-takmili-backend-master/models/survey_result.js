const Sequelize = require('sequelize');
module.exports = function(sequelize) {
  return sequelize.define('survey_result', {
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
    date: {
      type: Sequelize.DATE,
      allowNull: true
    },
    survey_id_fk: {
      type: Sequelize.STRING(45),
      allowNull: true
    },
    special: {
      type: Sequelize.TINYINT,
      allowNull: true
    }
  }, {
    sequelize,
    tableName: 'survey_result',
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
