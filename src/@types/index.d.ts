export type QuinceEvent = {
  name: string;
  genreType: string;
  eventType: string;
  date: Date;
  place: {
    name: string;
    address: string;
    postalCode: string;
  }
  remarks: string;
  websiteURL: string;
  organizer: {
    name: string;
  }
  links?: {
    name: string;
    url: string;
    limit?: Date;
  }[]
};
