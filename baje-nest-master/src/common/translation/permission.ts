export class PermissionTranslation {

  private repository: Object = {
    person_insert: { label: "ثبت رکورد", value: "person/insert" },
    person_edit: { label: "ویرایش رکورد", value: "person/edit" },
    person_delete: { label: "حذف رکورد", value: "person/delete" },
    person_approve: { label: "تایید رکورد", value: "person/approve" },
    person_privatedescription: {
      label: "مشاهده توضیحات اختصاصی",
      value: "person/privatedescription",
    },
    person_editcontact: {
      label: "تغییر اطلاعات تماس",
      value: "person/editcontact",
    },
    person_viewsubordinate: {
      label: "مشاهده افراد تبعی",
      value: "person/viewsubordinate",
    },
    person_list: { label: "لیست پرسنل", value: "person/list" },
    person_timeoff_for_others: {
      label: "درخواست مرخصی برای دیگران",
      value: "person/submit-timeoff-forothers",
    },
    person_approve_timeoff: {
      label: "تایید مرخصی",
      value: "person/approve-timeoff",
    },
    //legal  //6s: 6L
    legal_insert: { label: "ثبت رکورد", value: "legal/insert" },
    legal_edit: { label: "ویرایش رکورد", value: "legal/edit" },
    legal_delete: { label: "حذف رکورد", value: "legal/delete" },
    legal_approve: { label: "تایید رکورد", value: "legal/approve" },
    legal_editcontact: {
      label: "تغییر اطلاعات تماس",
      value: "legal/editcontact",
    },
    legal_list: { label: "لیست حقوقی", value: "legal/list" },
    //machinery //6s: 6L
    machinery_insert: {
      label: "ثبت رکورد",
      value: "machinery/insert",
    },
    machinery_edit: { label: "ویرایش رکورد", value: "machinery/edit" },
    machinery_delete: {
      label: "حذف رکورد",
      value: "machinery/delete",
    },
    machinery_approve: {
      label: "تایید رکورد",
      value: "machinery/approve",
    },
    machinery_editcontact: {
      label: "تغییر اطلاعات تماس",
      value: "machinery/editcontact",
    },
    machinery_list: {
      label: "لیست ماشین آلات",
      value: "machinery/list",
    },
    //contract //13S : 12L
    contract_insert: { label: "ثبت رکورد", value: "contract/insert" },
    contract_edit: { label: "ویرایش رکورد", value: "contract/edit" },
    contract_delete: { label: "حذف رکورد", value: "contract/delete" },
    contract_approve: {
      label: "تایید رکورد",
      value: "contract/approve",
    },
    contract_list: {
      label: "لیست قرارداد ها",
      value: "contract/list",
    },
    contract_progress_add_edit: {
      label: "ثبت/ویرایش اطلاعات پیشرفت پروژه",
      value: "contract/progress-add-edit",
    },
    contract_progress_approve: {
      label: "تایید اطلاعات پیشرفت پروژه",
      value: "contract/progress-approve",
    },
    contract_production_report_add_edit: {
      label: "ثبت/ویرایش اطلاعات گزارش تولید",
      value: "contract/production-report-add-edit",
    },
    contract_production_report_approve: {
      label: "تایید اطلاعات گزارش تولید",
      value: "contract/production-report-approve",
    },
    contract_peyman_report_add_edit: {
      label: "ثبت/ویرایش اطلاعات اولیه کنترل پروژه ماشین آلات",
      value: "contract/peyman-report-add-edit",
    },
    contract_peyman_report_approve: {
      label: "تایید اطلاعات اولیه کنترل پروژه ماشین آلات",
      value: "contract/peyman-report-approve",
    },
    contract_dashboard_report: {
      label: "گزارشات داشبورد",
      value: "contract/dashboard-report",
    },
    // tamin_insurance_view_contract_in_report:{ label: " ", value:  "tamin_insurance/view_contract_in_report" },

    //tamin //7S : 7L
    tamin_insurance_menu: {
      label: "منوی بیمه تامین اجتماعی",
      value: "tamin_insurance/menu",
    },
    tamin_insurance_list_change_status: {
      label: "تغییر وضعیت لیست بیمه تامین اجتماعی",
      value: "tamin_insurance/list_change_status",
    },
    tamin_insurance_export_list: {
      label: "خروجی اکسل از لیست های بیمه تامین اجتماعی",
      value: "tamin_insurance/export_list",
    },
    tamin_insurance_report: {
      label: "گزارش بیمه تامین اجتماعی",
      value: "tamin_insurance/report",
    },
    tamin_insurance_view_contract_in_report: {
      label: "مشاهده قرارداد ها در گزارش تامین اجتماعی",
      value: "tamin_insurance/view_contract_in_report",
    },
    tamin_insurance_view_include_notification_in_report: {
      label: "مشاهده مشمول و غیر مشمول در گزارش تامین اجتماعی",
      value: "tamin_insurance/view_include_notinclude_in_report",
    },
    tamin_insurance_export_personnel_list: {
      label: "خروجی اکسل از لیست ریز اسامی بیمه تامین اجتماعی",
      value: "tamin_insurance/export_personnel_list",
    },

    //hse //4S : 4L
    hse_approve: { label: "تایید بازرسی", value: "hse/approve" },
    hse_audit: { label: "انجام بازرسی", value: "hse/audit" },
    hse_settings: { label: "تنظیمات HSE", value: "hse/settings" },
    hse_view: { label: "ویوی بازرسی", value: "hse/view" },

    // third party insurance
    third_party_insurance_view: {
      label: "مشاهده بیمه شخص ثالث",
      value: "third_party_insurance/view",
    },
    third_party_insurance_approve: {
      label: "تغییر وضعیت بیمه شخص ثالث",
      value: "third_party_insurance/approve",
    },
    // environment
    environment_create: {
      label: "ساخت محیط",
      value: "environment/create",
    },
    environment_delete: {
      label: "حذف محیط",
      value: "environment/delete",
    },
    environment_edit: {
      label: "ویرایش محیط",
      value: "environment/edit",
    },
    environment_list: {
      label: "مشاهده محیط ها",
      value: "environment/list",
    },
    // environment usage
    environment_usage_create: {
      label: "ساخت کاربری محیط",
      value: "environment_usage/create",
    },
    environment_usage_delete: {
      label: "حذف کاربری محیط",
      value: "environment_usage/delete",
    },
    environment_usage_edit: {
      label: "ویرایش کاربری محیط",
      value: "environment_usage/edit",
    },
    environment_usage_list: {
      label: "لیست کاربری محیط",
      value: "environment_usage/list",
    },
    // supplementary insurance
    supplementary_insurance_list: {
      label: "مشاهده لیست بیمه های تکمیلی",
      value: "supplementary_insurance/list",
    },
    supplementary_insurance_create: {
      label: "ساخت بیمه تکمیلی جدید",
      value: "supplementary_insurance/create",
    },
    supplementary_insurance_update: {
      label: "ویرایش بیمه تکمیلی",
      value: "supplementary_insurance/update",
    },
    supplementary_insurance_delete: {
      label: "حذف بیمه تکمیلی",
      value: "supplementary_insurance/delete",
    },

    // additional untranslated permissions
    person_submit_timeoff_forothers: {
      label: "ثبت مرخصی برای دیگران",
      value: "person/submit_timeoff_forothers",
    },
    tamin_insurance_view_include_notinclude_in_report: {
      label: "انتخاب موارد موجود در گزارش بیمه تامین اجتماعی",
      value: "tamin_insurance/view_include_notinclude_in_report",
    },
    access_list: {
      label: "لیست دسترسی‌ها",
      value: "access/list",
    },
  }

  translate(value: string): string {
    for(const key of Object.keys(this.repository)) {
      const item: any = this.repository[key];
      if(item.value.toString() === value) {
        return item.label.toString();
      }
    }
  }
}