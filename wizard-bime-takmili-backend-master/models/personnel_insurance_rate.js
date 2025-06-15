const Sequelize = require('sequelize');
module.exports = function(sequelize) {
  return sequelize.define('personnel_insurance_rate', {
    id: {
      autoIncrement: true,
      type: Sequelize.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    personnel_id_fk: {
      type: Sequelize.INTEGER,
      allowNull: true
    },
    insured_rate: {
      type: Sequelize.DECIMAL(10,0),
      allowNull: true
    },
    employer_rate: {
      type: Sequelize.DECIMAL(10,0),
      allowNull: true
    },
    jobless_rate: {
      type: Sequelize.DECIMAL(10,0),
      allowNull: true
    },
    hard_job_rate: {
      type: Sequelize.DECIMAL(10,0),
      allowNull: true
    }
  }, {
    sequelize,
    tableName: 'personnel_insurance_rate',
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
