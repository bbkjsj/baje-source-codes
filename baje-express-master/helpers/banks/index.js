
module.exports.bankName = ((id) => { 
    switch(Number(id)) { 
        case 1:
            return 'صندوق شجره';
        case 2:
            return 'صادرات';
        case 3:
            return 'پارسیان';
        case 4:
            return 'توسعه صادرات ایران'
        case 5:
            return 'ملی'
        case 6:
            return 'ملت'
        case 7:
            return 'دی'
        case 8:
            return 'مسکن'
        case 9:
            return 'دی'
        case 10:
            return 'اقتصاد نوین'
        case 11:
            return 'سامان'
        case 12:
            return 'پاسارگاد'
        case 13:
            return 'سپه'
        case 14:
            return 'انصار'
        case 15:
            return 'صنعت و معدن'
        case 16:
            return 'آینده'
        case 17:
            return 'تجارت'
        case 18:
            return 'کشاورزی'
        case 19:
            return 'کارآفرین'
        case 20:
            return 'سرمایه'
        case 21:
            return 'گردشگری'
        case 22:
            return 'قوامین'
        case 23:
            return 'حکمت ایرانیان'
        case 24:
            return 'توسعه تعاون'
        case 25:
            return 'رفاه کارگران'
        case 26:
            return 'سینا'
        case 27:
            return 'موسسه اعتباری توسعه'
        case 28:
            return 'پست بانک'
        case 29:
            return 'قرض الحسنه رسالت'
        case 30:
            return 'ایران زمین'
        case 31:
            return 'قرض الحسنه مهر ایران'
        case 32:
            return 'خاورمیانه'
        case 33:
            return 'مرکزی'
        case 34:
            return 'ملل'
        case 35:
            return 'کوثر'
        case 36:
            return 'مهر اقتصاد'
        case 37:
            return 'موسسه اعتباری نور'
        default:
            return 'بانک نامعتبر'
    }
})