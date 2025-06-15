const Sequelize = require('sequelize');
module.exports = function(sequelize) {
  return sequelize.define('job_permission', {
    id: {
      autoIncrement: true,
      type: Sequelize.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    job_id_fk: {
      type: Sequelize.INTEGER,
      allowNull: true
    },
    permission: {
      type: Sequelize.STRING(100),
      allowNull: true
    }
  }, {
    sequelize,
    tableName: 'job_permission',
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
