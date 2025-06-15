const Sequelize = require('sequelize');
module.exports = function(sequelize) {
  return sequelize.define('survey_workgroup_call', {
    id: {
      autoIncrement: true,
      type: Sequelize.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    workgroup_id_fk: {
      type: Sequelize.INTEGER,
      allowNull: true
    },
    subject: {
      type: Sequelize.STRING(400),
      allowNull: true
    },
    start_date: {
      type: Sequelize.DATE,
      allowNull: true
    },
    end_date: {
      type: Sequelize.DATE,
      allowNull: true
    }
  }, {
    sequelize,
    tableName: 'survey_workgroup_call',
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
