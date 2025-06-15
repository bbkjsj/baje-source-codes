CREATE TABLE `bjdb`.`access` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(100) DEFAULT NULL,
  `minimum_required_access_level` varchar(45) DEFAULT NULL,
  `enable` tinyint(4) DEFAULT NULL,
  `code` int(11) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_persian_ci;

#
# Reading the access_prerequisite.frm file.
#
# CREATE statement for /var/lib/old-db/bjdb/access_prerequisite.frm:
#

CREATE TABLE `bjdb`.`access_prerequisite` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `access_id_fk` int(11) DEFAULT NULL,
  `required_access_id_fk` int(11) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_persian_ci;

#
# Reading the audit.frm file.
#
# CREATE statement for /var/lib/old-db/bjdb/audit.frm:
#

CREATE TABLE `bjdb`.`audit` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `body` text DEFAULT NULL,
  `request_type` varchar(45) DEFAULT NULL,
  `path` varchar(300) DEFAULT NULL,
  `date` datetime DEFAULT NULL,
  `user_object` text DEFAULT NULL,
  `ip_address` varchar(45) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_persian_ci;

#
# Reading the column_name.frm file.
#
# CREATE statement for /var/lib/old-db/bjdb/column_name.frm:
#

CREATE TABLE `bjdb`.`column_name` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `table_name_id_fk` int(11) DEFAULT NULL,
  `column_name` varchar(255) DEFAULT NULL,
  `title` varchar(255) DEFAULT NULL,
  `type` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_persian_ci;

#
# Reading the company.frm file.
#
# CREATE statement for /var/lib/old-db/bjdb/company.frm:
#

CREATE TABLE `bjdb`.`company` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(100) DEFAULT NULL,
  `register_number` varchar(45) DEFAULT NULL,
  `register_date` datetime DEFAULT NULL,
  `national_id` varchar(45) DEFAULT NULL,
  `finance_code` varchar(45) DEFAULT NULL,
  `manager_id_fk` int(11) DEFAULT NULL,
  `logo_url` varchar(300) DEFAULT NULL,
  `sign_owners` varchar(300) DEFAULT NULL,
  `sign_url` varchar(300) DEFAULT NULL,
  `seal_url` varchar(300) DEFAULT NULL,
  `phone` varchar(45) DEFAULT NULL,
  `address` text DEFAULT NULL,
  `postal_code` varchar(45) DEFAULT NULL,
  `email` varchar(100) DEFAULT NULL,
  `description` text DEFAULT NULL,
  `approved` tinyint(4) DEFAULT NULL,
  `approve_date` datetime DEFAULT NULL,
  `approve_user_id` int(11) DEFAULT NULL,
  `deleted` tinyint(4) DEFAULT NULL,
  `is_group` tinyint(4) DEFAULT NULL,
  `type` varchar(45) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_persian_ci;

#
# Reading the company_board_member.frm file.
#
# CREATE statement for /var/lib/old-db/bjdb/company_board_member.frm:
#

CREATE TABLE `bjdb`.`company_board_member` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `company_id_fk` int(11) DEFAULT NULL,
  `personnel_id_fk` int(11) DEFAULT NULL,
  `role` varchar(45) DEFAULT NULL,
  `signature_rights` varchar(200) DEFAULT NULL,
  `from_date` datetime DEFAULT NULL,
  `to_date` datetime DEFAULT NULL,
  `description` text DEFAULT NULL,
  `enabled` tinyint(4) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_persian_ci;

#
# Reading the contract.frm file.
#
# CREATE statement for /var/lib/old-db/bjdb/contract.frm:
#

CREATE TABLE `bjdb`.`contract` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `type` varchar(45) DEFAULT NULL,
  `number` varchar(45) DEFAULT NULL,
  `date` datetime DEFAULT NULL,
  `employer` varchar(200) DEFAULT NULL,
  `contractor` varchar(200) DEFAULT NULL,
  `subject` varchar(200) DEFAULT NULL,
  `start_date` datetime DEFAULT NULL,
  `end_date` datetime DEFAULT NULL,
  `initial_amount` double DEFAULT NULL,
  `workshop_code` varchar(10) DEFAULT NULL,
  `row` varchar(10) DEFAULT NULL,
  `supervision` varchar(100) DEFAULT NULL,
  `manager_id` int(11) DEFAULT NULL,
  `code` varchar(45) DEFAULT NULL,
  `employer_id` int(11) DEFAULT NULL,
  `boss_id` varchar(45) DEFAULT NULL,
  `contractor_type` varchar(45) DEFAULT NULL,
  `contractor_id` int(11) DEFAULT NULL,
  `deleted` tinyint(4) DEFAULT NULL,
  `main_contract_id_fk` int(11) DEFAULT NULL,
  `can_delete` tinyint(4) DEFAULT NULL,
  `activity` varchar(200) DEFAULT NULL,
  `consultant_company_id_fk` int(11) DEFAULT NULL,
  `edit_by_admin` tinyint(4) DEFAULT NULL,
  `contract_type` varchar(45) DEFAULT NULL,
  `environment_id_fk` int(11) DEFAULT NULL,
  `price_list_year` decimal(8,0) DEFAULT NULL,
  `adjustment_base_index` int(11) DEFAULT NULL,
  `checkout_on` datetime DEFAULT NULL,
  `warranty_released_on` datetime DEFAULT NULL,
  `account_settled_on` datetime DEFAULT NULL,
  `definitive_delivery_on` datetime DEFAULT NULL,
  `definitive_adjustment_on` datetime DEFAULT NULL,
  `definitive_statement_on` datetime DEFAULT NULL,
  `temporary_delivered_on` datetime DEFAULT NULL,
  `defects_fixed_on` datetime DEFAULT NULL,
  `rial_weight` decimal(20,0) DEFAULT NULL,
  `time_weight` decimal(10,0) DEFAULT NULL,
  `pricelist_parts` varchar(300) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_persian_ci;

#
# Reading the contract_peyman_report.frm file.
#
# CREATE statement for /var/lib/old-db/bjdb/contract_peyman_report.frm:
#

CREATE TABLE `bjdb`.`contract_peyman_report` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `contract_id_fk` int(11) DEFAULT NULL,
  `edit_by_admin` tinyint(4) DEFAULT NULL,
  `date` datetime DEFAULT NULL,
  `status` varchar(200) DEFAULT NULL,
  `disabled_car_no_tier_quantity` int(11) DEFAULT NULL,
  `disabled_car_no_part_quantity` int(11) DEFAULT NULL,
  `active_car_quantity` int(11) DEFAULT NULL,
  `ready_to_work_factor` decimal(10,0) DEFAULT NULL,
  `description` text DEFAULT NULL,
  `ready_to_work_car_quantity` int(11) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_persian_ci;

#
# Reading the contract_production_report.frm file.
#
# CREATE statement for /var/lib/old-db/bjdb/contract_production_report.frm:
#

CREATE TABLE `bjdb`.`contract_production_report` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `stone_tonnage` decimal(10,0) DEFAULT NULL,
  `dust_tonnage` decimal(10,0) DEFAULT NULL,
  `stone_load_quantity` decimal(10,0) DEFAULT NULL,
  `dust_load_quantity` decimal(10,0) DEFAULT NULL,
  `contract_id_fk` varchar(45) DEFAULT NULL,
  `edit_by_admin` tinyint(4) DEFAULT NULL,
  `status` varchar(200) DEFAULT NULL,
  `date` datetime DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_persian_ci;

#
# Reading the contract_progress.frm file.
#
# CREATE statement for /var/lib/old-db/bjdb/contract_progress.frm:
#

CREATE TABLE `bjdb`.`contract_progress` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `contract_id_fk` int(11) DEFAULT NULL,
  `date` datetime DEFAULT NULL,
  `real_progress` decimal(10,2) DEFAULT NULL,
  `program_progress` decimal(10,2) DEFAULT NULL,
  `status` varchar(100) DEFAULT NULL,
  `edit_by_admin` tinyint(4) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_persian_ci;

#
# Reading the damage_service.frm file.
#
# CREATE statement for /var/lib/old-db/bjdb/damage_service.frm:
#

CREATE TABLE `bjdb`.`damage_service` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `personnel_id_fk` int(11) NOT NULL,
  `type` varchar(45) DEFAULT NULL,
  `date` datetime DEFAULT NULL,
  `description` text DEFAULT NULL,
  `type_service_damage` varchar(300) DEFAULT NULL,
  `type_reward_penalty` varchar(300) DEFAULT NULL,
  `amount_reward_penalty` varchar(500) DEFAULT NULL,
  `hr_approved` tinyint(4) DEFAULT NULL,
  `project_admin_approved` tinyint(4) DEFAULT NULL,
  `hr_admin_approved` tinyint(4) DEFAULT NULL,
  `manager_approved` tinyint(4) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_persian_ci;

#
# Reading the doctor_visit.frm file.
#
# CREATE statement for /var/lib/old-db/bjdb/doctor_visit.frm:
#

