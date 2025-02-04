import { getResponseJSON } from '../../../../libs/response';
import event from '../../../../libs/event';
import type { APIRoute } from 'astro';

export const GET: APIRoute = async ({ props }) => {
  const filteredEvent = {
    id: props.data.id,
    name: props.data.name,
    date: props.data.date,
    type: props.data.type,
    websiteURL: props.data.websiteURL,
    venueName: props.data.venue.name,
    roomName: props.data.roomName,
  };
  return getResponseJSON(filteredEvent);
};

export const getStaticPaths = async () => {
  const events = await event.getEventsAsync();
  return events.map((e) => ({ params: { slug: e.id }, props: { data: e } }));
};
