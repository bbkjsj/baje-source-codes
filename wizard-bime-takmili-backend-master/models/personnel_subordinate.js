const Sequelize = require('sequelize');
module.exports = function(sequelize) {
  return sequelize.define('personnel_subordinate', {
    id: {
      autoIncrement: true,
      type: Sequelize.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    personnel_id_fk: {
      type: Sequelize.INTEGER,
      allowNull: false
    },
    first_name: {
      type: Sequelize.STRING(100),
      allowNull: true
    },
    last_name: {
      type: Sequelize.STRING(100),
      allowNull: true
    },
    relation: {
      type: Sequelize.STRING(45),
      allowNull: true
    },
    national_code: {
      type: Sequelize.STRING(10),
      allowNull: true
    },
    sponsorship_status: {
      type: Sequelize.STRING(100),
      allowNull: true
    },
    sponsor_description: {
      type: Sequelize.TEXT,
      allowNull: true
    },
    sponsor_date: {
      type: Sequelize.DATE,
      allowNull: true
    },
    father_name: {
      type: Sequelize.STRING(100),
      allowNull: true
    },
    id_number: {
      type: Sequelize.STRING(45),
      allowNull: true
    },
    birth_date: {
      type: Sequelize.DATE,
      allowNull: true
    },
    issue_place: {
      type: Sequelize.STRING(200),
      allowNull: true
    },
    insurance_number: {
      type: Sequelize.STRING(45),
      allowNull: true
    },
    exit_sponsor_reason: {
      type: Sequelize.TEXT,
      allowNull: true
    },
    exit_sponsor_date: {
      type: Sequelize.DATE,
      allowNull: true
    }
  }, {
    sequelize,
    tableName: 'personnel_subordinate',
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
