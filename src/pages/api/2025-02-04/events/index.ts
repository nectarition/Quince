import event from 'src/libs/event';
import { getResponseJSON } from '../../../../libs/response';

export const GET = async () => {
  const events = await event.getEventsAsync();
  const filteredEvents = events.filter((e) => e.date);
  return getResponseJSON(
    filteredEvents.map((e) => ({
      id: e.id,
      name: e.name,
      date: e.date,
      type: e.type,
      genre: e.genre,
      websiteURL: e.websiteURL,
      remarks: e.remarks,
      venue: e.venue,
      roomName: e.roomName,
      organizer: e.organizer,
      subEvents: e.subEvents.map((se) => ({
        name: se.name,
        genre: se.genre,
        url: se.url,
      })),
    })),
  );
};
