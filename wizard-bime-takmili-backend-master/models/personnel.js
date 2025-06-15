const Sequelize = require('sequelize');
module.exports = function (sequelize) {
    return sequelize.define('personnel', {
        id: {
            autoIncrement: true,
            type: Sequelize.INTEGER,
            allowNull: false,
            primaryKey: true
        },
        birth_date: {
            type: Sequelize.STRING(45),
            allowNull: true
        },
        national_number: {
            type: Sequelize.STRING(10),
            allowNull: true
        },
        first_name: {
            type: Sequelize.STRING(100),
            allowNull: true
        },
        last_name: {
            type: Sequelize.STRING(100),
            allowNull: true
        },
        father_name: {
            type: Sequelize.STRING(100),
            allowNull: true
        },
        id_number: {
            type: Sequelize.STRING(45),
            allowNull: true
        },
        sex: {
            type: Sequelize.STRING(1),
            allowNull: true
        },
        birth_place: {
            type: Sequelize.STRING(100),
            allowNull: true
        },
        id_issue_place: {
            type: Sequelize.STRING(100),
            allowNull: true
        },
        nation: {
            type: Sequelize.STRING(100),
            allowNull: true
        },
        public_description: {
            type: Sequelize.TEXT,
            allowNull: true
        },
        private_description: {
            type: Sequelize.TEXT,
            allowNull: true
        },
        password: {
            type: Sequelize.STRING(200),
            allowNull: true
        },
        image_url: {
            type: Sequelize.STRING(300),
            allowNull: true
        },
        marital_status: {
            type: Sequelize.STRING(45),
            allowNull: true
        },
        army_service: {
            type: Sequelize.STRING(45),
            allowNull: true
        },
        education: {
            type: Sequelize.STRING(100),
            allowNull: true
        },
        job_title: {
            type: Sequelize.STRING(200),
            allowNull: true
        },
        insurance_number: {
            type: Sequelize.STRING(100),
            allowNull: true
        },
        personnel_id: {
            type: Sequelize.STRING(45),
            allowNull: true
        },
        job_type: {
            type: Sequelize.STRING(45),
            allowNull: true
        },
        job_status: {
            type: Sequelize.STRING(45),
            allowNull: true
        },
        job_disable_date: {
            type: Sequelize.DATE,
            allowNull: true
        },
        job_disable_description: {
            type: Sequelize.TEXT,
            allowNull: true
        },
        mobile1: {
            type: Sequelize.STRING(11),
            allowNull: true
        },
        mobile2: {
            type: Sequelize.STRING(11),
            allowNull: true
        },
        phone: {
            type: Sequelize.STRING(100),
            allowNull: true
        },
        email: {
            type: Sequelize.STRING(200),
            allowNull: true
        },
        bank_account1: {
            type: Sequelize.STRING(45),
            allowNull: true
        },
        sheba1: {
            type: Sequelize.STRING(45),
            allowNull: true
        },
        bank_name1: {
            type: Sequelize.STRING(45),
            allowNull: true
        },
        bank_account2: {
            type: Sequelize.STRING(45),
            allowNull: true
        },
        bank_name2: {
            type: Sequelize.STRING(45),
            allowNull: true,
            comment: "\t"
        },
        sheba2: {
            type: Sequelize.STRING(45),
            allowNull: true
        },
        bank_name3: {
            type: Sequelize.STRING(45),
            allowNull: true
        },
        bank_account3: {
            type: Sequelize.STRING(45),
            allowNull: true
        },
        sheba3: {
            type: Sequelize.STRING(45),
            allowNull: true
        },
        bank_name4: {
            type: Sequelize.STRING(45),
            allowNull: true
        },
        bank_account4: {
            type: Sequelize.STRING(45),
            allowNull: true
        },
        sheba4: {
            type: Sequelize.STRING(45),
            allowNull: true
        },
        bank_account5: {
            type: Sequelize.STRING(45),
            allowNull: true
        },
        bank_name5: {
            type: Sequelize.STRING(45),
            allowNull: true
        },
        sheba5: {
            type: Sequelize.STRING(45),
            allowNull: true
        },
        national_card_front_url: {
            type: Sequelize.STRING(200),
            allowNull: true
        },
        national_card_rear_url: {
            type: Sequelize.STRING(200),
            allowNull: true
        },
        birth_certificate_url: {
            type: Sequelize.STRING(200),
            allowNull: true
        },
        army_service_card_url: {
            type: Sequelize.STRING(200),
            allowNull: true
        },
        company_id_fk: {
            type: Sequelize.INTEGER,
            allowNull: true
        },
        data_approved: {
            type: Sequelize.TINYINT,
            allowNull: true
        },
        address: {
            type: Sequelize.TEXT,
            allowNull: true
        },
        sign_url: {
            type: Sequelize.STRING(200),
            allowNull: true
        },
        study_field: {
            type: Sequelize.STRING(200),
            allowNull: true
        },
        is_super_user: {
            type: Sequelize.TINYINT,
            allowNull: true
        },
        postal_code: {
            type: Sequelize.STRING(45),
            allowNull: true
        },
        contract_id_fk: {
            type: Sequelize.INTEGER,
            allowNull: true
        },
        code: {
            type: Sequelize.STRING(100),
            allowNull: true
        },
        isargar: {
            type: Sequelize.STRING(200),
            allowNull: true
        },
        shahid_name: {
            type: Sequelize.STRING(200),
            allowNull: true
        },
        veteran_percentage: {
            type: Sequelize.DECIMAL(10, 0),
            allowNull: true
        },
        frontline_year: {
            type: Sequelize.INTEGER,
            allowNull: true
        },
        frontline_month: {
            type: Sequelize.INTEGER,
            allowNull: true
        },
        frontline_day: {
            type: Sequelize.INTEGER,
            allowNull: true
        },
        shahid_was_colleague: {
            type: Sequelize.TINYINT,
            allowNull: true
        },
        captivity_year: {
            type: Sequelize.INTEGER,
            allowNull: true
        },
        captivity_month: {
            type: Sequelize.INTEGER,
            allowNull: true
        },
        captivity_day: {
            type: Sequelize.INTEGER,
            allowNull: true
        },
        history_total_day: {
            type: Sequelize.INTEGER,
            allowNull: true
        },
        insurance_share_employee: {
            type: Sequelize.TINYINT,
            allowNull: true
        },
        insurance_share_employer: {
            type: Sequelize.TINYINT,
            allowNull: true
        },
        insurance_share_unemployment: {
            type: Sequelize.TINYINT,
            allowNull: true
        },
        insurance_share_harmful: {
            type: Sequelize.TINYINT,
            allowNull: true
        },
        employeement_date: {
            type: Sequelize.DATE,
            allowNull: true
        },
        contract_start_date: {
            type: Sequelize.DATE,
            allowNull: true
        },
        contract_end_date: {
            type: Sequelize.DATE,
            allowNull: true
        },
        employeement_type: {
            type: Sequelize.STRING(45),
            allowNull: true
        },
        user_type: {
            type: Sequelize.STRING(100),
            allowNull: true
        }
    }, {
        sequelize,
        tableName: 'personnel',
        timestamps: false,
        defaultScope: {
            attributes: ['id', 'birth_date', 'national_number', 'first_name', 'last_name', 'father_name','id_number','sex','birth_place','id_issue_place','nation']
        },
        indexes: [
            {
                name: "PRIMARY",
                unique: true,
                using: "BTREE",
                fields: [
                    {name: "id"},
                ]
            },
        ]
    });
};
