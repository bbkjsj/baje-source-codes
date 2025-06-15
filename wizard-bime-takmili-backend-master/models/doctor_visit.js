const Sequelize = require('sequelize');
module.exports = function(sequelize) {
  return sequelize.define('doctor_visit', {
    id: {
      autoIncrement: true,
      type: Sequelize.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    visit_date: {
      type: Sequelize.DATE,
      allowNull: true
    },
    doctor_id_fk: {
      type: Sequelize.INTEGER,
      allowNull: true
    },
    result: {
      type: Sequelize.STRING(300),
      allowNull: true
    },
    approved_position_code: {
      type: Sequelize.STRING(45),
      allowNull: true
    },
    next_visit_date: {
      type: Sequelize.DATE,
      allowNull: true
    },
    special_description: {
      type: Sequelize.TEXT,
      allowNull: true
    },
    personnel_id_fk: {
      type: Sequelize.INTEGER,
      allowNull: true
    }
  }, {
    sequelize,
    tableName: 'doctor_visit',
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
