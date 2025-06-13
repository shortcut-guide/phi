export interface ImgurResponse {
  success: boolean;
  data: {
    link: string;
    [key: string]: any;
  };
  [key: string]: any;
}