CREATE TABLE `bjdb`.`doctor_visit` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `visit_date` datetime DEFAULT NULL,
  `doctor_id_fk` int(11) DEFAULT NULL,
  `result` varchar(300) DEFAULT NULL,
  `approved_position_code` varchar(45) DEFAULT NULL,
  `next_visit_date` datetime DEFAULT NULL,
  `special_description` text DEFAULT NULL,
  `personnel_id_fk` int(11) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_persian_ci;

#
# Reading the environment.frm file.
#
# CREATE statement for /var/lib/old-db/bjdb/environment.frm:
#

CREATE TABLE `bjdb`.`environment` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `title` varchar(300) DEFAULT NULL,
  `company_id_fk` int(11) DEFAULT NULL,
  `parent_id_fk` int(11) DEFAULT NULL,
  `type` varchar(100) DEFAULT NULL,
  `code` varchar(100) DEFAULT NULL,
  `environment_usage_id` int(11) DEFAULT NULL,
  `latitude` double DEFAULT NULL,
  `longitude` double DEFAULT NULL,
  `address` text DEFAULT NULL,
  `post_code` varchar(45) DEFAULT NULL,
  `occupied_status` varchar(45) DEFAULT NULL,
  `independent_chart` tinyint(4) DEFAULT NULL,
  `independent_vehicle` tinyint(4) DEFAULT NULL,
  `status` varchar(45) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_persian_ci;

#
# Reading the environment_usage.frm file.
#
# CREATE statement for /var/lib/old-db/bjdb/environment_usage.frm:
#

CREATE TABLE `bjdb`.`environment_usage` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `title` varchar(300) DEFAULT NULL,
  `description` text DEFAULT NULL,
  `job_id_fk` int(11) DEFAULT NULL,
  `is_enable` tinyint(4) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_persian_ci;

#
# Reading the family.frm file.
#
# CREATE statement for /var/lib/old-db/bjdb/family.frm:
#

CREATE TABLE `bjdb`.`family` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `personnel_id_fk` int(11) DEFAULT NULL,
  `relative_id_fk` int(11) DEFAULT NULL,
  `relation` varchar(45) DEFAULT NULL,
  `reverse_relation` varchar(45) DEFAULT NULL,
  `dependency_status` varchar(45) DEFAULT NULL,
  `dependency_quit_reason` text DEFAULT NULL,
  `dependency_quit_date` datetime DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_persian_ci;

#
# Reading the family_tree.frm file.
#
# CREATE statement for /var/lib/old-db/bjdb/family_tree.frm:
#

CREATE TABLE `bjdb`.`family_tree` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `personnel_id_fk` int(11) DEFAULT NULL,
  `parent_id_fk` int(11) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_persian_ci;

#
# Reading the hr_yearly_variable.frm file.
#
# CREATE statement for /var/lib/old-db/bjdb/hr_yearly_variable.frm:
#

CREATE TABLE `bjdb`.`hr_yearly_variable` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `year` decimal(10,0) DEFAULT NULL,
  `min_daily_salary` decimal(10,0) DEFAULT NULL,
  `max_daily_salary` decimal(10,0) DEFAULT NULL,
  `bonus` decimal(10,0) DEFAULT NULL,
  `housing` decimal(10,0) DEFAULT NULL,
  `description` text DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_persian_ci;

#
# Reading the hse_allocate_question.frm file.
#
# CREATE statement for /var/lib/old-db/bjdb/hse_allocate_question.frm:
#

CREATE TABLE `bjdb`.`hse_allocate_question` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `question_id_fk` int(11) DEFAULT NULL,
  `personnel_id_fk` int(11) DEFAULT NULL,
  `vehicle_id_fk` int(11) DEFAULT NULL,
  `environment_id_fk` int(11) DEFAULT NULL,
  `from_date` datetime DEFAULT NULL,
  `to_date` datetime DEFAULT NULL,
  `weight_factor` int(11) DEFAULT NULL,
  `critical` varchar(45) DEFAULT NULL,
  `requirements` text DEFAULT NULL,
  `description` text DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_persian_ci;

#
# Reading the hse_audit.frm file.
#
# CREATE statement for /var/lib/old-db/bjdb/hse_audit.frm:
#

CREATE TABLE `bjdb`.`hse_audit` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `personnel_id_fk` int(11) DEFAULT NULL,
  `vehicle_id_fk` int(11) DEFAULT NULL,
  `environment_id_fk` int(11) DEFAULT NULL,
  `troubleshooter_id_fk` int(11) DEFAULT NULL,
  `audit_date` datetime DEFAULT NULL,
  `description` text DEFAULT NULL,
  `operator_id_fk` int(11) DEFAULT NULL,
  `date` datetime DEFAULT NULL,
  `draft` tinyint(4) DEFAULT NULL,
  `minimum_point` int(11) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_persian_ci;

#
# Reading the hse_audit_question.frm file.
#
# CREATE statement for /var/lib/old-db/bjdb/hse_audit_question.frm:
#

CREATE TABLE `bjdb`.`hse_audit_question` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `audit_id_fk` int(11) DEFAULT NULL,
  `question` text DEFAULT NULL,
  `answer` text DEFAULT NULL,
  `critical` varchar(100) DEFAULT NULL,
  `weight_factor` int(11) DEFAULT NULL,
  `requirements` text DEFAULT NULL,
  `description` text DEFAULT NULL,
  `group` varchar(100) DEFAULT NULL,
  `type` varchar(100) DEFAULT NULL,
  `code` varchar(45) DEFAULT NULL,
  `question_id_fk` int(11) DEFAULT NULL,
  `is_not_related` tinyint(4) DEFAULT NULL,
  `operator_description` text DEFAULT NULL,
  `is_reverse` tinyint(4) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_persian_ci;

#
# Reading the hse_checklist.frm file.
#
# CREATE statement for /var/lib/old-db/bjdb/hse_checklist.frm:
#

CREATE TABLE `bjdb`.`hse_checklist` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `group` varchar(100) DEFAULT NULL,
  `environment_id_fk` int(11) DEFAULT NULL,
  `jobs_id_fk` int(11) DEFAULT NULL,
  `vehicle_type_id_fk` int(11) DEFAULT NULL,
  `comment` text DEFAULT NULL,
  `enable` tinyint(4) DEFAULT NULL,
  `code` int(11) DEFAULT NULL,
  `type` varchar(45) DEFAULT NULL,
  `minimum_point` int(11) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_persian_ci;

#
# Reading the hse_checklist_question.frm file.
#
# CREATE statement for /var/lib/old-db/bjdb/hse_checklist_question.frm:
#

CREATE TABLE `bjdb`.`hse_checklist_question` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `checklist_id_fk` int(11) DEFAULT NULL,
  `question_id_fk` int(11) DEFAULT NULL,
  `weight_factor` int(11) DEFAULT NULL,
  `critical` varchar(100) DEFAULT NULL,
  `requirements` text DEFAULT NULL,
  `description` text DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_persian_ci;

#
# Reading the hse_question.frm file.
#
# CREATE statement for /var/lib/old-db/bjdb/hse_question.frm:
#

CREATE TABLE `bjdb`.`hse_question` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `group` varchar(100) DEFAULT NULL,
  `question` text DEFAULT NULL,
  `type` varchar(100) DEFAULT NULL,
  `code` varchar(45) DEFAULT NULL,
  `is_reverse` tinyint(4) DEFAULT NULL,
  `vehicle_type_id_fk` int(11) DEFAULT NULL,
  `jobs_id_fk` int(11) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_persian_ci;

#
# Reading the imprest.frm file.
#
# CREATE statement for /var/lib/old-db/bjdb/imprest.frm:
#

CREATE TABLE `bjdb`.`imprest` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `personnel_id_fk` int(11) DEFAULT NULL,
  `amount` decimal(10,0) DEFAULT NULL,
  `number_of_installment` decimal(10,0) DEFAULT NULL,
  `description` text DEFAULT NULL,
  `date` datetime DEFAULT NULL,
  `project_manager_status` varchar(100) DEFAULT NULL,
  `accountant_status` varchar(100) DEFAULT NULL,
  `company_id_fk` int(11) DEFAULT NULL,
  `paid_amount` decimal(10,0) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_persian_ci;

#
# Reading the incident.frm file.
#
# CREATE statement for /var/lib/old-db/bjdb/incident.frm:
#

CREATE TABLE `bjdb`.`incident` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `type` text DEFAULT NULL,
  `date` datetime DEFAULT NULL,
  `contract_id_fk` int(11) DEFAULT NULL,
  `address` text DEFAULT NULL,
  `reason` text DEFAULT NULL,
  `description` text DEFAULT NULL,
  `medicine` text DEFAULT NULL,
  `approved` tinyint(4) DEFAULT NULL,
  `accident_reason` text DEFAULT NULL,
  `reason_other` text DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_persian_ci;

#
# Reading the incident_personnel.frm file.
#
# CREATE statement for /var/lib/old-db/bjdb/incident_personnel.frm:
#

