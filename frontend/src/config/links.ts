import puppeteer from 'puppeteer';
export const links = {
  assets:{
    logo: "/assets/phis_logo",
    searchingBar: "/assets/searching-bar",
    sale: "/assets/sale",
    new: "/assets/new",
    message: "/assets/message",
    option: "/assets/option"
  },
  url:{
    home: "/",
    page: "/page/",
    dashboard: "/dashboard",
    pinCreationTool: "/pin-creation-tool",
    releases: "/releases",
    messages: "/messages",
    settings: "/settings",
    address:{
      edit: "/settings/address/edit",
      new: "/settings/address/new"
    },
    product: "/product/",
    paypal:{
      sandbox: "https://www.sandbox.paypal.com/signin/authorize"
    },
    edit: "/edit",
    api: {
      products: "/products/",
      profile: "/api/profile",
      puppeteer:{
        data: "/api/puppeteer/data",
        delete: "/api/puppeteer/delete"
      }
    }
  }
}
