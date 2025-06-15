const Sequelize = require('sequelize');
module.exports = function(sequelize) {
  return sequelize.define('survey_workgroup_personnel', {
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
    workgroup_id_fk: {
      type: Sequelize.INTEGER,
      allowNull: true
    },
    position: {
      type: Sequelize.STRING(200),
      allowNull: true
    },
    member_from: {
      type: Sequelize.DATE,
      allowNull: true
    },
    member_to: {
      type: Sequelize.DATE,
      allowNull: true
    },
    approved: {
      type: Sequelize.TINYINT,
      allowNull: true
    },
    fix: {
      type: Sequelize.TINYINT,
      allowNull: true
    }
  }, {
    sequelize,
    tableName: 'survey_workgroup_personnel',
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