CREATE TABLE `bjdb`.`incident_personnel` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `personnel_id_fk` int(11) DEFAULT NULL,
  `injury` text DEFAULT NULL,
  `injury_type` text DEFAULT NULL,
  `relation` varchar(200) DEFAULT NULL,
  `incident_id_fk` int(11) DEFAULT NULL,
  `injury_other` text DEFAULT NULL,
  `injury_type_other` text DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_persian_ci;

#
# Reading the incident_vehicle.frm file.
#
# CREATE statement for /var/lib/old-db/bjdb/incident_vehicle.frm:
#

CREATE TABLE `bjdb`.`incident_vehicle` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `vehicle_id_fk` int(11) DEFAULT NULL,
  `incident_id_fk` int(11) DEFAULT NULL,
  `damage` text DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_persian_ci;

#
# Reading the insurance.frm file.
#
# CREATE statement for /var/lib/old-db/bjdb/insurance.frm:
#

CREATE TABLE `bjdb`.`insurance` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `type` varchar(200) DEFAULT NULL,
  `insurer_main` varchar(300) DEFAULT NULL,
  `insurer_company` varchar(300) DEFAULT NULL,
  `contract_number` varchar(45) DEFAULT NULL,
  `contract_issue_date` datetime DEFAULT NULL,
  `contract_date_from_date` datetime DEFAULT NULL,
  `to_date` datetime DEFAULT NULL,
  `main_insured` decimal(10,0) DEFAULT NULL,
  `spouse_insured` decimal(10,0) DEFAULT NULL,
  `doughter_insured` decimal(10,0) DEFAULT NULL,
  `son_insured` decimal(10,0) DEFAULT NULL,
  `father_insured` decimal(10,0) DEFAULT NULL,
  `mother_insured` decimal(10,0) DEFAULT NULL,
  `description` text DEFAULT NULL,
  `personnel_id_fk` int(11) DEFAULT NULL,
  `company_id_fk` int(11) DEFAULT NULL,
  `approved` tinyint(4) DEFAULT NULL,
  `pdf_file_url` varchar(300) DEFAULT NULL,
  `insurer_main_company_id_fk` int(11) DEFAULT NULL,
  `change_deadline_date` datetime DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_persian_ci;

#
# Reading the insurance_history_claim.frm file.
#
# CREATE statement for /var/lib/old-db/bjdb/insurance_history_claim.frm:
#

CREATE TABLE `bjdb`.`insurance_history_claim` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `personnel_id_fk` int(11) DEFAULT NULL,
  `workshop_code` varchar(45) DEFAULT NULL,
  `row` varchar(45) DEFAULT NULL,
  `year` decimal(10,0) DEFAULT NULL,
  `month` decimal(10,0) DEFAULT NULL,
  `number_of_days` decimal(10,0) DEFAULT NULL,
  `salary_bonus` decimal(10,0) DEFAULT NULL,
  `status` varchar(200) DEFAULT NULL,
  `register_number` varchar(200) DEFAULT NULL,
  `register_date` datetime DEFAULT NULL,
  `debt` decimal(10,0) DEFAULT NULL,
  `contract_id_fk` int(11) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_persian_ci;

#
# Reading the insurance_introletter.frm file.
#
# CREATE statement for /var/lib/old-db/bjdb/insurance_introletter.frm:
#

CREATE TABLE `bjdb`.`insurance_introletter` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `company_id_fk` int(11) DEFAULT NULL,
  `personnel_id_fk` int(11) DEFAULT NULL,
  `subordinates` varchar(300) DEFAULT NULL,
  `date` datetime DEFAULT NULL,
  `type` varchar(45) DEFAULT NULL,
  `insurance_id_fk` int(11) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_persian_ci;

#
# Reading the insurance_payment.frm file.
#
# CREATE statement for /var/lib/old-db/bjdb/insurance_payment.frm:
#

CREATE TABLE `bjdb`.`insurance_payment` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `paid_for` varchar(300) DEFAULT NULL,
  `insurance_tamin_id_fk` int(11) DEFAULT NULL,
  `installment_number` varchar(45) DEFAULT NULL,
  `periodic_debt_start_date` datetime DEFAULT NULL,
  `periodic_debt_end_date` datetime DEFAULT NULL,
  `estimated_debt` decimal(10,0) DEFAULT NULL,
  `peiman_insured_share` decimal(10,0) DEFAULT NULL,
  `insured_share` decimal(10,0) DEFAULT NULL,
  `jobless_share` decimal(10,0) DEFAULT NULL,
  `penalty_share` decimal(10,0) DEFAULT NULL,
  `execution_share` decimal(10,0) DEFAULT NULL,
  `pay_date` datetime DEFAULT NULL,
  `file_url` varchar(400) DEFAULT NULL,
  `status` varchar(300) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_persian_ci;

#
# Reading the insurance_takmili_personnel.frm file.
#
# CREATE statement for /var/lib/old-db/bjdb/insurance_takmili_personnel.frm:
#

CREATE TABLE `bjdb`.`insurance_takmili_personnel` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `personnel_id_fk` int(11) DEFAULT NULL,
  `start_date` datetime DEFAULT NULL,
  `end_date` datetime DEFAULT NULL,
  `description` text DEFAULT NULL,
  `insurance_id_fk` int(11) DEFAULT NULL,
  `main_insurer_personnel_id_fk` int(11) DEFAULT NULL,
  `is_approved` tinyint(4) DEFAULT NULL,
  `is_deleted` tinyint(4) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_persian_ci;

#
# Reading the insurance_takmili_subordinate.frm file.
#
# CREATE statement for /var/lib/old-db/bjdb/insurance_takmili_subordinate.frm:
#

CREATE TABLE `bjdb`.`insurance_takmili_subordinate` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `start_date` datetime DEFAULT NULL,
  `end_date` datetime DEFAULT NULL,
  `subordinate_id_fk` int(11) DEFAULT NULL,
  `description` text DEFAULT NULL,
  `status` varchar(200) DEFAULT NULL,
  `insurance_id_fk` int(11) DEFAULT NULL,
  `insurance_takmili_subordinate_id_fk` int(11) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_persian_ci;

#
# Reading the insurance_takmili_subordinate_upload.frm file.
#
# CREATE statement for /var/lib/old-db/bjdb/insurance_takmili_subordinate_upload.frm:
#

CREATE TABLE `bjdb`.`insurance_takmili_subordinate_upload` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT,
  `path` varchar(1000) DEFAULT NULL,
  `description` varchar(1000) DEFAULT NULL,
  `subordinate_id_fk` bigint(20) NOT NULL,
  `is_approved` tinyint(1) NOT NULL DEFAULT 0,
  `is_deleted` tinyint(1) NOT NULL DEFAULT 0,
  `created_date` datetime NOT NULL DEFAULT current_timestamp(),
  `modify_date` datetime NOT NULL DEFAULT '0000-00-00 00:00:00' ON UPDATE current_timestamp(),
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_persian_ci;

#
# Reading the insurance_tamin.frm file.
#
# CREATE statement for /var/lib/old-db/bjdb/insurance_tamin.frm:
#

