import ics, { type ICalEventData } from 'ical-generator';
import eventLib from '../libs/event';
import siteConfig from '../config';

export const GET = async () => {
  const fetchedEvents = await eventLib.getEventsAsync();

  const events = fetchedEvents.map<ICalEventData>((e) => {
    const date = new Date(e.date);
    const pref = eventLib.getPrefecture(e.venue.address);
    const description = [
      ...(e.subEvents.length > 0 ? ['開催イベント', ...e.subEvents.map((se) => `・${se.name}`)] : []),
      `Webサイト: ${e.websiteURL}`,
      `ジャンル: ${eventLib.convertGenre(e.genre)}`,
      `イベント種類: ${eventLib.convertEventType(e.type).name}`,
      `運営: ${e.organizer.name}`,
      ...(e.remarks ? [`備考: ${e.remarks}`] : []),
      '-----',
      '',
      `https://vo.nrsy.jp`,
    ].join('\n');

    return {
      summary: `${pref}: ${e.name}`,
      description,
      location: `${e.venue.name}${e.roomName && ` ${e.roomName}`}`,
      url: e.websiteURL,
      start: new Date(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate()),
      end: new Date(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate()),
      allDay: true,
    };
  });

  const cal = ics({
    name: siteConfig.siteName,
    timezone: 'Asia/Tokyo',
    events,
  });

  return new Response(cal.toString(), {
    headers: {
      // 'Content-Type': 'text/plain',
      'Content-Type': 'text/calendar',
    },
  });
};
