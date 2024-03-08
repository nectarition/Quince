import dayjs from 'dayjs';
import ja from 'dayjs/locale/ja';

dayjs.locale(ja);

const format = (date: Date, format: string): string => dayjs(date).format(format);

const getSpan = (date1: Date, date2: Date): number => {
  return date1.getTime() - date2.getTime();
};

export default {
  format,
  getSpan,
};
