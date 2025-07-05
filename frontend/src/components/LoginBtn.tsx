---
import PaypalLogin from '@/f/components/LoginBtnReact.tsx';
const clientId = import.meta.env.PUBLIC_PAYPAL_CLIENT_ID;
---

<PaypalLogin client:only="react" />