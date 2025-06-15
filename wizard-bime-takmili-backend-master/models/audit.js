const Sequelize = require('sequelize');
module.exports = function(sequelize) {
  return sequelize.define('audit', {
    id: {
      autoIncrement: true,
      type: Sequelize.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    body: {
      type: Sequelize.TEXT,
      allowNull: true
    },
    request_type: {
      type: Sequelize.STRING(45),
      allowNull: true
    },
    path: {
      type: Sequelize.STRING(300),
      allowNull: true
    },
    date: {
      type: Sequelize.DATE,
      allowNull: true
    },
    user_object: {
      type: Sequelize.TEXT,
      allowNull: true
    },
    ip_address: {
      type: Sequelize.STRING(45),
      allowNull: true
    }
  }, {
    sequelize,
    tableName: 'audit',
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
