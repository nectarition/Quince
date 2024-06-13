import dayjs from 'dayjs';
import ja from 'dayjs/locale/ja';

dayjs.locale(ja);

const format = (date: number, format: string): string => dayjs(date).format(format);

const getSpan = (date1: number, date2: number): number => {
  return date1 - date2;
};

export default {
  format,
  getSpan,
};
