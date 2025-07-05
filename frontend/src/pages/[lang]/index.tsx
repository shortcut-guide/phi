import DefaultLayout from '@/f/layouts/DefaultLayout';
import IndexPage from '@/f/components/IndexPage'; // 拡張子.tsxはimportに不要

const Home = () => (
  <DefaultLayout title="Phis">
    <IndexPage />
  </DefaultLayout>
);

export default Home;
