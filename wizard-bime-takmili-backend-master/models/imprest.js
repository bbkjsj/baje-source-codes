const Sequelize = require('sequelize');
module.exports = function(sequelize) {
  return sequelize.define('imprest', {
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
    amount: {
      type: Sequelize.DECIMAL(10,0),
      allowNull: true
    },
    number_of_installment: {
      type: Sequelize.DECIMAL(10,0),
      allowNull: true
    },
    description: {
      type: Sequelize.TEXT,
      allowNull: true
    },
    date: {
      type: Sequelize.DATE,
      allowNull: true
    },
    project_manager_status: {
      type: Sequelize.STRING(100),
      allowNull: true
    },
    accountant_status: {
      type: Sequelize.STRING(100),
      allowNull: true
    },
    company_id_fk: {
      type: Sequelize.INTEGER,
      allowNull: true
    },
    paid_amount: {
      type: Sequelize.DECIMAL(10,0),
      allowNull: true
    }
  }, {
    sequelize,
    tableName: 'imprest',
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
