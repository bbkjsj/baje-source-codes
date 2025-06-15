const Sequelize = require('sequelize');
module.exports = function(sequelize) {
  return sequelize.define('insurance_takmili_subordinate_upload', {
    id: {
      autoIncrement: true,
      type: Sequelize.BIGINT,
      allowNull: false,
      primaryKey: true
    },
    subordinate_id_fk: {
      type: Sequelize.BIGINT,
      allowNull: false
    },
    description: {
      type: Sequelize.STRING(1000),
      allowNull: true
    },
    path: {
      type: Sequelize.STRING(1000),
      allowNull: true
    },
    is_approved: {
      type: Sequelize.BOOLEAN,
      allowNull: false,
      defaultValue: 0
    },
    is_deleted: {
      type: Sequelize.BOOLEAN,
      allowNull: false,
      defaultValue: 0
    },
    created_date: {
      type: Sequelize.DATE,
    },
    modify_date: {
      type: Sequelize.DATE,
    },
  }, {
    sequelize,
    tableName: 'insurance_takmili_subordinate_upload',
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
