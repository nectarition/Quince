import { getFirebaseAdmin } from './FirebaseAdmin';
import { eventConverter, eventLinkConverter, venueConverter } from './converters';
import type { PearEventAppModel, PearEventLink, PearVenueDbModel } from '@types';

const admin = getFirebaseAdmin();
const db = admin.firestore();

const getEventsAsync = async (): Promise<PearEventAppModel[]> => {
  const eventDocs = await db.collection('events').withConverter(eventConverter).get();
  const events = eventDocs.docs
    .filter((e) => e.exists)
    .map((e) => e.data())
    .filter((e) => e.isPublic)
    .sort((a, b) => a.order - b.order)
    .sort((a, b) => a.date - b.date);
  if (events.length === 0) return [];

  const venueIds = [...new Set(events.map((e) => e.venue.id))];
  const fetchedVenues = await Promise.all(
    venueIds.map(async (id) => ({
      id,
      data: await getVenueAsync(id),
    })),
  ).then((venues) => venues.reduce<Record<string, PearVenueDbModel>>((p, c) => ({ ...p, [c.id]: c.data }), {}));

  return events.map<PearEventAppModel>((e) => {
    const venue = fetchedVenues[e.venue.id];
    return {
      ...e,
      venue,
    };
  });
};

const getLinksAsync = async (): Promise<Record<string, PearEventLink[]>> => {
  const links = await db.collection('eventLinks').withConverter(eventLinkConverter).get();
  const linkDocs = links.docs.map((l) => l.data());
  if (linkDocs.length === 0) return {};

  const eventIds = [...new Set(linkDocs.map((l) => l.event.id))];
  return eventIds
    .map((id) => {
      const links = linkDocs.filter((l) => l.event.id === id);
      return { id, links };
    })
    .reduce<Record<string, PearEventLink[]>>((p, c) => ({ ...p, [c.id]: c.links }), {});
};

const getVenueAsync = async (venueId: string): Promise<PearVenueDbModel> => {
  const venueDoc = await db.doc(`venues/${venueId}`).withConverter(venueConverter).get();
  const venue = venueDoc.data();
  if (!venue) {
    throw new Error('venue not found');
  }
  return venue;
};

const convertGenre = (genreType: string): string => {
  if (genreType === 'all-genre') {
    return '音声合成オールジャンル';
  }
  return genreType;
};

const convertEventType = (eventType: string): { name: string; color: string } => {
  if (eventType === 'fanzine') {
    return {
      name: '同人誌即売会',
      color: '#d54c00',
    };
  } else if (eventType === 'djclub') {
    return {
      name: 'DJクラブイベント',
      color: '#603885',
    };
  } else if (eventType === 'special') {
    return {
      name: '特別イベント',
      color: '#2d8965',
    };
  }

  return {
    name: eventType,
    color: '#404040',
  };
};

const convertEventTypeShorten = (eventType: string): { name: string; color: string } => {
  if (eventType === 'fanzine') {
    return {
      name: '即売会',
      color: '#d54c00',
    };
  } else if (eventType === 'djclub') {
    return {
      name: 'クラブ',
      color: '#603885',
    };
  } else if (eventType === 'special') {
    return {
      name: '特別',
      color: '#2d8965',
    };
  }

  return {
    name: eventType,
    color: '#404040',
  };
};

const convertPostalCode = (rawPostalCode: string): string => {
  const code = rawPostalCode.match(/^([0-9]{3})([0-9]{4})$/);
  if (!code) return '';
  return `${code[1]}-${code[2]}`;
};

const getPrefecture = (rawAddress: string): string => {
  const pref = rawAddress.match(/^(.{2,3})[都道府県]/);
  if (!pref) return '';
  const prefName = pref[1];
  if (prefName === '北海') return '北海道';
  return prefName;
};

export default {
  getEventsAsync,
  getLinksAsync,
  convertGenre,
  convertPostalCode,
  convertEventType,
  convertEventTypeShorten,
  getPrefecture,
};
