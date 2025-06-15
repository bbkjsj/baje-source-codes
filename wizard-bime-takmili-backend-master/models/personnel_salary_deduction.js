const Sequelize = require('sequelize');
module.exports = function(sequelize) {
  return sequelize.define('personnel_salary_deduction', {
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
    contract_code: {
      type: Sequelize.STRING(45),
      allowNull: true
    },
    period: {
      type: Sequelize.STRING(100),
      allowNull: true
    },
    insurance_amount: {
      type: Sequelize.DECIMAL(10,0),
      allowNull: true
    }
  }, {
    sequelize,
    tableName: 'personnel_salary_deduction',
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
