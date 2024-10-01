import ics, { type ICalEventData } from 'ical-generator';
import eventLib from '../libs/event';
import siteConfig from '../config';

export const GET = async () => {
  const fetchedEvents = await eventLib.getEventsAsync();
  const fetchedLinks = await eventLib.getLinksAsync();

  const events = Object.entries(fetchedLinks)
    .map(([eventId, links]) => {
      const event = fetchedEvents.find((e) => e.id === eventId);
      if (!event) {
        throw new Error('event not found');
      }

      return links
        .filter((link) => link.limit)
        .reduce((p, c) => {
          if (!c.limit) return p;
          const limitDate = new Date(c.limit);
          return [
            ...p,
            {
              summary: `〆 ${c.name} (${event.name})`,
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
    name: `締め切り (${siteConfig.siteName})`,
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
