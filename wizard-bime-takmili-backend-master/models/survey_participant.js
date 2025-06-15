const Sequelize = require('sequelize');
module.exports = function(sequelize) {
  return sequelize.define('survey_participant', {
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
    survey_user_id_fk: {
      type: Sequelize.INTEGER,
      allowNull: true
    },
    participation_percent: {
      type: Sequelize.DECIMAL(10,0),
      allowNull: true
    }
  }, {
    sequelize,
    tableName: 'survey_participant',
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
