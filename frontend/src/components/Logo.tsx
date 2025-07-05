---
import PictureImage from "@/f/components/PictureImage.astro";

interface Props {
  alt?: string
  width?: number
  height?: number
  class?: string
}

const { ...props } = Astro.props;
---
<a href="/" {...props}>
  <PictureImage src="/assets/img/phis_logo.svg" class="w-full" />
</a>