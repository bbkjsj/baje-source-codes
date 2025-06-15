const Sequelize = require('sequelize');
module.exports = function(sequelize) {
  return sequelize.define('contract_progress', {
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
    date: {
      type: Sequelize.DATE,
      allowNull: true
    },
    real_progress: {
      type: Sequelize.DECIMAL(10,2),
      allowNull: true
    },
    program_progress: {
      type: Sequelize.DECIMAL(10,2),
      allowNull: true
    },
    status: {
      type: Sequelize.STRING(100),
      allowNull: true
    },
    edit_by_admin: {
      type: Sequelize.TINYINT,
      allowNull: true
    }
  }, {
    sequelize,
    tableName: 'contract_progress',
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
