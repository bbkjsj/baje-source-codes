const Sequelize = require('sequelize');
module.exports = function(sequelize) {
  return sequelize.define('contract_production_report', {
    id: {
      autoIncrement: true,
      type: Sequelize.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    stone_tonnage: {
      type: Sequelize.DECIMAL(10,0),
      allowNull: true
    },
    dust_tonnage: {
      type: Sequelize.DECIMAL(10,0),
      allowNull: true
    },
    stone_load_quantity: {
      type: Sequelize.DECIMAL(10,0),
      allowNull: true
    },
    dust_load_quantity: {
      type: Sequelize.DECIMAL(10,0),
      allowNull: true
    },
    contract_id_fk: {
      type: Sequelize.STRING(45),
      allowNull: true
    },
    edit_by_admin: {
      type: Sequelize.TINYINT,
      allowNull: true
    },
    date: {
      type: Sequelize.DATE,
      allowNull: true
    },
    status: {
      type: Sequelize.STRING(300),
      allowNull: true
    },
    description: {
      type: Sequelize.TEXT,
      allowNull: true
    }
  }, {
    sequelize,
    tableName: 'contract_production_report',
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
