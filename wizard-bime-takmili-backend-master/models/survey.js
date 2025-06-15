const Sequelize = require('sequelize');
module.exports = function(sequelize) {
  return sequelize.define('survey', {
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
    participate_type: {
      type: Sequelize.STRING(200),
      allowNull: true
    },
    participate_group_name: {
      type: Sequelize.STRING(200),
      allowNull: true
    },
    survey_call: {
      type: Sequelize.TINYINT,
      allowNull: true
    },
    survey_workgroup_call_id_fk: {
      type: Sequelize.INTEGER,
      allowNull: true
    },
    title: {
      type: Sequelize.TEXT,
      allowNull: true
    },
    type: {
      type: Sequelize.STRING(300),
      allowNull: true
    },
    survey_category_id_fk: {
      type: Sequelize.INTEGER,
      allowNull: true
    },
    category_title: {
      type: Sequelize.STRING(300),
      allowNull: true
    },
    problem_description: {
      type: Sequelize.TEXT,
      allowNull: true
    },
    suggestion: {
      type: Sequelize.TEXT,
      allowNull: true
    },
    requirement: {
      type: Sequelize.TEXT,
      allowNull: true
    },
    is_exist: {
      type: Sequelize.TINYINT,
      allowNull: true
    },
    participate_in_execution: {
      type: Sequelize.TINYINT,
      allowNull: true
    },
    participate_exe_type: {
      type: Sequelize.STRING(200),
      allowNull: true
    },
    participate_exe_percent: {
      type: Sequelize.DECIMAL(10,0),
      allowNull: true
    },
    participate_exe_year: {
      type: Sequelize.DECIMAL(10,0),
      allowNull: true
    },
    file_url: {
      type: Sequelize.STRING(300),
      allowNull: true
    },
    survey_user_id_fk: {
      type: Sequelize.INTEGER,
      allowNull: true
    },
    code: {
      type: Sequelize.STRING(45),
      allowNull: true
    },
    idea_price: {
      type: Sequelize.DECIMAL(10,0),
      allowNull: true
    },
    status: {
      type: Sequelize.STRING(200),
      allowNull: true
    },
    approve_level1: {
      type: Sequelize.TINYINT,
      allowNull: true
    },
    approve_level2: {
      type: Sequelize.TINYINT,
      allowNull: true
    },
    create_date: {
      type: Sequelize.DATE,
      allowNull: true
    },
    last_update_date: {
      type: Sequelize.DATE,
      allowNull: true
    },
    is_postponed: {
      type: Sequelize.TINYINT,
      allowNull: true
    },
    end_of_postpone: {
      type: Sequelize.DATE,
      allowNull: true
    },
    reward: {
      type: Sequelize.STRING(200),
      allowNull: true
    }
  }, {
    sequelize,
    tableName: 'survey',
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
