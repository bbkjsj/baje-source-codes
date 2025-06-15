const Sequelize = require('sequelize');
module.exports = function(sequelize) {
  return sequelize.define('survey_result_reject', {
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
    }
  }, {
    sequelize,
    tableName: 'survey_result_reject',
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
