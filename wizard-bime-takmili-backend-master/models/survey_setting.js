const Sequelize = require('sequelize');
module.exports = function(sequelize) {
  return sequelize.define('survey_setting', {
    id: {
      autoIncrement: true,
      type: Sequelize.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    manager_id_fk: {
      type: Sequelize.INTEGER,
      allowNull: true
    },
    max_day_first_assessment: {
      type: Sequelize.DECIMAL(10,0),
      allowNull: true
    },
    max_day_expert_workgroup: {
      type: Sequelize.DECIMAL(10,0),
      allowNull: true
    },
    max_day_excellent_workgroup: {
      type: Sequelize.DECIMAL(10,0),
      allowNull: true
    },
    max_day_edit: {
      type: Sequelize.DECIMAL(10,0),
      allowNull: true
    },
    max_day_review_request: {
      type: Sequelize.DECIMAL(10,0),
      allowNull: true
    },
    max_day_planning_execution: {
      type: Sequelize.DECIMAL(10,0),
      allowNull: true
    },
    max_day_execution_review: {
      type: Sequelize.DECIMAL(10,0),
      allowNull: true
    },
    rial_rate_per_year: {
      type: Sequelize.DECIMAL(10,0),
      allowNull: true
    },
    min_reward_rial: {
      type: Sequelize.DECIMAL(10,0),
      allowNull: true
    },
    max_percent_participate: {
      type: Sequelize.DECIMAL(10,0),
      allowNull: true
    },
    min_pass_point: {
      type: Sequelize.DECIMAL(10,0),
      allowNull: true
    },
    background_image: {
      type: Sequelize.STRING(300),
      allowNull: true
    }
  }, {
    sequelize,
    tableName: 'survey_setting',
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
