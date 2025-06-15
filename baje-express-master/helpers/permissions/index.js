
module.exports.permissions = (() => {
    return _permissions;
});


module.exports.checkPermission = ((section, arrayOfPermissions) => {
    var hasAccess = false;
    var access = _permissions.filter(x => x.section == section);
    if (access) {
        for (let i = 0; i < arrayOfPermissions.length; i++) {
            var _access = access[0].permissions.filter(x => x.value == `${section}/${arrayOfPermissions[i]}`);
            if (!_access) { hasAccess = false; }
        }
    }

    return hasAccess;
})

module.exports.isInRole = ((user, rolesArray) => {

});


var _permissions = [
    {
        section: 'person',
        label: 'افراد حقیقی',
        permissions: [
            {
                label: 'ثبت رکورد',
                value: 'person/insert'
            },
            {
                label: 'ویرایش رکورد',
                value: 'person/edit'
            },
            {
                label: 'حذف رکورد',
                value: 'person/delete'
            },
            {
                label: 'تایید رکورد',
                value: 'person/approve'
            },
            {
                label: 'مشاهده توضیحات اختصاصی',
                value: 'person/privatedescription'
            },
            {
                label: 'تغییر اطلاعات تماس',
                value: 'person/editcontact'
            },
            {
                label: 'مشاهده افراد تبعی',
                value: 'person/viewsubordinate'
            },
            {
                label: 'لیست پرسنل',
                value: 'person/list'
            },
            {
                label: 'تایید مرخصی',
                value: 'person/approve-timeoff'
            },
            {
                label: 'درخواست مرخصی برای دیگران',
                value: 'person/submit-timeoff-forothers'
            },
            {
                label: 'تایید مرخصی',
                value: 'person/approve-timeoff'
            },
            {
                label: 'درخواست مرخصی برای دیگران',
                value: 'person/submit-timeoff-forothers'
            }
        ]
    },
    {
        section: 'legal',
        label: 'افراد حقوقی',
        permissions: [
            {
                label: 'ثبت رکورد',
                value: 'legal/insert'
            },
            {
                label: 'ویرایش رکورد',
                value: 'legal/edit'
            },
            {
                label: 'حذف رکورد',
                value: 'legal/delete'
            },
            {
                label: 'تایید رکورد',
                value: 'legal/approve'
            },
            {
                label: 'تغییر اطلاعات تماس',
                value: 'legal/editcontact'
            },
            ,
            {
                label: 'لیست حقوقی',
                value: 'legal/list'
            }
        ]
    },
    {
        section: 'machinery',
        label: 'ماشین آلات',
        permissions: [
            {
                label: 'ثبت رکورد',
                value: 'machinery/insert'
            },
            {
                label: 'تغییر رکورد',
                value: 'machinery/edit'
            },
            {
                label: 'حذف رکورد',
                value: 'machinery/delete'
            },
            {
                label: 'تایید/خروج از تایید رکورد',
                value: 'machinery/approve'
            },
            {
                label: 'لیست ماشین آلات',
                value: 'machinery/list'
            }
        ]
    },
    {
        section: 'contract',
        label: 'قرارداد ها',
        permissions: [
            {
                label: 'ثبت رکورد',
                value: 'contract/insert'
            },
            {
                label: 'تغییر رکورد',
                value: 'contract/edit'
            },
            {
                label: 'حذف رکورد',
                value: 'contract/delete'
            },
            {
                label: 'تایید/خروج از تایید رکورد',
                value: 'contract/approve'
            },
            {
                label: 'لیست قرارداد ها',
                value: 'contract/list'
            },
            {
                label: 'ثبت/ویرایش اطلاعات پیشرفت پروژه',
                value: 'contract/progress-add-edit'
            },
            {
                label: 'تایید اطلاعات پیشرفت پروژه',
                value: 'contract/progress-approve'
            },
            {
                label: 'ثبت/ویرایش اطلاعات گزارش تولید',
                value: 'contract/production-report-add-edit'
            },
            {
                label: 'تایید اطلاعات گزارش تولید',
                value: 'contract/production-report-approve'
            },
            {
                label: 'ثبت/ویرایش اطلاعات اولیه کنترل پروژه ماشین آلات',
                value: 'contract/peyman-report-add-edit'
            },
            {
                label: 'تایید اطلاعات اولیه کنترل پروژه ماشین آلات',
                value: 'contract/peyman-report-approve'
            },
            {
                label: 'گزارشات داشبورد',
                value: 'contract/dashboard-report'
            }
        ]
    },
    {
        section: 'tamin_insurance',
        label: 'بیمه',
        permissions: [
            {
                label: 'منوی بیمه تامین اجتماعی',
                value: 'tamin_insurance/menu'
            },
            {
                label: 'تغییر وضعیت لیست بیمه تامین اجتماعی',
                value: 'tamin_insurance/list_change_status'
            },
            {
                label: 'خروجی اکسل از لیست های بیمه تامین اجتماعی',
                value: 'tamin_insurance/export_list'
            },
            {
                label: 'خروجی اکسل از لیست ریز اسامی بیمه تامین اجتماعی',
                value: 'tamin_insurance/export_personnel_list'
            },
            {
                label: 'گزارش بیمه تامین اجتماعی',
                value: 'tamin_insurance/report'
            },
            {
                label: 'مشاهده قرارداد ها در گزارش تامین اجتماعی',
                value: 'tamin_insurance/view_contract_in_report'
            },
            {
                label: 'مشاهده مشمول و غیر مشمول در گزارش تامین اجتماعی',
                value: 'tamin_insurance/view_include_notinclude_in_report'
            },
            {
                label: 'خروجی لیست بیمه',
                value: 'tamin_insurance/export_list'
            }
        ]
    },
    {
        section: 'hse',
        label: 'بازرسی',
        permissions: [
            {
                label: 'تنظیمات HSE',
                value: 'hse/settings'
            },
            {
                label: 'ویوی بازرسی',
                value: 'hse/view'
            },
            {
                label: 'انجام بازرسی',
                value: 'hse/audit'
            },
            {
                label: 'تایید بازرسی',
                value: 'hse/approve'
            }
        ]
    }
]


