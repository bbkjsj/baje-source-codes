const Sequelize = require('sequelize');
module.exports = function(sequelize) {
  return sequelize.define('insurance_payment', {
    id: {
      autoIncrement: true,
      type: Sequelize.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    paid_for: {
      type: Sequelize.STRING(300),
      allowNull: true
    },
    insurance_tamin_id_fk: {
      type: Sequelize.INTEGER,
      allowNull: true
    },
    installment_number: {
      type: Sequelize.STRING(45),
      allowNull: true
    },
    periodic_debt_start_date: {
      type: Sequelize.DATE,
      allowNull: true
    },
    periodic_debt_end_date: {
      type: Sequelize.DATE,
      allowNull: true
    },
    estimated_debt: {
      type: Sequelize.DECIMAL(10,0),
      allowNull: true
    },
    peiman_insured_share: {
      type: Sequelize.DECIMAL(10,0),
      allowNull: true
    },
    insured_share: {
      type: Sequelize.DECIMAL(10,0),
      allowNull: true
    },
    jobless_share: {
      type: Sequelize.DECIMAL(10,0),
      allowNull: true
    },
    penalty_share: {
      type: Sequelize.DECIMAL(10,0),
      allowNull: true
    },
    execution_share: {
      type: Sequelize.DECIMAL(10,0),
      allowNull: true
    },
    pay_date: {
      type: Sequelize.DATE,
      allowNull: true
    },
    file_url: {
      type: Sequelize.STRING(400),
      allowNull: true
    },
    status: {
      type: Sequelize.STRING(300),
      allowNull: true
    }
  }, {
    sequelize,
    tableName: 'insurance_payment',
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
