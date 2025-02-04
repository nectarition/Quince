import { getResponseJSON } from 'src/libs/response';

export const apiVersion = '2025-02-04';

export const GET = async () => {
  return getResponseJSON({
    message: 'Hello world. Welcome to Quince API!',
    version: apiVersion,
  });
};
