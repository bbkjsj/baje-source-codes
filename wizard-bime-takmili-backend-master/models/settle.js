const Sequelize = require('sequelize');
module.exports = function(sequelize) {
  return sequelize.define('settle', {
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
    date: {
      type: Sequelize.DATE,
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
    approved: {
      type: Sequelize.TINYINT,
      allowNull: true
    },
    register_user_id_fk: {
      type: Sequelize.INTEGER,
      allowNull: true
    },
    status: {
      type: Sequelize.STRING(200),
      allowNull: true
    }
  }, {
    sequelize,
    tableName: 'settle',
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
