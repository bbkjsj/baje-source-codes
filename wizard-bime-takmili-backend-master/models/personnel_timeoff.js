const Sequelize = require('sequelize');
module.exports = function(sequelize) {
  return sequelize.define('personnel_timeoff', {
    id: {
      autoIncrement: true,
      type: Sequelize.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    type: {
      type: Sequelize.STRING(200),
      allowNull: true
    },
    request_type: {
      type: Sequelize.STRING(200),
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
    description: {
      type: Sequelize.TEXT,
      allowNull: true
    },
    status: {
      type: Sequelize.STRING(200),
      allowNull: true
    },
    personnel_id_fk: {
      type: Sequelize.INTEGER,
      allowNull: true
    },
    file_url: {
      type: Sequelize.STRING(300),
      allowNull: true
    }
  }, {
    sequelize,
    tableName: 'personnel_timeoff',
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
