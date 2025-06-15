const Sequelize = require('sequelize');
module.exports = function(sequelize) {
  return sequelize.define('insurance', {
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
    insurer_main: {
      type: Sequelize.STRING(300),
      allowNull: true
    },
    insurer_company: {
      type: Sequelize.STRING(300),
      allowNull: true
    },
    contract_number: {
      type: Sequelize.STRING(45),
      allowNull: true
    },
    contract_issue_date: {
      type: Sequelize.DATE,
      allowNull: true
    },
    contract_date_from_date: {
      type: Sequelize.DATE,
      allowNull: true
    },
    to_date: {
      type: Sequelize.DATE,
      allowNull: true
    },
    main_insured: {
      type: Sequelize.DECIMAL(10,0),
      allowNull: true
    },
    spouse_insured: {
      type: Sequelize.DECIMAL(10,0),
      allowNull: true
    },
    doughter_insured: {
      type: Sequelize.DECIMAL(10,0),
      allowNull: true
    },
    son_insured: {
      type: Sequelize.DECIMAL(10,0),
      allowNull: true
    },
    father_insured: {
      type: Sequelize.DECIMAL(10,0),
      allowNull: true
    },
    mother_insured: {
      type: Sequelize.DECIMAL(10,0),
      allowNull: true
    },
    description: {
      type: Sequelize.TEXT,
      allowNull: true
    },
    personnel_id_fk: {
      type: Sequelize.INTEGER,
      allowNull: true
    },
    company_id_fk: {
      type: Sequelize.INTEGER,
      allowNull: true
    },
    approved: {
      type: Sequelize.TINYINT,
      allowNull: true
    },
    pdf_file_url: {
      type: Sequelize.STRING(300),
      allowNull: true
    },
    insurer_main_company_id_fk: {
      type: Sequelize.INTEGER,
      allowNull: true
    },
    change_deadline_date: {
      type: Sequelize.DATE,
      allowNull: true
    }
  }, {
    sequelize,
    tableName: 'insurance',
    timestamps: false,
    defaultScope: {
      attributes: {
        exclude: [
          "change_deadline_date",
          "contract_issue_date",
          "insurer_main_company_id_fk",
          "approved",
          "company_id_fk",
          "personnel_id_fk",
          "personnel_id_fk",
        ]
      }
    },
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
