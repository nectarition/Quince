import event from 'src/libs/event';
import { getResponseJSON } from '../../../libs/response';

export const GET = async () => {
  const events = await event.getEventsAsync();
  const filteredEvents = events.filter((e) => e.date);
  return getResponseJSON(
    filteredEvents.map((e) => ({
      id: e.id,
      name: e.name,
      date: e.date,
      type: e.type,
      websiteURL: e.websiteURL,
      venueName: e.venue.name,
      roomName: e.roomName,
    })),
  );
};
