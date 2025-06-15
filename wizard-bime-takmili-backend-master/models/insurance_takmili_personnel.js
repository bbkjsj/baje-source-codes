const Sequelize = require('sequelize');
module.exports = function(sequelize) {
  return sequelize.define('insurance_takmili_personnel', {
    id: {
      autoIncrement: true,
      type: Sequelize.INTEGER,
      allowNull: false,
      primaryKey: true
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
    description: {
      type: Sequelize.TEXT,
      allowNull: true
    },
    insurance_id_fk: {
      type: Sequelize.INTEGER,
      allowNull: true
    },
    main_insurer_personnel_id_fk: {
      type: Sequelize.INTEGER,
      allowNull: true
    },
    is_approved: {
      type: Sequelize.TINYINT,
      allowNull: true
    },
    is_deleted: {
      type: Sequelize.TINYINT,
      allowNull: true
    }
  }, {
    sequelize,
    tableName: 'insurance_takmili_personnel',
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
