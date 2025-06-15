const Sequelize = require('sequelize');
module.exports = function(sequelize) {
  return sequelize.define('survey_result_evaluation', {
    id: {
      autoIncrement: true,
      type: Sequelize.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    result_id_fk: {
      type: Sequelize.INTEGER,
      allowNull: true
    },
    evaluation_id_fk: {
      type: Sequelize.INTEGER,
      allowNull: true
    },
    value: {
      type: Sequelize.STRING(40),
      allowNull: true
    },
    supervisor_value: {
      type: Sequelize.STRING(40),
      allowNull: true
    }
  }, {
    sequelize,
    tableName: 'survey_result_evaluation',
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
