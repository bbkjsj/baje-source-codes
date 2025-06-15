const Sequelize = require('sequelize');
module.exports = function(sequelize) {
  return sequelize.define('damage_service', {
    id: {
      autoIncrement: true,
      type: Sequelize.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    personnel_id_fk: {
      type: Sequelize.INTEGER,
      allowNull: false
    },
    type: {
      type: Sequelize.STRING(45),
      allowNull: true
    },
    date: {
      type: Sequelize.DATE,
      allowNull: true
    },
    description: {
      type: Sequelize.TEXT,
      allowNull: true
    },
    type_service_damage: {
      type: Sequelize.STRING(300),
      allowNull: true
    },
    type_reward_penalty: {
      type: Sequelize.STRING(300),
      allowNull: true
    },
    amount_reward_penalty: {
      type: Sequelize.STRING(500),
      allowNull: true
    },
    hr_approved: {
      type: Sequelize.TINYINT,
      allowNull: true
    },
    project_admin_approved: {
      type: Sequelize.TINYINT,
      allowNull: true
    },
    hr_admin_approved: {
      type: Sequelize.TINYINT,
      allowNull: true
    },
    manager_approved: {
      type: Sequelize.TINYINT,
      allowNull: true
    }
  }, {
    sequelize,
    tableName: 'damage_service',
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
