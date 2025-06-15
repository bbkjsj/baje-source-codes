const Sequelize = require('sequelize');
module.exports = function(sequelize) {
  return sequelize.define('company', {
    id: {
      autoIncrement: true,
      type: Sequelize.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    name: {
      type: Sequelize.STRING(100),
      allowNull: true
    },
    register_number: {
      type: Sequelize.STRING(45),
      allowNull: true
    },
    register_date: {
      type: Sequelize.DATE,
      allowNull: true
    },
    national_id: {
      type: Sequelize.STRING(45),
      allowNull: true
    },
    finance_code: {
      type: Sequelize.STRING(45),
      allowNull: true
    },
    manager_id_fk: {
      type: Sequelize.INTEGER,
      allowNull: true
    },
    logo_url: {
      type: Sequelize.STRING(300),
      allowNull: true
    },
    sign_owners: {
      type: Sequelize.STRING(300),
      allowNull: true
    },
    sign_url: {
      type: Sequelize.STRING(300),
      allowNull: true
    },
    seal_url: {
      type: Sequelize.STRING(300),
      allowNull: true
    },
    phone: {
      type: Sequelize.STRING(45),
      allowNull: true
    },
    address: {
      type: Sequelize.TEXT,
      allowNull: true
    },
    postal_code: {
      type: Sequelize.STRING(45),
      allowNull: true
    },
    email: {
      type: Sequelize.STRING(100),
      allowNull: true
    },
    description: {
      type: Sequelize.TEXT,
      allowNull: true
    },
    approved: {
      type: Sequelize.TINYINT,
      allowNull: true
    },
    approve_date: {
      type: Sequelize.DATE,
      allowNull: true
    },
    approve_user_id: {
      type: Sequelize.INTEGER,
      allowNull: true
    },
    deleted: {
      type: Sequelize.TINYINT,
      allowNull: true
    },
    is_group: {
      type: Sequelize.TINYINT,
      allowNull: true
    }
  }, {
    sequelize,
    tableName: 'company',
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
