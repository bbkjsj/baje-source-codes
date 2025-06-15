const Sequelize = require('sequelize');
module.exports = function(sequelize) {
  return sequelize.define('personnel_access', {
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
    access: {
      type: Sequelize.STRING(100),
      allowNull: true
    },
    company_id_fk: {
      type: Sequelize.INTEGER,
      allowNull: true
    },
    contract_id_fk: {
      type: Sequelize.INTEGER,
      allowNull: true
    }
  }, {
    sequelize,
    tableName: 'personnel_access',
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
