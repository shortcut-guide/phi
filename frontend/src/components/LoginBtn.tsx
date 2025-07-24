import PaypalLogin from '@/f/components/LoginPaypal';

type Props = {
  lang: string;
  onLoginSuccess?: (user: any) => void;
};

const PaypalLoginWrapper = ({ lang, onLoginSuccess }: Props) => {
  return <PaypalLogin lang={lang} onLoginSuccess={onLoginSuccess} />;
};

export default PaypalLoginWrapper;
