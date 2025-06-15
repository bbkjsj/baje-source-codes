
export enum Role {
    su = 'super',

    person_insert = 'person/insert',
    person_edit = 'person/edit',
    person_delete = 'person/delete',
    person_approve = 'person/approve',
    person_privatedescription = 'person/privatedescription',
    person_editcontact = 'person/editcontact',
    person_viewsubordinate = 'person/viewsubordinate',
    person_list = 'person/list',
    person_timeoff_for_others = 'person/submit-timeoff-forothers',
    person_approve_timeoff = 'person/approve-timeoff',


    legal_insert = 'legal/insert',
    legal_edit = 'legal/edit',
    legal_delete = 'legal/delete',
    legal_approve = 'legal/approve',
    legal_editcontact = 'legal/editcontact',
    legal_list = 'legal/list',


    machinery_insert = 'machinery/insert',
    machinery_edit = 'machinery/edit',
    machinery_delete = 'machinery/delete',
    machinery_approve = 'machinery/approve',
    machinery_editcontact = 'machinery/editcontact',
    machinery_list = 'machinery/list',


    contract_insert = 'contract/insert',
    contract_edit = 'contract/edit',
    contract_delete = 'contract/delete',
    contract_approve = 'contract/approve',
    contract_list = 'contract/list',
    contract_progress_add_edit = 'contract/progress-add-edit',
    contract_progress_approve = 'contract/progress-approve',
    contract_production_report_add_edit = 'contract/production-report-add-edit',
    contract_production_report_approve = 'contract/production-report-approve',
    contract_peyman_report_add_edit = 'contract/peyman-report-add-edit',
    contract_peyman_report_approve = 'contract/peyman-report-approve',
    contract_dashboard_report = 'contract/dashboard-report',

    hse_settings = 'hse/settings',
    hse_view = 'hse/view',
    hse_audit = 'hse/audit',
    hse_approve = 'hse/approve',

    tamin_insurance_menu = 'tamin_insurance/menu',
    tamin_insurance_list_change_status = 'tamin_insurance/list_change_status',
    tamin_insurance_export_list = 'tamin_insurance/export_list',
    tamin_insurance_report = 'tamin_insurance/report',
    tamin_insurance_view_contract_in_report = 'tamin_insurance/view_contract_in_report',
    tamin_insurance_view_include_notification_in_report = 'tamin_insurance/view_include_notinclude_in_report',
    tamin_insurance_export_personnel_list = 'tamin_insurance/export_personnel_list',


    third_party_insurance_view = 'third_party_insurance/view',
    third_party_insurance_approve = 'third_party_insurance/approve',

    environment_create = 'environment/create',
    environment_delete = 'environment/delete',
    environment_edit = 'environment/edit',
    environment_list = 'environment/list',


    environment_usage_create = 'environment_usage/create',
    environment_usage_delete = 'environment_usage/delete',
    environment_usage_list = 'environment_usage/list',
    environment_usage_edit = 'environment_usage/edit',

    supplementary_insurance_list = 'supplementary_insurance/list',
    supplementary_insurance_create = 'supplementary_insurance/create',
    supplementary_insurance_update = 'supplementary_insurance/update',
    supplementary_insurance_delete = 'supplementary_insurance/delete'
}

