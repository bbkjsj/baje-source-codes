const Sequelize = require('sequelize');
module.exports = function(sequelize) {
  return sequelize.define('survey_call_subscribe', {
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
    survey_workgroup_call_id_fk: {
      type: Sequelize.INTEGER,
      allowNull: true
    }
  }, {
    sequelize,
    tableName: 'survey_call_subscribe',
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
