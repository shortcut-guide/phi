export type Pins = {
  lang: string;
  page: number,
  items: any[],
  t: {
    title: string;
    ogTitle: string;
    description: string;
    ogDescription: string;
  };
  fetchError?: string;
};