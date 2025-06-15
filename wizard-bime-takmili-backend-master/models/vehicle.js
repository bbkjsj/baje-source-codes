const Sequelize = require('sequelize');
module.exports = function(sequelize) {
  return sequelize.define('vehicle', {
    id: {
      autoIncrement: true,
      type: Sequelize.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    status: {
      type: Sequelize.STRING(45),
      allowNull: true
    },
    organization_code: {
      type: Sequelize.STRING(100),
      allowNull: true
    },
    type_id_fk: {
      type: Sequelize.INTEGER,
      allowNull: true
    },
    system_id_fk: {
      type: Sequelize.INTEGER,
      allowNull: true
    },
    style_id_fk: {
      type: Sequelize.INTEGER,
      allowNull: true
    },
    plaque1: {
      type: Sequelize.STRING(2),
      allowNull: true
    },
    plaque2: {
      type: Sequelize.STRING(1),
      allowNull: true
    },
    plaque3: {
      type: Sequelize.STRING(3),
      allowNull: true
    },
    plaque4: {
      type: Sequelize.STRING(2),
      allowNull: true
    },
    engine_number: {
      type: Sequelize.STRING(200),
      allowNull: true
    },
    chassis_number: {
      type: Sequelize.STRING(200),
      allowNull: true
    },
    vin_number: {
      type: Sequelize.STRING(200),
      allowNull: true
    },
    serial_number: {
      type: Sequelize.STRING(200),
      allowNull: true
    },
    made_year: {
      type: Sequelize.STRING(5),
      allowNull: true
    },
    color: {
      type: Sequelize.STRING(45),
      allowNull: true
    },
    gearbox: {
      type: Sequelize.STRING(10),
      allowNull: true
    },
    price: {
      type: Sequelize.DOUBLE(22,0),
      allowNull: true
    },
    contract_id_fk: {
      type: Sequelize.INTEGER,
      allowNull: true
    },
    description: {
      type: Sequelize.TEXT,
      allowNull: true
    },
    card_url: {
      type: Sequelize.STRING(200),
      allowNull: true
    },
    green_card_url: {
      type: Sequelize.STRING(200),
      allowNull: true
    },
    ownership_document_url: {
      type: Sequelize.STRING(200),
      allowNull: true
    }
  }, {
    sequelize,
    tableName: 'vehicle',
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
