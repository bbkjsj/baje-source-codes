const Sequelize = require('sequelize');
module.exports = function(sequelize) {
  return sequelize.define('settle_status', {
    id: {
      autoIncrement: true,
      type: Sequelize.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    settle_id_fk: {
      type: Sequelize.INTEGER,
      allowNull: true
    },
    unit: {
      type: Sequelize.STRING(200),
      allowNull: true
    },
    result: {
      type: Sequelize.STRING(300),
      allowNull: true
    },
    description: {
      type: Sequelize.TEXT,
      allowNull: true
    },
    date: {
      type: Sequelize.DATE,
      allowNull: true
    }
  }, {
    sequelize,
    tableName: 'settle_status',
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
