import { SearchBar as SearchBarComponent } from '@/f/components/search/SearchBar';

type Props = {
  lang: string;
}
export default function SearchBar({ lang }: Props) {
  return <SearchBarComponent lang={lang} />;
}