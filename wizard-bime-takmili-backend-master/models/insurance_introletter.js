const Sequelize = require('sequelize');
module.exports = function(sequelize) {
  return sequelize.define('insurance_introletter', {
    id: {
      autoIncrement: true,
      type: Sequelize.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    company_id_fk: {
      type: Sequelize.INTEGER,
      allowNull: true
    },
    personnel_id_fk: {
      type: Sequelize.INTEGER,
      allowNull: true
    },
    subordinates: {
      type: Sequelize.STRING(300),
      allowNull: true
    },
    date: {
      type: Sequelize.DATE,
      allowNull: true
    },
    type: {
      type: Sequelize.STRING(45),
      allowNull: true
    },
    insurance_id_fk: {
      type: Sequelize.INTEGER,
      allowNull: true
    }
  }, {
    sequelize,
    tableName: 'insurance_introletter',
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