CREATE TABLE `bjdb`.`insurance_tamin` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `contract_id_fk` int(11) DEFAULT NULL,
  `year` decimal(10,0) DEFAULT NULL,
  `month` decimal(10,0) DEFAULT NULL,
  `list_number` varchar(100) DEFAULT NULL,
  `description` text DEFAULT NULL,
  `status` varchar(100) DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `contract_id_fk` (`contract_id_fk`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_persian_ci;

#
# Reading the insurance_tamin_disk.frm file.
#
# CREATE statement for /var/lib/old-db/bjdb/insurance_tamin_disk.frm:
#

CREATE TABLE `bjdb`.`insurance_tamin_disk` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `tamin_id_fk` int(11) DEFAULT NULL,
  `total_benefit_include` decimal(10,0) DEFAULT NULL,
  `total_insured` decimal(10,0) DEFAULT NULL,
  `total_employer` decimal(10,0) DEFAULT NULL,
  `total_jobless` decimal(10,0) DEFAULT NULL,
  `code` varchar(100) DEFAULT NULL,
  `date` datetime DEFAULT NULL,
  `personnel_id_fk` int(11) DEFAULT NULL,
  `personnel_count` decimal(10,0) DEFAULT NULL,
  `workshop_code` varchar(100) DEFAULT NULL,
  `row` varchar(100) DEFAULT NULL,
  `month` varchar(45) DEFAULT NULL,
  `year` varchar(45) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_persian_ci;

#
# Reading the insurance_tamin_personnel.frm file.
#
# CREATE statement for /var/lib/old-db/bjdb/insurance_tamin_personnel.frm:
#

CREATE TABLE `bjdb`.`insurance_tamin_personnel` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `insurance_tamin_id_fk` int(11) DEFAULT NULL,
  `personnel_id_fk` int(11) DEFAULT NULL,
  `start_date` datetime DEFAULT NULL,
  `end_date` datetime DEFAULT NULL,
  `total_work_day` decimal(10,0) DEFAULT NULL,
  `daily_salary` decimal(10,0) DEFAULT NULL,
  `monthly_salary` decimal(10,0) DEFAULT NULL,
  `include_benefit` decimal(10,0) DEFAULT NULL,
  `salary_benefit_include` decimal(10,0) DEFAULT NULL,
  `salary_benefit_include_notinclude` decimal(10,0) DEFAULT NULL,
  `insured_share` decimal(10,0) DEFAULT NULL,
  `employer_share` decimal(10,0) DEFAULT NULL,
  `jobless_share` decimal(10,0) DEFAULT NULL,
  `hard_job_share` decimal(10,0) DEFAULT NULL,
  `total_share` decimal(10,0) DEFAULT NULL,
  `job_id_fk` int(11) DEFAULT NULL,
  `description` text DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_persian_ci;

#
# Reading the insurance_third_party.frm file.
#
# CREATE statement for /var/lib/old-db/bjdb/insurance_third_party.frm:
#

CREATE TABLE `bjdb`.`insurance_third_party` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `machine_organization_code` varchar(45) DEFAULT NULL,
  `insurance_identification` varchar(45) DEFAULT NULL,
  `insurance_number` varchar(45) DEFAULT NULL,
  `vehicle_id_fk` int(11) DEFAULT NULL,
  `insurer_personnel_id_fk` int(11) DEFAULT NULL,
  `insurer_company_id_fk` int(11) DEFAULT NULL,
  `from_date` datetime DEFAULT NULL,
  `to_date` datetime DEFAULT NULL,
  `no_damage_history` decimal(30,0) DEFAULT NULL,
  `insurance` decimal(30,0) DEFAULT NULL,
  `max_commitment_financial_damages` decimal(30,0) DEFAULT NULL,
  `max_commitment_injury` decimal(30,0) DEFAULT NULL,
  `max_commitment_driver` decimal(30,0) DEFAULT NULL,
  `deliver_to_personnel_id_fk` int(11) DEFAULT NULL,
  `file` varchar(400) DEFAULT NULL,
  `description` text DEFAULT NULL,
  `insurance_company_id_fk` int(11) DEFAULT NULL,
  `status` varchar(45) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_persian_ci;

#
# Reading the job_permission.frm file.
#
# CREATE statement for /var/lib/old-db/bjdb/job_permission.frm:
#

CREATE TABLE `bjdb`.`job_permission` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `job_id_fk` int(11) DEFAULT NULL,
  `permission` varchar(100) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_persian_ci;

#
# Reading the job_title.frm file.
#
# CREATE statement for /var/lib/old-db/bjdb/job_title.frm:
#

CREATE TABLE `bjdb`.`job_title` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `title` varchar(100) DEFAULT NULL,
  `code` varchar(45) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_persian_ci;

#
# Reading the jobs.frm file.
#
# CREATE statement for /var/lib/old-db/bjdb/jobs.frm:
#

CREATE TABLE `bjdb`.`jobs` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `title` varchar(200) DEFAULT NULL,
  `status` varchar(45) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_persian_ci;

#
# Reading the jobs_chart.frm file.
#
# CREATE statement for /var/lib/old-db/bjdb/jobs_chart.frm:
#

CREATE TABLE `bjdb`.`jobs_chart` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `title` varchar(200) DEFAULT NULL,
  `contract_id_fk` int(11) DEFAULT NULL,
  `apply_date` datetime DEFAULT NULL,
  `enable` tinyint(4) DEFAULT NULL,
  `description` text DEFAULT NULL,
  `company_id_fk` int(11) DEFAULT NULL,
  `environment_id_fk` int(11) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_persian_ci;

#
# Reading the jobs_chart_node.frm file.
#
# CREATE statement for /var/lib/old-db/bjdb/jobs_chart_node.frm:
#

CREATE TABLE `bjdb`.`jobs_chart_node` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `chart_id_fk` int(11) DEFAULT NULL,
  `count` int(11) DEFAULT NULL,
  `jobs_tamin_code_id_fk` int(11) DEFAULT NULL,
  `title` varchar(200) DEFAULT NULL,
  `parent_id_fk` int(11) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_persian_ci;

#
# Reading the jobs_permission.frm file.
#
# CREATE statement for /var/lib/old-db/bjdb/jobs_permission.frm:
#

CREATE TABLE `bjdb`.`jobs_permission` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `jobs_id_fk` int(11) DEFAULT NULL,
  `permission` varchar(200) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_persian_ci;

#
# Reading the jobs_shift.frm file.
#
# CREATE statement for /var/lib/old-db/bjdb/jobs_shift.frm:
#

CREATE TABLE `bjdb`.`jobs_shift` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `title` varchar(255) DEFAULT NULL,
  `time_off_days` int(11) DEFAULT NULL,
  `enabled` tinyint(4) DEFAULT NULL,
  `timespan` varchar(40) DEFAULT NULL,
  `calculate_public_holidays` tinyint(4) DEFAULT NULL,
  `calculate_extra_work` tinyint(4) DEFAULT NULL,
  `calculate_off_work` tinyint(4) DEFAULT NULL,
  `public_holidays_are_off` tinyint(4) DEFAULT NULL,
  `calculate_night` tinyint(4) DEFAULT NULL,
  `calculate_friday` tinyint(4) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_persian_ci;

#
# Reading the jobs_shift_pattern.frm file.
#
# CREATE statement for /var/lib/old-db/bjdb/jobs_shift_pattern.frm:
#

CREATE TABLE `bjdb`.`jobs_shift_pattern` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `shift_id_fk` int(11) DEFAULT NULL,
  `status` varchar(200) DEFAULT NULL,
  `days` int(11) DEFAULT NULL,
  `from_time` datetime DEFAULT NULL,
  `to_time` datetime DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_persian_ci;

#
# Reading the jobs_tamin_code.frm file.
#
# CREATE statement for /var/lib/old-db/bjdb/jobs_tamin_code.frm:
#

CREATE TABLE `bjdb`.`jobs_tamin_code` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `jobs_id_fk` int(11) DEFAULT NULL,
  `code` varchar(45) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_persian_ci;

#
# Reading the personnel.frm file.
#
# CREATE statement for /var/lib/old-db/bjdb/personnel.frm:
#

CREATE TABLE `bjdb`.`personnel` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `birth_date` varchar(45) DEFAULT NULL,
  `national_number` varchar(10) DEFAULT NULL,
  `first_name` varchar(100) DEFAULT NULL,
  `last_name` varchar(100) DEFAULT NULL,
  `father_name` varchar(100) DEFAULT NULL,
  `id_number` varchar(45) DEFAULT NULL,
  `sex` varchar(1) DEFAULT NULL,
  `birth_place` varchar(100) DEFAULT NULL,
  `id_issue_place` varchar(100) DEFAULT NULL,
  `nation` varchar(100) DEFAULT NULL,
  `public_description` text DEFAULT NULL,
  `private_description` text DEFAULT NULL,
  `password` varchar(200) DEFAULT NULL,
  `image_url` varchar(300) DEFAULT NULL,
  `marital_status` varchar(45) DEFAULT NULL,
  `army_service` varchar(45) DEFAULT NULL,
  `education` varchar(100) DEFAULT NULL,
  `job_title` varchar(200) DEFAULT NULL,
  `insurance_number` varchar(100) DEFAULT NULL,
  `personnel_id` varchar(45) DEFAULT NULL,
  `job_type` varchar(45) DEFAULT NULL,
  `job_status` varchar(45) DEFAULT NULL,
  `job_disable_date` datetime DEFAULT NULL,
  `job_disable_description` text DEFAULT NULL,
  `mobile1` varchar(11) DEFAULT NULL,
  `mobile2` varchar(11) DEFAULT NULL,
  `phone` varchar(100) DEFAULT NULL,
  `email` varchar(200) DEFAULT NULL,
  `bank_account1` varchar(45) DEFAULT NULL,
  `sheba1` varchar(45) DEFAULT NULL,
  `bank_name1` varchar(45) DEFAULT NULL,
  `bank_account2` varchar(45) DEFAULT NULL,
  `bank_name2` varchar(45) DEFAULT NULL COMMENT '	',
  `sheba2` varchar(45) DEFAULT NULL,
  `bank_name3` varchar(45) DEFAULT NULL,
  `bank_account3` varchar(45) DEFAULT NULL,
  `sheba3` varchar(45) DEFAULT NULL,
  `bank_name4` varchar(45) DEFAULT NULL,
  `bank_account4` varchar(45) DEFAULT NULL,
  `sheba4` varchar(45) DEFAULT NULL,
  `bank_account5` varchar(45) DEFAULT NULL,
  `bank_name5` varchar(45) DEFAULT NULL,
  `sheba5` varchar(45) DEFAULT NULL,
  `national_card_front_url` varchar(200) DEFAULT NULL,
  `national_card_rear_url` varchar(200) DEFAULT NULL,
  `birth_certificate_url` varchar(200) DEFAULT NULL,
  `army_service_card_url` varchar(200) DEFAULT NULL,
  `company_id_fk` int(11) DEFAULT NULL,
  `data_approved` tinyint(4) DEFAULT NULL,
  `address` text DEFAULT NULL,
  `sign_url` varchar(200) DEFAULT NULL,
  `study_field` varchar(200) DEFAULT NULL,
  `is_super_user` tinyint(4) DEFAULT NULL,
  `postal_code` varchar(45) DEFAULT NULL,
  `contract_id_fk` int(11) DEFAULT NULL,
  `code` varchar(100) DEFAULT NULL,
  `isargar` varchar(200) DEFAULT NULL,
  `shahid_name` varchar(200) DEFAULT NULL,
  `veteran_percentage` decimal(10,0) DEFAULT NULL,
  `frontline_year` int(11) DEFAULT NULL,
  `frontline_month` int(11) DEFAULT NULL,
  `frontline_day` int(11) DEFAULT NULL,
  `shahid_was_colleague` tinyint(4) DEFAULT NULL,
  `captivity_year` int(11) DEFAULT NULL,
  `captivity_month` int(11) DEFAULT NULL,
  `captivity_day` int(11) DEFAULT NULL,
  `history_total_day` int(11) DEFAULT NULL,
  `insurance_share_employee` tinyint(4) DEFAULT NULL,
  `insurance_share_employer` tinyint(4) DEFAULT NULL,
  `insurance_share_unemployment` tinyint(4) DEFAULT NULL,
  `insurance_share_harmful` tinyint(4) DEFAULT NULL,
  `employeement_date` datetime DEFAULT NULL,
  `contract_start_date` datetime DEFAULT NULL,
  `contract_end_date` datetime DEFAULT NULL,
  `employeement_type` varchar(45) DEFAULT NULL,
  `user_type` varchar(100) DEFAULT NULL,
  `latest_educational_document_url` varchar(300) DEFAULT NULL,
  `default_company_id_fk` int(11) DEFAULT NULL,
  `default_home_page` varchar(300) DEFAULT NULL,
  `status` varchar(45) DEFAULT NULL,
  `updated_on` datetime DEFAULT NULL,
  `sync_by` varchar(300) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_persian_ci;

#
# Reading the personnel_access.frm file.
#
# CREATE statement for /var/lib/old-db/bjdb/personnel_access.frm:
#

CREATE TABLE `bjdb`.`personnel_access` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `personnel_id_fk` int(11) DEFAULT NULL,
  `access_id_fk` int(11) DEFAULT NULL,
  `assigned_by_id_fk` int(11) DEFAULT NULL,
  `start_date` datetime DEFAULT NULL,
  `end_date` datetime DEFAULT NULL,
  `access_level` varchar(100) DEFAULT NULL,
  `company_id_fk` int(11) DEFAULT NULL,
  `environment_id_fk` int(11) DEFAULT NULL,
  `access` varchar(45) DEFAULT NULL,
  `contract_id_fk` int(11) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_persian_ci;

#
# Reading the personnel_family.frm file.
#
# CREATE statement for /var/lib/old-db/bjdb/personnel_family.frm:
#

CREATE TABLE `bjdb`.`personnel_family` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `personnel_id_fk` int(11) DEFAULT NULL,
  `parent_id_fk` int(11) DEFAULT NULL,
  `relation` varchar(100) DEFAULT NULL,
  `dependency_status` varchar(45) DEFAULT NULL,
  `dependency_quit_reason` text DEFAULT NULL,
  `dependency_quit_date` datetime DEFAULT NULL,
  `spouse_id_fk` int(11) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_persian_ci;

#
# Reading the personnel_insurance_deduction.frm file.
#
# CREATE statement for /var/lib/old-db/bjdb/personnel_insurance_deduction.frm:
#

CREATE TABLE `bjdb`.`personnel_insurance_deduction` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `payment_method` varchar(100) DEFAULT NULL,
  `year` decimal(10,0) DEFAULT NULL,
  `month` decimal(10,0) DEFAULT NULL,
  `document_number` varchar(200) DEFAULT NULL,
  `document_date` datetime DEFAULT NULL,
  `payment_date` datetime DEFAULT NULL,
  `description` text DEFAULT NULL,
  `amount` decimal(10,0) DEFAULT NULL,
  `personnel_id_fk` int(11) DEFAULT NULL,
  `insurance_id_fk` int(11) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_persian_ci;

#
# Reading the personnel_insurance_rate.frm file.
#
# CREATE statement for /var/lib/old-db/bjdb/personnel_insurance_rate.frm:
#

CREATE TABLE `bjdb`.`personnel_insurance_rate` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `personnel_id_fk` int(11) DEFAULT NULL,
  `insured_rate` decimal(10,0) DEFAULT NULL,
  `employer_rate` decimal(10,0) DEFAULT NULL,
  `jobless_rate` decimal(10,0) DEFAULT NULL,
  `hard_job_rate` decimal(10,0) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_persian_ci;

#
# Reading the personnel_job.frm file.
#
# CREATE statement for /var/lib/old-db/bjdb/personnel_job.frm:
#

CREATE TABLE `bjdb`.`personnel_job` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `personnel_id_fk` int(11) DEFAULT NULL,
  `jobs_id_fk` int(11) DEFAULT NULL,
  `from_date` datetime DEFAULT NULL,
  `to_date` datetime DEFAULT NULL,
  `chart_id_fk` int(11) DEFAULT NULL,
  `approved` tinyint(4) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_persian_ci;

#
# Reading the personnel_mission.frm file.
#
# CREATE statement for /var/lib/old-db/bjdb/personnel_mission.frm:
#

CREATE TABLE `bjdb`.`personnel_mission` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `personnel_id_fk` int(11) DEFAULT NULL,
  `type` varchar(200) DEFAULT NULL,
  `location` varchar(400) DEFAULT NULL,
  `subject` varchar(500) DEFAULT NULL,
  `from_date` datetime DEFAULT NULL,
  `to_date` datetime DEFAULT NULL,
  `residency` varchar(300) DEFAULT NULL,
  `vehicle` varchar(400) DEFAULT NULL,
  `description` text DEFAULT NULL,
  `status` varchar(200) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_persian_ci;

#
# Reading the personnel_salary_deduction.frm file.
#
# CREATE statement for /var/lib/old-db/bjdb/personnel_salary_deduction.frm:
#

CREATE TABLE `bjdb`.`personnel_salary_deduction` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `personnel_id_fk` int(11) DEFAULT NULL,
  `contract_code` varchar(45) DEFAULT NULL,
  `period` varchar(100) DEFAULT NULL,
  `insurance_amount` decimal(10,0) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_persian_ci;

#
# Reading the personnel_shift.frm file.
#
# CREATE statement for /var/lib/old-db/bjdb/personnel_shift.frm:
#

CREATE TABLE `bjdb`.`personnel_shift` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `jobs_shift_id_fk` int(11) DEFAULT NULL,
  `personnel_id_fk` int(11) DEFAULT NULL,
  `start_date` datetime DEFAULT NULL,
  `end_date` datetime DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_persian_ci;

#
# Reading the personnel_subordinate.frm file.
#
# CREATE statement for /var/lib/old-db/bjdb/personnel_subordinate.frm:
#

CREATE TABLE `bjdb`.`personnel_subordinate` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `personnel_id_fk` int(11) NOT NULL,
  `first_name` varchar(100) DEFAULT NULL,
  `last_name` varchar(100) DEFAULT NULL,
  `relation` varchar(45) DEFAULT NULL,
  `national_code` varchar(10) DEFAULT NULL,
  `sponsorship_status` varchar(100) DEFAULT NULL,
  `sponsor_description` text DEFAULT NULL,
  `sponsor_date` datetime DEFAULT NULL,
  `father_name` varchar(100) DEFAULT NULL,
  `id_number` varchar(45) DEFAULT NULL,
  `birth_date` datetime DEFAULT NULL,
  `issue_place` varchar(200) DEFAULT NULL,
  `insurance_number` varchar(45) DEFAULT NULL,
  `exit_sponsor_reason` text DEFAULT NULL,
  `exit_sponsor_date` datetime DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_persian_ci;

#
# Reading the personnel_timeoff.frm file.
#
# CREATE statement for /var/lib/old-db/bjdb/personnel_timeoff.frm:
#

CREATE TABLE `bjdb`.`personnel_timeoff` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `type` varchar(200) DEFAULT NULL,
  `request_type` varchar(200) DEFAULT NULL,
  `from_date` datetime DEFAULT NULL,
  `to_date` datetime DEFAULT NULL,
  `description` text DEFAULT NULL,
  `status` varchar(200) DEFAULT NULL,
  `personnel_id_fk` int(11) DEFAULT NULL,
  `file_url` varchar(300) DEFAULT NULL,
  `operator_id_fk` int(11) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_persian_ci;

#
# Reading the settle.frm file.
#
# CREATE statement for /var/lib/old-db/bjdb/settle.frm:
#

CREATE TABLE `bjdb`.`settle` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `personnel_id_fk` int(11) DEFAULT NULL,
  `date` datetime DEFAULT NULL,
  `reason` text DEFAULT NULL,
  `description` text DEFAULT NULL,
  `approved` tinyint(4) DEFAULT NULL,
  `register_user_id_fk` int(11) DEFAULT NULL,
  `status` varchar(200) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_persian_ci;

#
# Reading the settle_status.frm file.
#
# CREATE statement for /var/lib/old-db/bjdb/settle_status.frm:
#

CREATE TABLE `bjdb`.`settle_status` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `settle_id_fk` int(11) DEFAULT NULL,
  `unit` varchar(200) DEFAULT NULL,
  `result` varchar(300) DEFAULT NULL,
  `description` text DEFAULT NULL,
  `date` datetime DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_persian_ci;

#
# Reading the survey.frm file.
#
# CREATE statement for /var/lib/old-db/bjdb/survey.frm:
#

CREATE TABLE `bjdb`.`survey` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `workgroup_id_fk` int(11) DEFAULT NULL,
  `participate_type` varchar(200) DEFAULT NULL,
  `participate_group_name` varchar(200) DEFAULT NULL,
  `survey_call` tinyint(4) DEFAULT NULL,
  `survey_workgroup_call_id_fk` int(11) DEFAULT NULL,
  `title` text DEFAULT NULL,
  `type` varchar(300) DEFAULT NULL,
  `survey_category_id_fk` int(11) DEFAULT NULL,
  `category_title` varchar(300) DEFAULT NULL,
  `problem_description` text DEFAULT NULL,
  `suggestion` text DEFAULT NULL,
  `requirement` text DEFAULT NULL,
  `is_exist` tinyint(4) DEFAULT NULL,
  `participate_in_execution` tinyint(4) DEFAULT NULL,
  `participate_exe_type` varchar(200) DEFAULT NULL,
  `participate_exe_percent` decimal(10,0) DEFAULT NULL,
  `participate_exe_year` decimal(10,0) DEFAULT NULL,
  `file_url` varchar(300) DEFAULT NULL,
  `survey_user_id_fk` int(11) DEFAULT NULL,
  `code` varchar(45) DEFAULT NULL,
  `idea_price` decimal(10,0) DEFAULT NULL,
  `status` varchar(200) DEFAULT NULL,
  `approve_level1` tinyint(4) DEFAULT NULL,
  `approve_level2` tinyint(4) DEFAULT NULL,
  `create_date` datetime DEFAULT NULL,
  `last_update_date` datetime DEFAULT NULL,
  `is_postponed` tinyint(4) DEFAULT NULL,
  `end_of_postpone` datetime DEFAULT NULL,
  `reward` varchar(200) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_persian_ci;

#
# Reading the survey_adv_dis.frm file.
#
# CREATE statement for /var/lib/old-db/bjdb/survey_adv_dis.frm:
#

CREATE TABLE `bjdb`.`survey_adv_dis` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `survey_user_id_fk` int(11) DEFAULT NULL,
  `comment` text DEFAULT NULL,
  `type` varchar(45) DEFAULT NULL,
  `survey_id_fk` int(11) DEFAULT NULL,
  `personnel_id_fk` int(11) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_persian_ci;

#
# Reading the survey_advdis_comment.frm file.
#
# CREATE statement for /var/lib/old-db/bjdb/survey_advdis_comment.frm:
#

CREATE TABLE `bjdb`.`survey_advdis_comment` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `survey_advdis_id_fk` int(11) DEFAULT NULL,
  `date` datetime DEFAULT NULL,
  `personnel_id_fk` int(11) DEFAULT NULL,
  `description` text DEFAULT NULL,
  `type` varchar(200) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_persian_ci;

#
# Reading the survey_call_subscribe.frm file.
#
# CREATE statement for /var/lib/old-db/bjdb/survey_call_subscribe.frm:
#

CREATE TABLE `bjdb`.`survey_call_subscribe` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `survey_user_id_fk` int(11) DEFAULT NULL,
  `survey_workgroup_call_id_fk` int(11) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_persian_ci;

#
# Reading the survey_category.frm file.
#
# CREATE statement for /var/lib/old-db/bjdb/survey_category.frm:
#

CREATE TABLE `bjdb`.`survey_category` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(200) DEFAULT NULL,
  `is_enable` tinyint(4) DEFAULT NULL,
  `description` text DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_persian_ci;

#
# Reading the survey_disadv_comment_reaction.frm file.
#
# CREATE statement for /var/lib/old-db/bjdb/survey_disadv_comment_reaction.frm:
#

CREATE TABLE `bjdb`.`survey_disadv_comment_reaction` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `personnel_id_fk` int(11) DEFAULT NULL,
  `survey_advdis_comment_id_fk` int(11) DEFAULT NULL,
  `reaction` varchar(200) DEFAULT NULL,
  `date` datetime DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_persian_ci;

#
# Reading the survey_disadv_reaction.frm file.
#
# CREATE statement for /var/lib/old-db/bjdb/survey_disadv_reaction.frm:
#

CREATE TABLE `bjdb`.`survey_disadv_reaction` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `dis_adv_id_fk` int(11) DEFAULT NULL,
  `reaction` varchar(100) DEFAULT NULL,
  `personnel_id_fk` int(11) DEFAULT NULL,
  `date` datetime DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_persian_ci;

#
# Reading the survey_excellent_group_result.frm file.
#
# CREATE statement for /var/lib/old-db/bjdb/survey_excellent_group_result.frm:
#

CREATE TABLE `bjdb`.`survey_excellent_group_result` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `personnel_id_fk` int(11) DEFAULT NULL,
  `approve` tinyint(4) DEFAULT NULL,
  `survey_id_fk` int(11) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_persian_ci;

#
# Reading the survey_execution.frm file.
#
# CREATE statement for /var/lib/old-db/bjdb/survey_execution.frm:
#

CREATE TABLE `bjdb`.`survey_execution` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `survey_id_fk` int(11) DEFAULT NULL,
  `personnel_id_fk` int(11) DEFAULT NULL,
  `date` datetime DEFAULT NULL,
  `approve` tinyint(4) DEFAULT NULL,
  `due_day` int(11) DEFAULT NULL,
  `timeline_file` varchar(300) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_persian_ci;

#
# Reading the survey_log.frm file.
#
# CREATE statement for /var/lib/old-db/bjdb/survey_log.frm:
#

CREATE TABLE `bjdb`.`survey_log` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `action` text DEFAULT NULL,
  `date` datetime DEFAULT NULL,
  `survey_user_id_fk` int(11) DEFAULT NULL,
  `personnel_id_fk` int(11) DEFAULT NULL,
  `survey_id_fk` int(11) DEFAULT NULL,
  `description` text DEFAULT NULL,
  `from_status` varchar(200) DEFAULT NULL,
  `to_status` varchar(200) DEFAULT NULL,
  `status_type` varchar(45) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_persian_ci;

#
# Reading the survey_member.frm file.
#
# CREATE statement for /var/lib/old-db/bjdb/survey_member.frm:
#

CREATE TABLE `bjdb`.`survey_member` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `survey_id_fk` int(11) DEFAULT NULL,
  `personnel_id_fk` int(11) DEFAULT NULL,
  `status` varchar(200) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_persian_ci;

#
# Reading the survey_member_status_count.frm file.
#
# CREATE statement for /var/lib/old-db/bjdb/survey_member_status_count.frm:
#

CREATE TABLE `bjdb`.`survey_member_status_count` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `personnel_id_fk` int(11) DEFAULT NULL,
  `status` varchar(200) DEFAULT NULL,
  `is_read` tinyint(4) DEFAULT NULL,
  `survey_id_fk` int(11) DEFAULT NULL,
  `survey_user_id_fk` int(11) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_persian_ci;

#
# Reading the survey_participant.frm file.
#
# CREATE statement for /var/lib/old-db/bjdb/survey_participant.frm:
#

CREATE TABLE `bjdb`.`survey_participant` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `survey_id_fk` int(11) DEFAULT NULL,
  `survey_user_id_fk` int(11) DEFAULT NULL,
  `participation_percent` decimal(10,0) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_persian_ci;

#
# Reading the survey_problem.frm file.
#
# CREATE statement for /var/lib/old-db/bjdb/survey_problem.frm:
#

CREATE TABLE `bjdb`.`survey_problem` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `survey_id_fk` int(11) DEFAULT NULL,
  `type` varchar(200) DEFAULT NULL,
  `date` datetime DEFAULT NULL,
  `result` text DEFAULT NULL,
  `title` text DEFAULT NULL,
  `description` text DEFAULT NULL,
  `solution` text DEFAULT NULL,
  `personnel_id_fk` int(11) DEFAULT NULL,
  `problem_date` datetime DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_persian_ci;

#
# Reading the survey_reset.frm file.
#
# CREATE statement for /var/lib/old-db/bjdb/survey_reset.frm:
#

CREATE TABLE `bjdb`.`survey_reset` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `personnel_id_fk` int(11) DEFAULT NULL,
  `survey_id_fk` int(11) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_persian_ci;

#
# Reading the survey_result.frm file.
#
# CREATE statement for /var/lib/old-db/bjdb/survey_result.frm:
#

CREATE TABLE `bjdb`.`survey_result` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `personnel_id_fk` int(11) DEFAULT NULL,
  `date` datetime DEFAULT NULL,
  `survey_id_fk` varchar(45) DEFAULT NULL,
  `special` tinyint(4) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_persian_ci;

#
# Reading the survey_result_evaluation.frm file.
#
# CREATE statement for /var/lib/old-db/bjdb/survey_result_evaluation.frm:
#

CREATE TABLE `bjdb`.`survey_result_evaluation` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `result_id_fk` int(11) DEFAULT NULL,
  `evaluation_id_fk` int(11) DEFAULT NULL,
  `value` varchar(40) DEFAULT NULL,
  `supervisor_value` varchar(40) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_persian_ci;

#
# Reading the survey_result_reject.frm file.
#
# CREATE statement for /var/lib/old-db/bjdb/survey_result_reject.frm:
#

CREATE TABLE `bjdb`.`survey_result_reject` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `result_id_fk` int(11) DEFAULT NULL,
  `evaluation_id_fk` int(11) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_persian_ci;

#
# Reading the survey_setting.frm file.
#
# CREATE statement for /var/lib/old-db/bjdb/survey_setting.frm:
#

CREATE TABLE `bjdb`.`survey_setting` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `manager_id_fk` int(11) DEFAULT NULL,
  `max_day_first_assessment` decimal(10,0) DEFAULT NULL,
  `max_day_expert_workgroup` decimal(10,0) DEFAULT NULL,
  `max_day_excellent_workgroup` decimal(10,0) DEFAULT NULL,
  `max_day_edit` decimal(10,0) DEFAULT NULL,
  `max_day_review_request` decimal(10,0) DEFAULT NULL,
  `max_day_planning_execution` decimal(10,0) DEFAULT NULL,
  `max_day_execution_review` decimal(10,0) DEFAULT NULL,
  `rial_rate_per_year` decimal(10,0) DEFAULT NULL,
  `min_reward_rial` decimal(10,0) DEFAULT NULL,
  `max_percent_participate` decimal(10,0) DEFAULT NULL,
  `min_pass_point` decimal(10,0) DEFAULT NULL,
  `background_image` varchar(300) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_persian_ci;

#
# Reading the survey_top_workgroup.frm file.
#
# CREATE statement for /var/lib/old-db/bjdb/survey_top_workgroup.frm:
#

CREATE TABLE `bjdb`.`survey_top_workgroup` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `survey_id_fk` int(11) DEFAULT NULL,
  `reward_type` varchar(200) DEFAULT NULL,
  `suggest_reward` decimal(10,0) DEFAULT NULL,
  `score` int(11) DEFAULT NULL,
  `due_day` int(11) DEFAULT NULL,
  `unit` varchar(100) DEFAULT NULL,
  `company_id_fk` int(11) DEFAULT NULL,
  `personnel_id_fk` int(11) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_persian_ci;

#
# Reading the survey_user.frm file.
#
# CREATE statement for /var/lib/old-db/bjdb/survey_user.frm:
#

CREATE TABLE `bjdb`.`survey_user` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `first_name` varchar(200) DEFAULT NULL,
  `last_name` varchar(200) DEFAULT NULL,
  `national_code` varchar(45) DEFAULT NULL,
  `id_number` varchar(45) DEFAULT NULL,
  `father_name` varchar(200) DEFAULT NULL,
  `gender` varchar(45) DEFAULT NULL,
  `mobile` varchar(45) DEFAULT NULL,
  `code` varchar(200) DEFAULT NULL,
  `birth_date` datetime DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_persian_ci;

#
# Reading the survey_workgroup.frm file.
#
# CREATE statement for /var/lib/old-db/bjdb/survey_workgroup.frm:
#

CREATE TABLE `bjdb`.`survey_workgroup` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(300) DEFAULT NULL,
  `fix` tinyint(4) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_persian_ci;

#
# Reading the survey_workgroup_call.frm file.
#
# CREATE statement for /var/lib/old-db/bjdb/survey_workgroup_call.frm:
#

CREATE TABLE `bjdb`.`survey_workgroup_call` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `workgroup_id_fk` int(11) DEFAULT NULL,
  `subject` varchar(400) DEFAULT NULL,
  `start_date` datetime DEFAULT NULL,
  `end_date` datetime DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_persian_ci;

#
# Reading the survey_workgroup_evaluation.frm file.
#
# CREATE statement for /var/lib/old-db/bjdb/survey_workgroup_evaluation.frm:
#

CREATE TABLE `bjdb`.`survey_workgroup_evaluation` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(400) DEFAULT NULL,
  `workgroup_id_fk` int(11) DEFAULT NULL,
  `rate_type` varchar(45) DEFAULT NULL,
  `weight_factor` decimal(10,0) DEFAULT NULL,
  `is_enabled` tinyint(4) DEFAULT NULL,
  `description` text DEFAULT NULL,
  `max_point` decimal(10,0) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_persian_ci;

#
# Reading the survey_workgroup_personnel.frm file.
#
# CREATE statement for /var/lib/old-db/bjdb/survey_workgroup_personnel.frm:
#

CREATE TABLE `bjdb`.`survey_workgroup_personnel` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `personnel_id_fk` int(11) DEFAULT NULL,
  `workgroup_id_fk` int(11) DEFAULT NULL,
  `position` varchar(200) DEFAULT NULL,
  `member_from` datetime DEFAULT NULL,
  `member_to` datetime DEFAULT NULL,
  `approved` tinyint(4) DEFAULT NULL,
  `fix` tinyint(4) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_persian_ci;

#
# Reading the survey_workgroup_reject.frm file.
#
# CREATE statement for /var/lib/old-db/bjdb/survey_workgroup_reject.frm:
#

CREATE TABLE `bjdb`.`survey_workgroup_reject` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `workgroup_id_fk` int(11) DEFAULT NULL,
  `name` varchar(300) DEFAULT NULL,
  `min_point` decimal(10,0) DEFAULT NULL,
  `is_enable` tinyint(4) DEFAULT NULL,
  `description` text DEFAULT NULL,
  `last_update_date` datetime DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_persian_ci;

#
# Reading the table_name.frm file.
#
# CREATE statement for /var/lib/old-db/bjdb/table_name.frm:
#

CREATE TABLE `bjdb`.`table_name` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `table_name` varchar(200) DEFAULT NULL,
  `title` varchar(300) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_persian_ci;

#
# Reading the tasks.frm file.
#
# CREATE statement for /var/lib/old-db/bjdb/tasks.frm:
#

CREATE TABLE `bjdb`.`tasks` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `title` varchar(255) CHARACTER SET utf8 COLLATE utf8_persian_ci DEFAULT NULL,
  `description` text CHARACTER SET utf8 COLLATE utf8_persian_ci DEFAULT NULL,
  `task_type` varchar(45) DEFAULT NULL,
  `related_task` int(11) DEFAULT NULL,
  `due_date` datetime DEFAULT NULL,
  `if_task_failed` varchar(100) DEFAULT NULL,
  `point` int(11) DEFAULT NULL,
  `negative_point` int(11) DEFAULT NULL,
  `status` varchar(255) DEFAULT NULL,
  `created_at` datetime DEFAULT NULL,
  `created_by` int(11) DEFAULT NULL,
  `approved` tinyint(4) DEFAULT NULL,
  `priority` varchar(255) DEFAULT NULL,
  `punishment` varchar(255) DEFAULT NULL,
  `page_url` varchar(500) DEFAULT NULL,
  `approve_condition` varchar(255) DEFAULT NULL,
  `approver_jobs_ids` varchar(255) DEFAULT NULL,
  `approver_personnel_id_fk` int(11) DEFAULT NULL,
  `approve_jobs_sequence` varchar(45) DEFAULT NULL,
  `task_condition_id_fk` int(11) DEFAULT NULL,
  `destination_record_id` int(11) DEFAULT NULL,
  `referable` tinyint(4) DEFAULT NULL,
  `attachment_url` varchar(300) DEFAULT NULL,
  `attachment_description` text default NULL,
  `file_url` varchar(100) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_persian_ci;

#
# Reading the tasks_approver.frm file.
#
# CREATE statement for /var/lib/old-db/bjdb/tasks_approver.frm:
#

CREATE TABLE `bjdb`.`tasks_approver` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `personnel_id_fk` int(11) DEFAULT NULL,
  `task_id_fk` int(11) DEFAULT NULL,
  `approved` tinyint(4) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_persian_ci;

#
# Reading the tasks_condition.frm file.
#
# CREATE statement for /var/lib/old-db/bjdb/tasks_condition.frm:
#

CREATE TABLE `bjdb`.`tasks_condition` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `table_name_id_fk` int(11) DEFAULT NULL,
  `_condition` text DEFAULT NULL,
  `title` varchar(500) DEFAULT NULL,
  `description` text DEFAULT NULL,
  `seconds_after_create` int(11) DEFAULT NULL,
  `if_task_failed` varchar(100) DEFAULT NULL,
  `point` int(11) DEFAULT NULL,
  `negative_point` int(11) DEFAULT NULL,
  `personnel_members` varchar(500) DEFAULT NULL,
  `enable` tinyint(4) DEFAULT NULL,
  `jobs` varchar(500) DEFAULT NULL,
  `priority` varchar(255) DEFAULT NULL,
  `punishment` varchar(255) DEFAULT NULL,
  `personnel_to_inform` varchar(500) DEFAULT NULL,
  `sms_notification` varchar(100) DEFAULT NULL,
  `page_url` varchar(500) DEFAULT NULL,
  `approve_condition` varchar(255) DEFAULT NULL,
  `approver_jobs_ids` varchar(255) DEFAULT NULL,
  `approver_personnel_id_fk` int(11) DEFAULT NULL,
  `approve_jobs_sequence` varchar(45) DEFAULT NULL,
  `creator_id_fk` int(11) DEFAULT NULL,
  `referable` tinyint(4) DEFAULT NULL,
  `file` nvarchar(200) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_persian_ci;

#
# Reading the tasks_forward.frm file.
#
# CREATE statement for /var/lib/old-db/bjdb/tasks_forward.frm:
#

CREATE TABLE `bjdb`.`tasks_forward` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `personnel_id_fk` int(11) DEFAULT NULL,
  `task_id_fk` int(11) DEFAULT NULL,
  `description` text DEFAULT NULL,
  `read_on` datetime DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_persian_ci;

#
# Reading the tasks_log.frm file.
#
# CREATE statement for /var/lib/old-db/bjdb/tasks_log.frm:
#

CREATE TABLE `bjdb`.`tasks_log` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `task_id_fk` int(11) DEFAULT NULL,
  `operator_id_fk` int(11) DEFAULT NULL,
  `description` text DEFAULT NULL,
  `date` datetime DEFAULT NULL,
  `payload` text DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_persian_ci;

#
# Reading the tasks_member.frm file.
#
# CREATE statement for /var/lib/old-db/bjdb/tasks_member.frm:
#

CREATE TABLE `bjdb`.`tasks_member` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `task_id_fk` int(11) DEFAULT NULL,
  `personnel_id_fk` int(11) DEFAULT NULL,
  `read_on` datetime default NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_persian_ci;

#
# Reading the tasks_notmyduty.frm file.
#
# CREATE statement for /var/lib/old-db/bjdb/tasks_notmyduty.frm:
#

CREATE TABLE `bjdb`.`tasks_notmyduty` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `task_id_fk` int(11) DEFAULT NULL,
  `personnel_id_fk` int(11) DEFAULT NULL,
  `description` text DEFAULT NULL,
  `date` datetime DEFAULT NULL,
  `approved` tinyint(4) DEFAULT NULL,
  `read_on` datetime default null,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_persian_ci;

#
# Reading the tasks_point.frm file.
#
# CREATE statement for /var/lib/old-db/bjdb/tasks_point.frm:
#

CREATE TABLE `bjdb`.`tasks_point` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `personnel_id_fk` int(11) DEFAULT NULL,
  `task_id_fk` int(11) DEFAULT NULL,
  `point` double DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_persian_ci;

#
# Reading the tasks_schedule_daily.frm file.
#
# CREATE statement for /var/lib/old-db/bjdb/tasks_schedule_daily.frm:
#

CREATE TABLE `bjdb`.`tasks_schedule_daily` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `tasks_condition_id_fk` int(11) DEFAULT NULL,
  `hour` int(11) DEFAULT NULL,
  `minute` int(11) DEFAULT NULL,
  `from_date` datetime DEFAULT NULL,
  `to_date` datetime DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_persian_ci;

#
# Reading the tasks_schedule_monthly.frm file.
#
# CREATE statement for /var/lib/old-db/bjdb/tasks_schedule_monthly.frm:
#

CREATE TABLE `bjdb`.`tasks_schedule_monthly` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `tasks_condition_id_fk` int(11) DEFAULT NULL,
  `date` datetime DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_persian_ci;

#
# Reading the tasks_schedule_weekly.frm file.
#
# CREATE statement for /var/lib/old-db/bjdb/tasks_schedule_weekly.frm:
#

CREATE TABLE `bjdb`.`tasks_schedule_weekly` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `day_name` varchar(45) DEFAULT NULL,
  `hour` int(11) DEFAULT NULL,
  `minute` int(11) DEFAULT NULL,
  `tasks_condition_id_fk` int(11) DEFAULT NULL,
  `from_date` datetime DEFAULT NULL,
  `to_date` datetime DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_persian_ci;

#
# Reading the tasks_schedule_yearly.frm file.
#
# CREATE statement for /var/lib/old-db/bjdb/tasks_schedule_yearly.frm:
#

CREATE TABLE `bjdb`.`tasks_schedule_yearly` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `tasks_condition_id_fk` int(11) DEFAULT NULL,
  `date` datetime DEFAULT NULL,
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_persian_ci;

#
# Reading the tasks_sms_notification.frm file.
#
# CREATE statement for /var/lib/old-db/bjdb/tasks_sms_notification.frm:
#

CREATE TABLE `bjdb`.`tasks_sms_notification` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `personnel_id_fk` int(11) DEFAULT NULL,
  `date` datetime DEFAULT NULL,
  `tasks_id_fk` int(11) DEFAULT NULL,
  `percentage` int(11) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_persian_ci;

#
# Reading the tasks_toinform.frm file.
#
# CREATE statement for /var/lib/old-db/bjdb/tasks_toinform.frm:
#

CREATE TABLE `bjdb`.`tasks_toinform` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `tasks_id_fk` int(11) DEFAULT NULL,
  `personnel_id_fk` int(11) DEFAULT NULL,
  `read_on` datetime DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_persian_ci;

#
# Reading the vehicle.frm file.
#
# CREATE statement for /var/lib/old-db/bjdb/vehicle.frm:
#

CREATE TABLE `bjdb`.`vehicle` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `status` varchar(45) DEFAULT NULL,
  `organization_code` varchar(100) DEFAULT NULL,
  `type_id_fk` int(11) DEFAULT NULL,
  `system_id_fk` int(11) DEFAULT NULL,
  `style_id_fk` int(11) DEFAULT NULL,
  `plaque1` varchar(10) DEFAULT NULL,
  `plaque2` varchar(10) DEFAULT NULL,
  `plaque3` varchar(10) DEFAULT NULL,
  `plaque4` varchar(10) DEFAULT NULL,
  `engine_number` varchar(200) DEFAULT NULL,
  `chassis_number` varchar(200) DEFAULT NULL,
  `vin_number` varchar(200) DEFAULT NULL,
  `serial_number` varchar(200) DEFAULT NULL,
  `made_year` varchar(5) DEFAULT NULL,
  `color` varchar(45) DEFAULT NULL,
  `gearbox` varchar(10) DEFAULT NULL,
  `price` double DEFAULT NULL,
  `contract_id_fk` int(11) DEFAULT NULL,
  `description` text DEFAULT NULL,
  `card_url` varchar(200) DEFAULT NULL,
  `green_card_url` varchar(200) DEFAULT NULL,
  `ownership_document_url` varchar(200) DEFAULT NULL,
  `owner_id_fk` int(11) DEFAULT NULL,
  `owner_type` varchar(45) DEFAULT NULL,
  `date_type` varchar(45) DEFAULT NULL,
  `environment_id_fk` int(11) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_persian_ci;

#
# Reading the vehicle_style.frm file.
#
# CREATE statement for /var/lib/old-db/bjdb/vehicle_style.frm:
#

CREATE TABLE `bjdb`.`vehicle_style` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `title` varchar(100) DEFAULT NULL,
  `system_id_fk` int(11) DEFAULT NULL,
  `type_id_fk` int(11) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_persian_ci;

#
# Reading the vehicle_system.frm file.
#
# CREATE statement for /var/lib/old-db/bjdb/vehicle_system.frm:
#

CREATE TABLE `bjdb`.`vehicle_system` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `title` varchar(100) DEFAULT NULL,
  `type_id_fk` int(11) DEFAULT NULL,
  `logo` varchar(100) DEFAULT NULL,
  `en_title` varchar(200) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_persian_ci;

#
# Reading the vehicle_type.frm file.
#
# CREATE statement for /var/lib/old-db/bjdb/vehicle_type.frm:
#

CREATE TABLE `bjdb`.`vehicle_type` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `title` varchar(100) DEFAULT NULL,
  `code` varchar(200) DEFAULT NULL,
  `pelak` tinyint(4) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_persian_ci;
