const Sequelize = require('sequelize');
module.exports = function(sequelize) {
  return sequelize.define('personnel_insurance_deduction', {
    id: {
      autoIncrement: true,
      type: Sequelize.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    payment_method: {
      type: Sequelize.STRING(100),
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
    document_number: {
      type: Sequelize.STRING(200),
      allowNull: true
    },
    document_date: {
      type: Sequelize.DATE,
      allowNull: true
    },
    payment_date: {
      type: Sequelize.DATE,
      allowNull: true
    },
    description: {
      type: Sequelize.TEXT,
      allowNull: true
    },
    amount: {
      type: Sequelize.DECIMAL(10,0),
      allowNull: true
    },
    personnel_id_fk: {
      type: Sequelize.INTEGER,
      allowNull: true
    },
    insurance_id_fk: {
      type: Sequelize.INTEGER,
      allowNull: true
    }
  }, {
    sequelize,
    tableName: 'personnel_insurance_deduction',
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
