const Sequelize = require('sequelize');
module.exports = function(sequelize) {
  return sequelize.define('survey_top_workgroup', {
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
    reward_type: {
      type: Sequelize.STRING(200),
      allowNull: true
    },
    suggest_reward: {
      type: Sequelize.DECIMAL(10,0),
      allowNull: true
    },
    score: {
      type: Sequelize.INTEGER,
      allowNull: true
    },
    due_day: {
      type: Sequelize.INTEGER,
      allowNull: true
    },
    unit: {
      type: Sequelize.STRING(100),
      allowNull: true
    },
    company_id_fk: {
      type: Sequelize.INTEGER,
      allowNull: true
    },
    personnel_id_fk: {
      type: Sequelize.INTEGER,
      allowNull: true
    }
  }, {
    sequelize,
    tableName: 'survey_top_workgroup',
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
