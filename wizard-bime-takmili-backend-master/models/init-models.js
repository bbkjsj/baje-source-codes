var Sequelize = require("sequelize").Sequelize;
var _SequelizeMeta = require("./SequelizeMeta");
var _audit = require("./audit");
var _company = require("./company");
var _contract = require("./contract");
var _contract_peyman_report = require("./contract_peyman_report");
var _contract_production_report = require("./contract_production_report");
var _contract_progress = require("./contract_progress");
var _damage_service = require("./damage_service");
var _doctor_visit = require("./doctor_visit");
var _hr_yearly_variable = require("./hr_yearly_variable");
var _imprest = require("./imprest");
var _incident = require("./incident");
var _incident_personnel = require("./incident_personnel");
var _incident_vehicle = require("./incident_vehicle");
var _insurance = require("./insurance");
var _insurance_history_claim = require("./insurance_history_claim");
var _insurance_introletter = require("./insurance_introletter");
var _insurance_payment = require("./insurance_payment");
var _insurance_takmili_personnel = require("./insurance_takmili_personnel");
var _insurance_takmili_subordinate = require("./insurance_takmili_subordinate");
var _insurance_tamin = require("./insurance_tamin");
var _insurance_tamin_disk = require("./insurance_tamin_disk");
var _insurance_tamin_personnel = require("./insurance_tamin_personnel");
var _job_permission = require("./job_permission");
var _job_title = require("./job_title");
var _personnel = require("./personnel");
var _personnel_access = require("./personnel_access");
var _personnel_insurance_deduction = require("./personnel_insurance_deduction");
var _personnel_insurance_rate = require("./personnel_insurance_rate");
var _personnel_mission = require("./personnel_mission");
var _personnel_salary_deduction = require("./personnel_salary_deduction");
var _personnel_subordinate = require("./personnel_subordinate");
var _personnel_timeoff = require("./personnel_timeoff");
var _settle = require("./settle");
var _settle_status = require("./settle_status");
var _survey = require("./survey");
var _survey_adv_dis = require("./survey_adv_dis");
var _survey_advdis_comment = require("./survey_advdis_comment");
var _survey_call_subscribe = require("./survey_call_subscribe");
var _survey_category = require("./survey_category");
var _survey_disadv_comment_reaction = require("./survey_disadv_comment_reaction");
var _survey_disadv_reaction = require("./survey_disadv_reaction");
var _survey_excellent_group_result = require("./survey_excellent_group_result");
var _survey_execution = require("./survey_execution");
var _survey_log = require("./survey_log");
var _survey_member = require("./survey_member");
var _survey_member_status_count = require("./survey_member_status_count");
var _survey_participant = require("./survey_participant");
var _survey_problem = require("./survey_problem");
var _survey_reset = require("./survey_reset");
var _survey_result = require("./survey_result");
var _survey_result_evaluation = require("./survey_result_evaluation");
var _survey_result_reject = require("./survey_result_reject");
var _survey_setting = require("./survey_setting");
var _survey_top_workgroup = require("./survey_top_workgroup");
var _survey_user = require("./survey_user");
var _survey_workgroup = require("./survey_workgroup");
var _survey_workgroup_call = require("./survey_workgroup_call");
var _survey_workgroup_evaluation = require("./survey_workgroup_evaluation");
var _survey_workgroup_personnel = require("./survey_workgroup_personnel");
var _survey_workgroup_reject = require("./survey_workgroup_reject");
var _vehicle = require("./vehicle");
var _vehicle_style = require("./vehicle_style");
var _vehicle_system = require("./vehicle_system");
var _vehicle_type = require("./vehicle_type");

