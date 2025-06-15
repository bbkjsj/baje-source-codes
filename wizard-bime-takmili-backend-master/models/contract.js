const Sequelize = require('sequelize');
module.exports = function(sequelize) {
  return sequelize.define('contract', {
    id: {
      autoIncrement: true,
      type: Sequelize.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    type: {
      type: Sequelize.STRING(45),
      allowNull: true
    },
    number: {
      type: Sequelize.STRING(45),
      allowNull: true
    },
    date: {
      type: Sequelize.DATE,
      allowNull: true
    },
    employer: {
      type: Sequelize.STRING(200),
      allowNull: true
    },
    contractor: {
      type: Sequelize.STRING(200),
      allowNull: true
    },
    subject: {
      type: Sequelize.STRING(200),
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
    initial_amount: {
      type: Sequelize.DOUBLE(22,0),
      allowNull: true
    },
    workshop_code: {
      type: Sequelize.STRING(10),
      allowNull: true
    },
    row: {
      type: Sequelize.STRING(10),
      allowNull: true
    },
    supervision: {
      type: Sequelize.STRING(100),
      allowNull: true
    },
    manager_id: {
      type: Sequelize.INTEGER,
      allowNull: true
    },
    code: {
      type: Sequelize.STRING(45),
      allowNull: true
    },
    employer_id: {
      type: Sequelize.INTEGER,
      allowNull: true
    },
    boss_id: {
      type: Sequelize.STRING(45),
      allowNull: true
    },
    contractor_type: {
      type: Sequelize.STRING(45),
      allowNull: true
    },
    contractor_id: {
      type: Sequelize.INTEGER,
      allowNull: true
    },
    deleted: {
      type: Sequelize.TINYINT,
      allowNull: true
    },
    main_contract_id_fk: {
      type: Sequelize.INTEGER,
      allowNull: true
    },
    can_delete: {
      type: Sequelize.TINYINT,
      allowNull: true
    },
    edit_by_admin: {
      type: Sequelize.TINYINT,
      allowNull: true
    },
    activity: {
      type: Sequelize.STRING(100),
      allowNull: true
    }
  }, {
    sequelize,
    tableName: 'contract',
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
