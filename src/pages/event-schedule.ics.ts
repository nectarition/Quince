import ics, { type EventAttributes } from 'ics'
import eventLib from '../libs/event'

export const GET = async () => {

  const fetchedEvents = await eventLib.getEventsAsync();
  const events = fetchedEvents
    .map<EventAttributes>(e => {
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
        title: `${pref}: ${e.name}`,
        description,
        location: e.place.name,
        url: e.websiteURL,
        start: [
          date.getFullYear(),
          date.getMonth() + 1,
          date.getDate()
        ],
        end: [
          date.getFullYear(),
          date.getMonth() + 1,
          date.getDate() + 1
        ],
        startInputType: 'local',
        startOutputType: 'utc',
        endInputType: 'local',
        endOutputType: 'utc'
      }
    })

  const { error: _, value } = ics.createEvents(events)

  return new Response(
    value, {
    headers: {
      "Content-Type": "text/plain"
    }
  })
}
