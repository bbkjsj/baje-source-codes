const Sequelize = require('sequelize');
module.exports = function(sequelize) {
  return sequelize.define('insurance_tamin_personnel', {
    id: {
      autoIncrement: true,
      type: Sequelize.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    insurance_tamin_id_fk: {
      type: Sequelize.INTEGER,
      allowNull: true
    },
    personnel_id_fk: {
      type: Sequelize.INTEGER,
      allowNull: true
    },
    start_date: {
      type: Sequelize.DATE,
      allowNull: true
    },
    end_date: {
      type: Sequelize.DATE,
      allowNull: true
    },
    total_work_day: {
      type: Sequelize.DECIMAL(10,0),
      allowNull: true
    },
    daily_salary: {
      type: Sequelize.DECIMAL(10,0),
      allowNull: true
    },
    monthly_salary: {
      type: Sequelize.DECIMAL(10,0),
      allowNull: true
    },
    include_benefit: {
      type: Sequelize.DECIMAL(10,0),
      allowNull: true
    },
    salary_benefit_include: {
      type: Sequelize.DECIMAL(10,0),
      allowNull: true
    },
    salary_benefit_include_notinclude: {
      type: Sequelize.DECIMAL(10,0),
      allowNull: true
    },
    insured_share: {
      type: Sequelize.DECIMAL(10,0),
      allowNull: true
    },
    employer_share: {
      type: Sequelize.DECIMAL(10,0),
      allowNull: true
    },
    jobless_share: {
      type: Sequelize.DECIMAL(10,0),
      allowNull: true
    },
    hard_job_share: {
      type: Sequelize.DECIMAL(10,0),
      allowNull: true
    },
    total_share: {
      type: Sequelize.DECIMAL(10,0),
      allowNull: true
    },
    job_id_fk: {
      type: Sequelize.INTEGER,
      allowNull: true
    },
    description: {
      type: Sequelize.TEXT,
      allowNull: true
    }
  }, {
    sequelize,
    tableName: 'insurance_tamin_personnel',
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
