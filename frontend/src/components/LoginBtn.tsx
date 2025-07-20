import PaypalLogin from '@/f/components/LoginBtnReact';

type Props = {
  lang: string;
};

const clientId = process.env.PUBLIC_PAYPAL_CLIENT_ID;

const PaypalLoginWrapper = ({lang}:{lang:string}) => {
  return <PaypalLogin clientId={clientId} lang={lang} />;
};

export default PaypalLoginWrapper;
