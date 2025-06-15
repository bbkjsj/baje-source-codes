const Sequelize = require('sequelize');
module.exports = function(sequelize) {
  return sequelize.define('survey_workgroup_reject', {
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
    name: {
      type: Sequelize.STRING(300),
      allowNull: true
    },
    min_point: {
      type: Sequelize.DECIMAL(10,0),
      allowNull: true
    },
    is_enable: {
      type: Sequelize.TINYINT,
      allowNull: true
    },
    description: {
      type: Sequelize.TEXT,
      allowNull: true
    },
    last_update_date: {
      type: Sequelize.DATE,
      allowNull: true
    }
  }, {
    sequelize,
    tableName: 'survey_workgroup_reject',
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
