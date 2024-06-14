import { getFirebaseAdmin } from './FirebaseAdmin';
import { eventConverter, venueConverter } from './converters';
import type { PearEventViewModel, PearVenueDbModel } from '@types';

const admin = getFirebaseAdmin();
const db = admin.firestore();

const getEventsAsync = async (): Promise<PearEventViewModel[]> => {
  const eventDocs = await db.collection('events').withConverter(eventConverter).get();
  const events = eventDocs.docs
    .filter((e) => e.exists)
    .map((e) => e.data())
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

  return events.map<PearEventViewModel>((e) => {
    const venue = fetchedVenues[e.venue.id];
    return {
      ...e,
      venue,
    };
  });
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

const convertPostalCode = (rawPostalCode: string): string => {
  const code = rawPostalCode.match(/^([0-9]{3})([0-9]{4})$/);
  if (!code) return '';
  return `${code[1]}-${code[2]}`;
};

const getPrefecture = (rawAddress: string): string => {
  const pref = rawAddress.match(/^(.{2,3})[都道府県]/);
  if (!pref) return '';
  return pref[1];
};

export default {
  getEventsAsync,
  convertGenre,
  convertPostalCode,
  convertEventType,
  getPrefecture,
};
