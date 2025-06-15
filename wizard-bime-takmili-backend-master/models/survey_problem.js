const Sequelize = require('sequelize');
module.exports = function(sequelize) {
  return sequelize.define('survey_problem', {
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
    type: {
      type: Sequelize.STRING(200),
      allowNull: true
    },
    date: {
      type: Sequelize.DATE,
      allowNull: true
    },
    result: {
      type: Sequelize.TEXT,
      allowNull: true
    },
    title: {
      type: Sequelize.TEXT,
      allowNull: true
    },
    description: {
      type: Sequelize.TEXT,
      allowNull: true
    },
    solution: {
      type: Sequelize.TEXT,
      allowNull: true
    },
    personnel_id_fk: {
      type: Sequelize.INTEGER,
      allowNull: true
    },
    problem_date: {
      type: Sequelize.DATE,
      allowNull: true
    }
  }, {
    sequelize,
    tableName: 'survey_problem',
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
