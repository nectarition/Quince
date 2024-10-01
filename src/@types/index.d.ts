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
}
export type PearEventDocument = PearEvent & {
  id: string;
};
export type PearEventAppModel = PearEventDocument & {
  venue: PearVenueDocument;
};
export type PearEventDbModel = PearEventDocument & {
  venue: FirebaseFirestore.DocumentReference<PearVenueDocument>;
};

export interface PearEventLink {
  name: string;
  url: string;
  limit: number | null;
}
export type PearEventLinkDocument = PearEventLink & {
  id: string;
};
export type PearEventLinkAppModel = PearEventLinkDocument & {
  event: PearEventDocument;
};
export type PearEventLinkDbModel = PearEventLinkDocument & {
  event: FirebaseFirestore.DocumentReference<PearEventDocument>;
};

export interface PearVenue {
  name: string;
  postalCode: string;
  address: string;
}
type PearVenueDocument = PearVenue & {
  id: string;
};
export type PearVenueDbModel = PearVenueDocument;
export type PearVenueAppModel = PearVenueDocument;
