export type QuinceEvent = {
  name: string;
  genreType: QuinceEventGenreTypes;
  date: Date;
  place: {
    name: string;
    address: string;
    postalCode: string;
  }
  remarks: string;
  websiteURL: string;
}
