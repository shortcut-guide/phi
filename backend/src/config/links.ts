const paypalApi = process.env.PAYPAL_API_URL;
export const links = {
    url:{
        paypalCard: "https://www.paypal.com/myaccount/money/cards",
        paypalAddress: "https://www.paypal.com/myaccount/settings/address",
        paypalSuccess: "/paypal/success",
        paypalCancel: "/paypal/cancel",
        paypalToken: paypalApi+"/v1/oauth2/token",
        paypalOrder: paypalApi+"/v2/checkout/orders",
        paypalUserInfo: paypalApi+"/v1/identity/oauth2/userinfo?schema=paypalv1.1",
    }
}