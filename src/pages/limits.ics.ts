import ics, { type ICalEventData } from 'ical-generator';
import eventLib from '../libs/event';
import dateLib from '../libs/date';

export const GET = async () => {
  const fetchedEvents = await eventLib.getEventsAsync();
  const fetchedLinks = await eventLib.getLinksAsync();

  const events = Object.entries(fetchedLinks)
    .map(([eventId, links]) => {
      const event = fetchedEvents.find((e) => e.id === eventId);
      if (!event) {
        throw new Error('event not found');
      }

      const eventDate = dateLib.format(event.date, 'YYYY/M/D');
      const baseDescriptions = ['-----', '', `https://vo.nrsy.jp`];

      return links
        .filter((link) => link.limit)
        .sort((a, b) => (a.limit ?? Number.MIN_SAFE_INTEGER) - (b.limit ?? Number.MAX_SAFE_INTEGER))
        .reduce((p, c) => {
          if (!c.limit) return p;
          const limitDate = new Date(c.limit);
          const descriptions = [`${event.name} (${eventDate} 開催)`, `リンク: ${c.url}`, ...baseDescriptions];

          return [
            ...p,
            {
              summary: `〆 ${event.name} ${c.name}`,
              description: descriptions.join('\n'),
              url: c.url,
              start: new Date(limitDate.getUTCFullYear(), limitDate.getUTCMonth(), limitDate.getUTCDate()),
              end: new Date(limitDate.getUTCFullYear(), limitDate.getUTCMonth(), limitDate.getUTCDate()),
              allDay: true,
            },
          ];
        }, [] as ICalEventData[]);
    })
    .flat();

  const cal = ics({
    name: `音声合成系イベント 締め切りカレンダー`,
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
