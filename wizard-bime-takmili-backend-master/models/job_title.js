const Sequelize = require('sequelize');
module.exports = function(sequelize) {
  return sequelize.define('job_title', {
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
      type: Sequelize.STRING(45),
      allowNull: true
    }
  }, {
    sequelize,
    tableName: 'job_title',
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
