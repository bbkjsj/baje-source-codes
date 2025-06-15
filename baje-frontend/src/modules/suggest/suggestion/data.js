const sample = {
  points: [
    {
      id: 1,
      sender_id: 900,
      sender_position_title: "پیشنهاد دهنده",
      sender_name: "دانیال حمزه نژادی",
      body: "کاهش هزینه های مربوط به قطعات فرسوده",
      type: "مزیت",
      datetime: "2021-01-26 18:27:00",
    },
  ],
  comments: [
    {
      id: 1,
      subject_id: 2,
      sender_id: 905,
      sender_name: "علیرضا رحمانی",
      sender_position_title: "دبیر کارگروه عالی",
      body: "هیچ کدام از رویه های نظام بررسی در این مزیت وجود ندارد",
      datetime: "2021-01-21 11:38:00",
    },
  ],
  reactions: [
    {
      id: 1,
      subject_type: "point",
      subject_id: 2,
      sender_id: 905,
      sender_name: "علیرضا رحمانی",
      sender_position_title: "دبیر کارگروه عالی",
      type: "موافق",
      datetime: "2021-01-21 11:38:00",
    },
    {
      id: 2,
      subject_type: "comment",
      subject_id: 1,
      sender_id: 900,
      sender_name: "دانیال حمزه نژادی",
      sender_position_title: "پیشنهاد دهنده",
      type: "مخالف",
      datetime: "2021-01-21 11:38:00",
    },
  ],
};
