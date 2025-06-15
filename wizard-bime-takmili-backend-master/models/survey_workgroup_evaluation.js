const Sequelize = require('sequelize');
module.exports = function(sequelize) {
  return sequelize.define('survey_workgroup_evaluation', {
    id: {
      autoIncrement: true,
      type: Sequelize.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    name: {
      type: Sequelize.STRING(400),
      allowNull: true
    },
    workgroup_id_fk: {
      type: Sequelize.INTEGER,
      allowNull: true
    },
    rate_type: {
      type: Sequelize.STRING(45),
      allowNull: true
    },
    weight_factor: {
      type: Sequelize.DECIMAL(10,0),
      allowNull: true
    },
    is_enabled: {
      type: Sequelize.TINYINT,
      allowNull: true
    },
    description: {
      type: Sequelize.TEXT,
      allowNull: true
    },
    max_point: {
      type: Sequelize.DECIMAL(10,0),
      allowNull: true
    },
    last_update_date: {
      type: Sequelize.DATE,
      allowNull: true
    }
  }, {
    sequelize,
    tableName: 'survey_workgroup_evaluation',
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
