import ics, { ICalEvent, type ICalEventData } from 'ical-generator'
import eventLib from '../libs/event'
import siteConfig from '../config'

export const GET = async () => {

  const fetchedEvents = await eventLib.getEventsAsync();
  const events = fetchedEvents
    .map<ICalEventData>(e => {
      const date = e.date
      const pref = eventLib.getPrefecture(e.place.address)
      const description = [
        `ジャンル: ${eventLib.convertGenre(e.genreType)}`,
        `イベント種類: ${eventLib.convertEventType(e.eventType).name}`,
        `運営: ${e.organizer.name}`,
        ...(e.remarks && [
          '---',
          e.remarks
        ])
      ].join('\n')

      return {
        summary: `${pref}: ${e.name}`,
        description,
        location: e.place.name,
        url: e.websiteURL,
        start: new Date(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate()),
        end: new Date(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate() + 1),
        allday: true,
      }
    })


  const cal = ics({
    name: siteConfig.siteName,
    timezone: 'Asia/Tokyo',
    events
  })

  return new Response(
    cal.toString(), {
    headers: {
      "Content-Type": "text/calendar"
    }
  })
}
