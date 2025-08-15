export type PaypalLoginOptions = {
  lang?: string;
  successPath?: string;
  cancelPath?: string;
  authPath?: string;
  clientId?: string;
  scope?: string;
  stateExtra?: Record<string, string | number | boolean>;
  source?: string;
};

export type PaypalLoginResult = {
  url: string;
};