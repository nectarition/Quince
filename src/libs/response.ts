export const getResponseJSON = (obj: unknown) => {
  return new Response(JSON.stringify(obj), {
    headers: {
      'Content-Type': 'application/json',
    },
  });
};
