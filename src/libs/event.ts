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
          name: event[3],
          postalCode: event[4],
          address: event[5]
        },
        remarks: event[6],
        websiteURL: event[7]
      }
    })

  return events;
}

const convertGenre = (genreType: string): string => {
  if (genreType === 'all-genre') {
    return 'オールジャンル'
  }

  return genreType
}

export default {
  getEventsAsync,
  convertGenre
}
