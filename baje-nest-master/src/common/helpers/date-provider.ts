import * as moment from "moment/moment";

export class DateProvider {

  static today(): string {
    return moment(new Date()).utc(true).format('YYYY/MM/DD HH:mm:ss');
  }

  static todayDate(): Date {
    return new Date(moment(new Date()).utc(true).format('YYYY/MM/DD HH:mm:ss'));
  }

  static dateToString(date: Date) {
    return moment(date).utc(true).format('YYYY/MM/DD HH:mm:ss');
  }
}
