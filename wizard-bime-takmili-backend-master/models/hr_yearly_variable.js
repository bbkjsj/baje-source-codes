const Sequelize = require('sequelize');
module.exports = function(sequelize) {
  return sequelize.define('hr_yearly_variable', {
    id: {
      autoIncrement: true,
      type: Sequelize.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    year: {
      type: Sequelize.DECIMAL(10,0),
      allowNull: true
    },
    min_daily_salary: {
      type: Sequelize.DECIMAL(10,0),
      allowNull: true
    },
    max_daily_salary: {
      type: Sequelize.DECIMAL(10,0),
      allowNull: true
    },
    bonus: {
      type: Sequelize.DECIMAL(10,0),
      allowNull: true
    },
    housing: {
      type: Sequelize.DECIMAL(10,0),
      allowNull: true
    },
    description: {
      type: Sequelize.TEXT,
      allowNull: true
    }
  }, {
    sequelize,
    tableName: 'hr_yearly_variable',
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
