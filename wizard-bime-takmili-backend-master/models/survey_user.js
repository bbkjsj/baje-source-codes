const Sequelize = require('sequelize');
module.exports = function(sequelize) {
  return sequelize.define('survey_user', {
    id: {
      autoIncrement: true,
      type: Sequelize.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    first_name: {
      type: Sequelize.STRING(200),
      allowNull: true
    },
    last_name: {
      type: Sequelize.STRING(200),
      allowNull: true
    },
    national_code: {
      type: Sequelize.STRING(45),
      allowNull: true
    },
    id_number: {
      type: Sequelize.STRING(45),
      allowNull: true
    },
    father_name: {
      type: Sequelize.STRING(200),
      allowNull: true
    },
    gender: {
      type: Sequelize.STRING(45),
      allowNull: true
    },
    mobile: {
      type: Sequelize.STRING(45),
      allowNull: true
    },
    code: {
      type: Sequelize.STRING(200),
      allowNull: true
    },
    birth_date: {
      type: Sequelize.DATE,
      allowNull: true
    }
  }, {
    sequelize,
    tableName: 'survey_user',
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
