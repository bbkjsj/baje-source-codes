const Sequelize = require('sequelize');
module.exports = function(sequelize) {
  return sequelize.define('personnel_mission', {
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
    type: {
      type: Sequelize.STRING(200),
      allowNull: true
    },
    location: {
      type: Sequelize.STRING(400),
      allowNull: true
    },
    subject: {
      type: Sequelize.STRING(500),
      allowNull: true
    },
    from_date: {
      type: Sequelize.DATE,
      allowNull: true
    },
    to_date: {
      type: Sequelize.DATE,
      allowNull: true
    },
    residency: {
      type: Sequelize.STRING(300),
      allowNull: true
    },
    vehicle: {
      type: Sequelize.STRING(400),
      allowNull: true
    },
    description: {
      type: Sequelize.TEXT,
      allowNull: true
    },
    status: {
      type: Sequelize.STRING(200),
      allowNull: true
    }
  }, {
    sequelize,
    tableName: 'personnel_mission',
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
