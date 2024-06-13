import type { PearEventDbModel, PearVenueDbModel } from '@types';
import type { FirestoreDataConverter, QueryDocumentSnapshot } from 'firebase-admin/firestore';

export const eventConverter: FirestoreDataConverter<PearEventDbModel> = {
  toFirestore: () => ({}),
  fromFirestore: (snapshot: QueryDocumentSnapshot): PearEventDbModel => {
    const eventDoc = snapshot.data();
    return {
      id: snapshot.id,
      name: eventDoc.name,
      date: eventDoc.date,
      type: eventDoc.type,
      genre: eventDoc.genre,
      websiteURL: eventDoc.websiteURL,
      remarks: eventDoc.remarks,
      venue: eventDoc.venue,
      roomName: eventDoc.roomName,
      order: eventDoc.order,
      organizer: {
        name: eventDoc.organizer.name,
      },
      links: eventDoc.links,
    };
  },
};

export const venueConverter: FirestoreDataConverter<PearVenueDbModel> = {
  toFirestore: () => ({}),
  fromFirestore: (snapshot: QueryDocumentSnapshot) => {
    const venueDoc = snapshot.data();
    return {
      id: snapshot.id,
      name: venueDoc.name,
      postalCode: venueDoc.postalCode,
      address: venueDoc.address,
    };
  },
};
