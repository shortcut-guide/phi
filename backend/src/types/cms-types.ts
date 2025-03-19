type Reference<T, R> = T extends 'get' ? R : string | null;
interface GetsType<T> {
  contents: T[];
  totalCount: number;
  offset: number;
  limit: number;
}
type DateType = {
  createdAt: string;
  updatedAt: string;
  publishedAt: string;
  revisedAt: string;
};
type Structure<T, P> = T extends 'get'
  ? { id: string } & DateType & Required<P>
  : T extends 'gets'
  ? GetsType<{ id: string } & DateType & Required<P>>
  : Partial<DateType> & (T extends 'patch' ? Partial<P> : P);

export type sites<T='get'> = Structure<
T,
{
  /**
   * site name
   */
  title: string
  /**
   * URL
   */
  url: string
  /**
   * HTML Element
   */
  element: string
}>


export interface EndPoints {
  get: {
    'sites': sites<'get'>
  }
  gets: {
    'sites': sites<'gets'>
  }
  post: {
    'sites': sites<'post'>
  }
  put: {
    'sites': sites<'put'>
  }
  patch: {
    'sites': sites<'patch'>
  }
}