function initModels(sequelize) {
  var SequelizeMeta = _SequelizeMeta(sequelize);
  var audit = _audit(sequelize);
  var company = _company(sequelize);
  var contract = _contract(sequelize);
  var contract_peyman_report = _contract_peyman_report(sequelize);
  var contract_production_report = _contract_production_report(sequelize);
  var contract_progress = _contract_progress(sequelize);
  var damage_service = _damage_service(sequelize);
  var doctor_visit = _doctor_visit(sequelize);
  var hr_yearly_variable = _hr_yearly_variable(sequelize);
  var imprest = _imprest(sequelize);
  var incident = _incident(sequelize);
  var incident_personnel = _incident_personnel(sequelize);
  var incident_vehicle = _incident_vehicle(sequelize);
  var insurance = _insurance(sequelize);
  var insurance_history_claim = _insurance_history_claim(sequelize);
  var insurance_introletter = _insurance_introletter(sequelize);
  var insurance_payment = _insurance_payment(sequelize);
  var insurance_takmili_personnel = _insurance_takmili_personnel(sequelize);
  var insurance_takmili_subordinate = _insurance_takmili_subordinate(sequelize);
  var insurance_tamin = _insurance_tamin(sequelize);
  var insurance_tamin_disk = _insurance_tamin_disk(sequelize);
  var insurance_tamin_personnel = _insurance_tamin_personnel(sequelize);
  var job_permission = _job_permission(sequelize);
  var job_title = _job_title(sequelize);
  var personnel = _personnel(sequelize);
  var personnel_access = _personnel_access(sequelize);
  var personnel_insurance_deduction = _personnel_insurance_deduction(sequelize);
  var personnel_insurance_rate = _personnel_insurance_rate(sequelize);
  var personnel_mission = _personnel_mission(sequelize);
  var personnel_salary_deduction = _personnel_salary_deduction(sequelize);
  var personnel_subordinate = _personnel_subordinate(sequelize);
  var personnel_timeoff = _personnel_timeoff(sequelize);
  var settle = _settle(sequelize);
  var settle_status = _settle_status(sequelize);
  var survey = _survey(sequelize);
  var survey_adv_dis = _survey_adv_dis(sequelize);
  var survey_advdis_comment = _survey_advdis_comment(sequelize);
  var survey_call_subscribe = _survey_call_subscribe(sequelize);
  var survey_category = _survey_category(sequelize);
  var survey_disadv_comment_reaction = _survey_disadv_comment_reaction(sequelize);
  var survey_disadv_reaction = _survey_disadv_reaction(sequelize);
  var survey_excellent_group_result = _survey_excellent_group_result(sequelize);
  var survey_execution = _survey_execution(sequelize);
  var survey_log = _survey_log(sequelize);
  var survey_member = _survey_member(sequelize);
  var survey_member_status_count = _survey_member_status_count(sequelize);
  var survey_participant = _survey_participant(sequelize);
  var survey_problem = _survey_problem(sequelize);
  var survey_reset = _survey_reset(sequelize);
  var survey_result = _survey_result(sequelize);
  var survey_result_evaluation = _survey_result_evaluation(sequelize);
  var survey_result_reject = _survey_result_reject(sequelize);
  var survey_setting = _survey_setting(sequelize);
  var survey_top_workgroup = _survey_top_workgroup(sequelize);
  var survey_user = _survey_user(sequelize);
  var survey_workgroup = _survey_workgroup(sequelize);
  var survey_workgroup_call = _survey_workgroup_call(sequelize);
  var survey_workgroup_evaluation = _survey_workgroup_evaluation(sequelize);
  var survey_workgroup_personnel = _survey_workgroup_personnel(sequelize);
  var survey_workgroup_reject = _survey_workgroup_reject(sequelize);
  var vehicle = _vehicle(sequelize);
  var vehicle_style = _vehicle_style(sequelize);
  var vehicle_system = _vehicle_system(sequelize);
  var vehicle_type = _vehicle_type(sequelize);


  return {
    SequelizeMeta,
    audit,
    company,
    contract,
    contract_peyman_report,
    contract_production_report,
    contract_progress,
    damage_service,
    doctor_visit,
    hr_yearly_variable,
    imprest,
    incident,
    incident_personnel,
    incident_vehicle,
    insurance,
    insurance_history_claim,
    insurance_introletter,
    insurance_payment,
    insurance_takmili_personnel,
    insurance_takmili_subordinate,
    insurance_tamin,
    insurance_tamin_disk,
    insurance_tamin_personnel,
    job_permission,
    job_title,
    personnel,
    personnel_access,
    personnel_insurance_deduction,
    personnel_insurance_rate,
    personnel_mission,
    personnel_salary_deduction,
    personnel_subordinate,
    personnel_timeoff,
    settle,
    settle_status,
    survey,
    survey_adv_dis,
    survey_advdis_comment,
    survey_call_subscribe,
    survey_category,
    survey_disadv_comment_reaction,
    survey_disadv_reaction,
    survey_excellent_group_result,
    survey_execution,
    survey_log,
    survey_member,
    survey_member_status_count,
    survey_participant,
    survey_problem,
    survey_reset,
    survey_result,
    survey_result_evaluation,
    survey_result_reject,
    survey_setting,
    survey_top_workgroup,
    survey_user,
    survey_workgroup,
    survey_workgroup_call,
    survey_workgroup_evaluation,
    survey_workgroup_personnel,
    survey_workgroup_reject,
    vehicle,
    vehicle_style,
    vehicle_system,
    vehicle_type,
  };
}
module.exports = initModels;
module.exports.initModels = initModels;
module.exports.default = initModels;
