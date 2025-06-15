const Sequelize = require('sequelize');
module.exports = function(sequelize) {
  return sequelize.define('survey_log', {
    id: {
      autoIncrement: true,
      type: Sequelize.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    action: {
      type: Sequelize.TEXT,
      allowNull: true
    },
    date: {
      type: Sequelize.DATE,
      allowNull: true
    },
    survey_user_id_fk: {
      type: Sequelize.INTEGER,
      allowNull: true
    },
    personnel_id_fk: {
      type: Sequelize.INTEGER,
      allowNull: true
    },
    survey_id_fk: {
      type: Sequelize.INTEGER,
      allowNull: true
    },
    description: {
      type: Sequelize.TEXT,
      allowNull: true
    },
    from_status: {
      type: Sequelize.STRING(200),
      allowNull: true
    },
    to_status: {
      type: Sequelize.STRING(200),
      allowNull: true
    },
    status_type: {
      type: Sequelize.STRING(45),
      allowNull: true
    }
  }, {
    sequelize,
    tableName: 'survey_log',
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
