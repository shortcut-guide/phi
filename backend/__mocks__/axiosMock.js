import { jest } from '@jest/globals';

export const mockPost = jest.fn();

export const axiosMock = async () => {
  jest.unstable_mockModule('axios', () => ({
    default: {
      post: mockPost, // axios.post をモック
    },
  }));

  const axios = (await import('axios')).default;
  return axios;
};