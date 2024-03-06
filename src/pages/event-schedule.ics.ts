import ics, { type EventAttributes } from 'ics'
import eventLib from '../libs/event'

export const GET = async () => {

  const fetchedEvents = await eventLib.getEventsAsync();
  const events = fetchedEvents
    .map<EventAttributes>(e => {
      const date = e.date
      const description = [
        `ジャンル: ${eventLib.convertGenre(e.genreType)}`,
        `イベント種類: ${eventLib.convertEventType(e.eventType).name}`,
        ...(e.remarks && [
          '---',
          e.remarks
        ])
      ].join('\n')

      return {
        title: `${e.place.prefecture}: ${e.name}`,
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
          date.getDate()
        ],
        startInputType: 'utc',
        startOutputType: 'local',
        endInputType: 'utc',
        endOutputType: 'local',
        organizer: {
          name: e.organizer.name
        }
      }
    })

  const { error: _, value } = ics.createEvents(events)

  return new Response(
    value, {
    headers: {
      "Content-Type": "text/plain; charset=UTF-8"
    }
  })
}
