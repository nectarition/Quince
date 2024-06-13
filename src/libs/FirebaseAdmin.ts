import admin from 'firebase-admin';

const serviceAccountJSON = import.meta.env.GOOGLE_SERVICE_ACCOUNT_CREDENTIAL_JSON;
const serviceAccountCredential = JSON.parse(serviceAccountJSON);

export const getFirebaseAdmin = () => {
  const app = admin.apps[0];
  if (app) return app;
  return admin.initializeApp({
    credential: admin.credential.cert(serviceAccountCredential),
  });
};
