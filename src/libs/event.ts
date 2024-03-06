import { promises as fs } from "fs";
import { type QuinceEvent } from "@types";

const getEventsAsync = async (): Promise<QuinceEvent[]> => {
  const url = new URL("../../assets/event-source.tsv", import.meta.url);
  const rawEvents = await fs.readFile(url, 'utf-8');
  const eventLines = rawEvents.split('\n');

  const events = eventLines
    .slice(1)
    .filter(e => e)
    .map<QuinceEvent>(e => {
      const event = e.split('\t')
      return {
        name: event[0],
        genreType: event[1],
        date: new Date(event[2]),
        place: {
          prefecture: event[3],
          name: event[4],
          postalCode: event[5],
          address: event[6]
        },
        remarks: event[7],
        websiteURL: event[8],
        organizer: {
          name: event[9]
        },
        eventType: event[10]
      }
    })

  return events;
}

const convertGenre = (genreType: string): string => {
  if (genreType === 'all-genre') {
    return '音声合成オールジャンル'
  }

  return genreType
}

const convertEventType = (eventType: string): { name: string; color: string; } => {
  if (eventType === 'fanzine') {
    return {
      name: '同人誌即売会',
      color: '#d54c00'
    }
  }
  else if (eventType === 'djclub') {
    return {
      name: 'DJクラブイベント',
      color: '#603885'
    }
  }

  return {
    name: eventType,
    color: '#404040',
  }
}

const convertPostalCode = (rawPostalCode: string): string => {
  const code = rawPostalCode.match(/^([0-9]{3})([0-9]{4})$/)
  if (!code) return ''
  return `${code[1]}-${code[2]}`
}

export default {
  getEventsAsync,
  convertGenre,
  convertPostalCode,
  convertEventType
}
