const Sequelize = require('sequelize');
module.exports = function(sequelize) {
  return sequelize.define('insurance_tamin_disk', {
    id: {
      autoIncrement: true,
      type: Sequelize.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    tamin_id_fk: {
      type: Sequelize.INTEGER,
      allowNull: true
    },
    total_benefit_include: {
      type: Sequelize.DECIMAL(10,0),
      allowNull: true
    },
    total_insured: {
      type: Sequelize.DECIMAL(10,0),
      allowNull: true
    },
    total_employer: {
      type: Sequelize.DECIMAL(10,0),
      allowNull: true
    },
    total_jobless: {
      type: Sequelize.DECIMAL(10,0),
      allowNull: true
    },
    code: {
      type: Sequelize.STRING(100),
      allowNull: true
    },
    date: {
      type: Sequelize.DATE,
      allowNull: true
    },
    personnel_id_fk: {
      type: Sequelize.INTEGER,
      allowNull: true
    },
    personnel_count: {
      type: Sequelize.DECIMAL(10,0),
      allowNull: true
    },
    workshop_code: {
      type: Sequelize.STRING(100),
      allowNull: true
    },
    row: {
      type: Sequelize.STRING(100),
      allowNull: true
    },
    month: {
      type: Sequelize.STRING(45),
      allowNull: true
    },
    year: {
      type: Sequelize.STRING(45),
      allowNull: true
    }
  }, {
    sequelize,
    tableName: 'insurance_tamin_disk',
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
