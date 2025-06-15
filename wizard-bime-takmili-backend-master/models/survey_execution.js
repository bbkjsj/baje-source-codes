const Sequelize = require('sequelize');
module.exports = function(sequelize) {
  return sequelize.define('survey_execution', {
    id: {
      autoIncrement: true,
      type: Sequelize.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    survey_id_fk: {
      type: Sequelize.INTEGER,
      allowNull: true
    },
    personnel_id_fk: {
      type: Sequelize.INTEGER,
      allowNull: true
    },
    date: {
      type: Sequelize.DATE,
      allowNull: true
    },
    approve: {
      type: Sequelize.TINYINT,
      allowNull: true
    },
    timeline_file: {
      type: Sequelize.STRING(300),
      allowNull: true
    },
    due_day: {
      type: Sequelize.INTEGER,
      allowNull: true
    }
  }, {
    sequelize,
    tableName: 'survey_execution',
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
