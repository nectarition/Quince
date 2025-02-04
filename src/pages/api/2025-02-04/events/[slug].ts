import { getResponseJSON } from '../../../../libs/response';
import event from '../../../../libs/event';
import type { APIRoute } from 'astro';
import type { PearSubEvent } from '@types';

export const GET: APIRoute = async ({ props }) => {
  const filteredEvent = {
    id: props.data.id,
    name: props.data.name,
    date: props.data.date,
    type: props.data.type,
    genre: props.data.genre,
    websiteURL: props.data.websiteURL,
    remarks: props.data.remarks,
    venue: props.data.venue,
    roomName: props.data.roomName,
    organizer: props.data.organizer,
    subEvents: props.data.subEvents.map((se: PearSubEvent) => ({
      name: se.name,
      genre: se.genre,
      url: se.url,
    })),
  };
  return getResponseJSON(filteredEvent);
};

export const getStaticPaths = async () => {
  const events = await event.getEventsAsync();
  return events.map((e) => ({ params: { slug: e.id }, props: { data: e } }));
};
