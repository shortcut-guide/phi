import PictureImage from "@/f/components/PictureImage";

interface Props extends React.AnchorHTMLAttributes<HTMLAnchorElement> {
  alt?: string;
  width?: number;
  height?: number;
  className?: string;
}

const LogoLink: React.FC<Props> = (props) => {
  return (
    <a href="/" {...props}>
      <PictureImage src="/assets/img/phis_logo.svg" className="w-full" />
    </a>
  );
};

export default LogoLink;
