const Sequelize = require('sequelize');
module.exports = function(sequelize) {
  return sequelize.define('vehicle_type', {
    id: {
      autoIncrement: true,
      type: Sequelize.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    title: {
      type: Sequelize.STRING(100),
      allowNull: true
    },
    code: {
      type: Sequelize.STRING(200),
      allowNull: true
    },
    pelak: {
      type: Sequelize.TINYINT,
      allowNull: true
    }
  }, {
    sequelize,
    tableName: 'vehicle_type',
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
