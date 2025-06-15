const faValue = {
  female: "زن",
  male: "مرد",
  iranian: "ایرانی",
  non_iranian: "غیر ایرانی",
  single: "مجرد",
  married: "متاهل",
  unknown: "نامشخص",
  army_done: "پایان خدمت",
  medical: "معافیت پزشکی",
  sponsorship: "معافیت کفالت",
  educational: "معافیت تحصیلی",
  none: "خدمت نکرده",
  illiterate: "بیسواد",
  school: "تحصیلات ابتدایی",
  middle_school: "سیکل",
  high_school: "دیپلم",
  bachelor: "لیسانس",
  master: "فوق لیسانس",
  doctorate: "دکترا",
  operational: "عملیاتی",
  nonoperational: "ستادی",
  active: "فعال",
  inactive: "غیر فعال",
  retire: "بازنشستگی",
  quit: "ترک کار",
  redundant: "تعلیق",
  dismiss: "اخراج",
  dead: "فوت",
  purchased: "خرید خدمت",
  special: "موارد خاص",
  none: "نمی باشد",
  child_of: "فرزند شهید",
  wife_of: "همسر شهید",
  veteran: "جانباز",
  fighting: "رزمنده",
  noble: "ازاده",
  in_progress: "در حال خدمت",
};

export const handleValue = (value) => {
  if (faValue.hasOwnProperty(value)) {
    return faValue[value];
  } else {
    return value;
  }
};
