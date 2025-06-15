const Sequelize = require('sequelize');
module.exports = function(sequelize) {
  return sequelize.define('contract_peyman_report', {
    id: {
      autoIncrement: true,
      type: Sequelize.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    contract_id_fk: {
      type: Sequelize.INTEGER,
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
      type: Sequelize.STRING(200),
      allowNull: true
    },
    disabled_car_no_tier_quantity: {
      type: Sequelize.INTEGER,
      allowNull: true
    },
    disabled_car_no_part_quantity: {
      type: Sequelize.INTEGER,
      allowNull: true
    },
    active_car_quantity: {
      type: Sequelize.INTEGER,
      allowNull: true
    },
    ready_to_work_factor: {
      type: Sequelize.DECIMAL(10,0),
      allowNull: true
    },
    description: {
      type: Sequelize.TEXT,
      allowNull: true
    },
    ready_to_work_car_quantity: {
      type: Sequelize.INTEGER,
      allowNull: true
    }
  }, {
    sequelize,
    tableName: 'contract_peyman_report',
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
