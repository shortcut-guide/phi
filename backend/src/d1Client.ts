export const fetchToken = async () => {
  const res = await fetch(BASE_URL);
  return await res.json();
};

export const saveToken = async (data: {
  access_token: string;
  refresh_token: string;
  expires_at: number;
}) => {
  await fetch(BASE_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
};

export const updateToken = async (data: {
  access_token: string;
  refresh_token: string;
  expires_at: number;
}) => {
  await fetch(BASE_URL, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
};

export const deleteToken = async () => {
  await fetch(BASE_URL, { method: 'DELETE' });
};