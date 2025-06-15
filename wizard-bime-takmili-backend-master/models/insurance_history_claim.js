const Sequelize = require('sequelize');
module.exports = function(sequelize) {
  return sequelize.define('insurance_history_claim', {
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
    workshop_code: {
      type: Sequelize.STRING(45),
      allowNull: true
    },
    row: {
      type: Sequelize.STRING(45),
      allowNull: true
    },
    year: {
      type: Sequelize.DECIMAL(10,0),
      allowNull: true
    },
    month: {
      type: Sequelize.DECIMAL(10,0),
      allowNull: true
    },
    number_of_days: {
      type: Sequelize.DECIMAL(10,0),
      allowNull: true
    },
    salary_bonus: {
      type: Sequelize.DECIMAL(10,0),
      allowNull: true
    },
    status: {
      type: Sequelize.STRING(200),
      allowNull: true
    },
    register_number: {
      type: Sequelize.STRING(200),
      allowNull: true
    },
    register_date: {
      type: Sequelize.DATE,
      allowNull: true
    },
    debt: {
      type: Sequelize.DECIMAL(10,0),
      allowNull: true
    },
    contract_id_fk: {
      type: Sequelize.INTEGER,
      allowNull: true
    }
  }, {
    sequelize,
    tableName: 'insurance_history_claim',
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
