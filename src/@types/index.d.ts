export interface PearEvent {
  name: string;
  date: number;
  type: string;
  genre: string;
  websiteURL: string;
  remarks: string | null;
  roomName: string;
  order: number;
  organizer: {
    name: string;
  };
  links: {
    name: string;
    url: string;
    limit?: number;
  }[];
}

export type PearEventDocument = PearEvent & {
  id: string;
};
export type PearEventViewModel = PearEventDocument & {
  venue: PearVenue;
};
export type PearEventDbModel = PearEventDocument & {
  venue: FirebaseFirestore.DocumentReference<PearVenue>;
};

export interface PearVenue {
  name: string;
  postalCode: string;
  address: string;
}
export type PearVenueDbModel = PearVenue & {
  id: string;
};
