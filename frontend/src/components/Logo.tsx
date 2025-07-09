import PictureImage from "@/f/components/PictureImage";
import { links } from "@/f/config/links";
import { getLangObj } from "@/f/utils/getLangObj";

interface Props extends React.AnchorHTMLAttributes<HTMLAnchorElement> {
  alt?: string;
  width?: number;
  height?: number;
  className?: string;
}

const LogoLink: React.FC<Props> = (props) => {
  const asset = getLangObj<typeof links.assets>(links.assets);
  const url = getLangObj<typeof links.url>(links.url);
  return (
    <a href={url.home} {...props}>
      <PictureImage src={asset.logo} className="w-full" />
    </a>
  );
};

export default LogoLink;
