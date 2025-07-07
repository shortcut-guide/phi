export default {
  async redirects() {
    return [
      {
        source: '/:lang/page/1',
        destination: '/:lang',
        permanent: false,
      },
    ];
  },
};