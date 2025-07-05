import PaypalLogin from '@/f/components/LoginBtnReact';

const clientId = process.env.PUBLIC_PAYPAL_CLIENT_ID;

const PaypalLoginWrapper = () => {
  return <PaypalLogin clientId={clientId} />;
};

export default PaypalLoginWrapper;
