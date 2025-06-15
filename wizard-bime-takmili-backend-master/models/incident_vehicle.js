const Sequelize = require('sequelize');
module.exports = function(sequelize) {
  return sequelize.define('incident_vehicle', {
    id: {
      autoIncrement: true,
      type: Sequelize.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    vehicle_id_fk: {
      type: Sequelize.INTEGER,
      allowNull: true
    },
    incident_id_fk: {
      type: Sequelize.INTEGER,
      allowNull: true
    },
    damage: {
      type: Sequelize.TEXT,
      allowNull: true
    }
  }, {
    sequelize,
    tableName: 'incident_vehicle',
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
