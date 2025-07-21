import PaypalLogin from '@/f/components/LoginBtnReact';

type Props = {
  lang: string;
};

const PaypalLoginWrapper = ({lang}:{lang:string}) => {
  return <PaypalLogin lang={lang} />;
};

export default PaypalLoginWrapper;
