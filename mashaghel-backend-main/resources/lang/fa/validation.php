<?php

return array(

    /*
    |--------------------------------------------------------------------------
    | Validation Language Lines
    |--------------------------------------------------------------------------
    |
    | The following language lines contain the default error messages used by
    | the validator class. Some of these rules have multiple versions such
    | as the size rules. Feel free to tweak each of these messages here.
    |
    */

    "accepted"         => ":attribute باید پذیرفته شده باشد.",
    "lt"               => "فیلد :attribute باید بزرگتر از  تاریخ شروع باشد",
    "active_url"       => "آدرس :attribute معتبر نیست",
    "after"            => ":attribute باید تاریخی بعد از :date باشد.",
    "alpha"            => ":attribute باید شامل حروف الفبا باشد.",
    "alpha_dash"       => ":attribute باید شامل حروف الفبا و عدد و خظ تیره(-) باشد.",
    "alpha_num"        => ":attribute باید شامل حروف الفبا و عدد باشد.",
    "array"            => ":attribute باید آرایه باشد.",
    "before"           => ":attribute باید تاریخی قبل از :date باشد.",
    "between"          => array(
        "numeric" => ":attribute باید بین :min و :max باشد.",
        "file"    => ":attribute باید بین :min و :max کیلوبایت باشد.",
        "string"  => ":attribute باید بین :min و :max کاراکتر باشد.",
        "array"   => ":attribute باید بین :min و :max آیتم باشد.",
    ),
    "boolean"          => "فیلد :attribute باید مقادیر 0 یا 1 داشته باشد",
    "confirmed"        => ":attribute با تاییدیه مطابقت ندارد.",
    "date"             => ":attribute یک تاریخ معتبر نیست.",
    "date_format"      => ":attribute با الگوی :format مطاقبت ندارد.",
    "different"        => ":attribute و :other باید متفاوت باشند.",
    "digits"           => ":attribute باید :digits رقم باشد.",
    "digits_between"   => ":attribute باید بین :min و :max رقم باشد.",
    "email"            => "فرمت :attribute معتبر نیست.",
    "exists"           => ":attribute انتخاب شده، معتبر نیست.",
    "image"            => ":attribute باید تصویر باشد.",
    "in"               => ":attribute انتخاب شده، معتبر نیست.",
    "integer"          => "فیلد :attribute باید عدد صحیح  باشد.",
    "ip"               => ":attribute باید IP آدرس معتبر باشد.",
    "json"               => "فیلد :attribute معتبر نیست",
    "max"              => array(
        "numeric" => ":attribute نباید بزرگتر از :max باشد.",
        "file"    => ":attribute نباید بزرگتر از :max کیلوبایت باشد.",
        "string"  => ":attribute نباید بیشتر از :max کاراکتر باشد.",
        "array"   => ":attribute نباید بیشتر از :max آیتم باشد.",
    ),
    "mimes"            => ":attribute باید یکی از فرمت های :values باشد.",
    "min"              => array(
        "numeric" => ":attribute نباید کوچکتر از :min باشد.",
        "file"    => ":attribute نباید کوچکتر از :min کیلوبایت باشد.",
        "string"  => ":attribute نباید کمتر از :min کاراکتر باشد.",
        "array"   => ":attribute نباید کمتر از :min آیتم باشد.",
    ),
    "not_in"           => ":attribute انتخاب شده، معتبر نیست.",
    "numeric"          => ":attribute باید عدد باشد.",
    "regex"            => ":attribute یک فرمت معتبر نیست",
    "required"         => "فیلد :attribute الزامی است",
    "required_if"      => "فیلد :attribute الزامی است.",
    "required_with"    => ":attribute الزامی است زمانی که :values موجود است.",
    "required_with_all"=> ":attribute الزامی است زمانی که :values موجود است.",
    "required_without" => ":attribute الزامی است زمانی که :values موجود نیست.",
    "required_without_all" => ":attribute الزامی است زمانی که :values موجود نیست.",
    "same"             => ":attribute و :other باید مانند هم باشند.",
    "size"             => array(
        "numeric" => ":attribute باید برابر با :size باشد.",
        "file"    => ":attribute باید برابر با :size کیلوبایت باشد.",
        "string"  => ":attribute باید برابر با :size کاراکتر باشد.",
        "array"   => ":attribute باسد شامل :size آیتم باشد.",
    ),
    "timezone"         => "The :attribute must be a valid zone.",
    "unique"           => ":attribute قبلا انتخاب شده است.",
    "url"              => "فرمت آدرس :attribute اشتباه است.",
    "exists_code"      => "کد ارسالی در سیستم وجود ندارد",
    "expire_code"      => "اعتبار کد ارسالی به پایان رسیده است",
    "used"             => "این کد قبلا مورد استفاده قرار گرفته است",
    "exists_phone"     => "چنین شماره ای در سیستم ثبت نشده است",
    'after_or_equal'       => ':attribute باید برابر یا بعد از :date باشد',
    'not_exist'       => 'فیلد :attribute در رابطه دیگری مورد استفاده قرار گرفته است و عملیات مورد نظر انجام نخواهد شد',
    'gt' => [
        'numeric' => 'فیلد :attribute باید بزرگتر از :value باشد'
    ],
    'gte' => [
        'numeric' => 'فیلد :attribute باید بزرگتر مساوی :value باشد'
    ],

    /*
    |--------------------------------------------------------------------------
    | Custom Validation Language Lines
    |--------------------------------------------------------------------------
    |
    | Here you may specify custom validation messages for attributes using the
    | convention "attribute.rule" to name the lines. This makes it quick to
    | specify a specific custom language line for a given attribute rule.
    |
    */

    'custom' => array(
        'shift_pattern.*.end_time.gt' => 'تاریخ پایان باید بعد از تاریخ شروع الگوی شیفت کاری باشد'
    ),

    /*
    |--------------------------------------------------------------------------
    | Custom Validation Attributes
    |--------------------------------------------------------------------------
    |
    | The following language lines are used to swap attribute place-holders
    | with something more reader friendly such as E-Mail Address instead
    | of "email". This simply helps us make messages a little cleaner.
    |
    */
    'attributes' => array(
        "name" => "نام",
        "username" => "نام کاربری",
        "email" => "ایمیل",
        "first_name" => "نام",
        "last_name" => "نام خانوادگی",
        "password" => "رمز عبور",
        "password_confirmation" => "تاییدیه ی رمز عبور",
        "city" => "شهر",
        "country" => "کشور",
        "address" => "نشانی",
        "phone" => "تلفن",
        "mobile" => "تلفن همراه",
        "age" => "سن",
        "sex" => "جنسیت",
        "gender" => "جنسیت",
        "day" => "روز",
        "month" => "ماه",
        "year" => "سال",
        "hour" => "ساعت",
        "minute" => "دقیقه",
        "second" => "ثانیه",
        "title" => "عنوان",
        "text" => "متن",
        "content" => "محتوا",
        "description" => "توضیحات",
        "excerpt" => "گلچین کردن",
        "date" => "تاریخ",
        "time" => "زمان",
        "available" => "موجود",
        "size" => "اندازه",
        "body" => "متن",
        "imageUrl" => "تصویر",
        "videoUrl" => "آدرس ویدیو",
        "slug" => "نامک",
        "tags" => "تگ ها",
        "category" => "دسته",
        "story" => "داستان",
        'number' => 'شماره قسمت',
        'price' => 'قیمت دوره',
        'course_id' => 'دوره مورد نظر',
        'fileUrl' => 'آدرس فایل',
        'enSlug' => 'نامک انگلیسی',
        'percent' => 'درصد',
        'images' => 'تصویر',
        'status' => 'وضعیت',
        'codes' => 'کدهای تامین اجتماعی',
        'job_id' => 'کدشغلی',
        'permissions' => 'دسترسی ها',
        'shift_pattern' => 'الگوی شیفت',
        'holidays'=> 'تعطیلات رسمی تعطیل می باشد',
        'calculate_overtime' => 'محاسبه اضافه کار',
        'calculate_holiday_works' => 'محاسبه تعطیل کاری',
        'calculate_friday_works' => 'محاسبه جمعه کاری',
        'calculate_night_works' => 'محاسبه شب کاری',
        'vacation_day' => 'تعداد روزهای مرخص',
        'vacation_day_period' => 'بازه زمانی',
        'vacation_day_on_holiday' => 'با احتساب روزهای تعطیل',
        'personnel_id' => 'کد پرسنلی',
        'job_shift_id' => 'شیفت شغلی',
        'start_date' => 'تاریخ شروع',
        'apply_date' => 'تاریخ اعمال',
        'jobId' => 'شناسه شغل',
        'insured_rate' => 'درصد سهم بیمه شده',
        'employer_rate' => 'درصد سهم کارفرما',
        'jobless_rate' => 'درصد بیمه بیکاری',
        'hard_job_rate' => 'درصد مشاغل سخت و زیان آور',
        'socialsecuritycode' => 'کد تامین اجتماعی',
        'company_id' => 'شرکت',
        'contract_id' => 'قرارداد',
        'order_column' => 'فیلد مرتب سازی',
        'order_dir' => 'ترتیب',
        'shift_pattern.*.status' => 'وضعیت الگوی شیفت کاری',
        'shift_pattern.*.day_count' => 'تعداد روز الگوی شیفت کاری',
        'shift_pattern.*.start_time' => 'زمان شروع روز الگوی شیفت کاری',
        'shift_pattern.*.end_time' => 'زمان پایان الگوری شیفت کاری',
        'national_number' => 'کد ملی',
        'shift' => 'شیفت کاری',
        'chart_id' => 'کدچارت',
        'chart_detail_id' => 'کد جزيیات چارت',
        'personnel' => 'کد پرسنلی',
        'job_social_security_id' => 'کد تامین اجتماعی',
        'count' => 'تعداد',
        'chartdetail' => 'کد جزییات چارت',
        'chart' => 'چارت',
        'per_page' => 'تعداد در صفحه',
        'chart_details.id' => 'جزییات چارت',
        'chart_details.children.*.id' => 'جزییات چارت'
    )
);
