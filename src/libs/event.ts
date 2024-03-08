import { promises as fs } from 'fs';
import { type QuinceEvent } from '@types';

const getEventsAsync = async (): Promise<QuinceEvent[]> => {
  const url = new URL('../../assets/event-source.json', import.meta.url);
  const rawEvents = await fs.readFile(url, 'utf-8');
  const eventLines = JSON.parse(rawEvents) as QuinceEvent[];
  const events = eventLines.map<QuinceEvent>((e) => ({
    ...e,
    date: new Date(e.date),
    links: e.links?.map((l) => ({
      ...l,
      limit: l.limit && new Date(l.limit),
    })),
  }));
  return events;
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
  const pref = rawAddress.match(/^(.+)[都道府県]/);
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
