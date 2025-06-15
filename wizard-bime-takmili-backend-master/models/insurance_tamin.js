const Sequelize = require('sequelize');
module.exports = function(sequelize) {
  return sequelize.define('insurance_tamin', {
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
    year: {
      type: Sequelize.DECIMAL(10,0),
      allowNull: true
    },
    month: {
      type: Sequelize.DECIMAL(10,0),
      allowNull: true
    },
    list_number: {
      type: Sequelize.STRING(100),
      allowNull: true
    },
    description: {
      type: Sequelize.TEXT,
      allowNull: true
    },
    status: {
      type: Sequelize.STRING(100),
      allowNull: true
    }
  }, {
    sequelize,
    tableName: 'insurance_tamin',
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
