export type QuinceEvent = {
  name: string;
  genreType: string;
  eventType: string;
  date: Date;
  place: {
    name: string;
    prefecture: string;
    address: string;
    postalCode: string;
  }
  remarks: string;
  websiteURL: string;
  organizer: {
    name: string;
  }
};
