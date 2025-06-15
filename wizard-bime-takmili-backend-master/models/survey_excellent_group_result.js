const Sequelize = require('sequelize');
module.exports = function(sequelize) {
  return sequelize.define('survey_excellent_group_result', {
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
    approve: {
      type: Sequelize.TINYINT,
      allowNull: true
    },
    survey_id_fk: {
      type: Sequelize.INTEGER,
      allowNull: true
    }
  }, {
    sequelize,
    tableName: 'survey_excellent_group_result',
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
