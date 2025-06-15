const Sequelize = require('sequelize');
module.exports = function(sequelize) {
  return sequelize.define('incident', {
    id: {
      autoIncrement: true,
      type: Sequelize.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    type: {
      type: Sequelize.TEXT,
      allowNull: true
    },
    date: {
      type: Sequelize.DATE,
      allowNull: true
    },
    contract_id_fk: {
      type: Sequelize.INTEGER,
      allowNull: true
    },
    address: {
      type: Sequelize.TEXT,
      allowNull: true
    },
    reason: {
      type: Sequelize.TEXT,
      allowNull: true
    },
    description: {
      type: Sequelize.TEXT,
      allowNull: true
    },
    medicine: {
      type: Sequelize.TEXT,
      allowNull: true
    },
    approved: {
      type: Sequelize.TINYINT,
      allowNull: true
    },
    accident_reason: {
      type: Sequelize.TEXT,
      allowNull: true
    },
    reason_other: {
      type: Sequelize.TEXT,
      allowNull: true
    }
  }, {
    sequelize,
    tableName: 'incident',
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
