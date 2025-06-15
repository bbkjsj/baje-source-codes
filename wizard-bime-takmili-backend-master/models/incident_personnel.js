const Sequelize = require('sequelize');
module.exports = function(sequelize) {
  return sequelize.define('incident_personnel', {
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
    injury: {
      type: Sequelize.TEXT,
      allowNull: true
    },
    injury_type: {
      type: Sequelize.TEXT,
      allowNull: true
    },
    relation: {
      type: Sequelize.STRING(200),
      allowNull: true
    },
    incident_id_fk: {
      type: Sequelize.INTEGER,
      allowNull: true
    },
    injury_other: {
      type: Sequelize.TEXT,
      allowNull: true
    },
    injury_type_other: {
      type: Sequelize.TEXT,
      allowNull: true
    }
  }, {
    sequelize,
    tableName: 'incident_personnel',
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
