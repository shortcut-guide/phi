import { messages } from "@/f/config/messageConfig";
import { links } from "@/f/config/links";
import { getLangObj } from "@/f/utils/getLangObj";
import Picture from "@/f/components/PictureImage";
import Logo from '@/f/components/Logo';

const MainNavigation = ({ lang }: { lang: string }) =>{
  const t = getLangObj(messages.nav, lang);
  const alt = getLangObj(messages.alt, lang);
  const asset = getLangObj<typeof links.assets>(links.assets);
  const url = getLangObj<typeof links.url>(links.url);

  return(
    <div id="main-navigation">
      <nav id="vertical-nav" className="fixed bottom-0 left-0 flex w-full h-[30px] border-t border-gray-200 bg-white z-50">
        <div className="w-full h-full flex items-center justify-between px-4">
          <div className="w-full h-[20px] flex items-center flex-col box-border">
            <ul className="w-full h-full flex flex-row justify-around items-center gap-2">
              <li className="h-full">
                <Logo alt="phi admin" className="h-full text-gray-600 group-focus:text-gray-800 invert" />
              </li>
              <li className="h-full">
                <a href={url.search} aria-label={t.search} className="h-full border-none hover:bg-gray-100 focus:outline-none focus:bg-gray-200">
                  <Picture src={asset.searchingBar} alt={alt.search} className="w-full h-full object-contain" />
                </a>
              </li>
              <li className="h-full">
                <a href={url.sale} aria-label={t.sale} className="h-full border-none hover:bg-gray-100 focus:outline-none focus:bg-gray-200">
                  <Picture src={asset.sale} alt={alt.sale} className="w-full h-full object-contain" />
                </a>
              </li>
              <li className="h-full">
                <a href={url.messages} aria-label={t.message} className="h-full border-none hover:bg-gray-100 focus:outline-none focus:bg-gray-200">
                  <Picture src={asset.message} alt={alt.message} className="w-full h-full object-contain" />
                </a>
              </li>
              <li className="h-full">
                <a href={url.cart} aria-label={t.cart} className="h-full border-none hover:bg-gray-100 focus:outline-none focus:bg-gray-200">
                  <Picture src={asset.cart} alt={alt.cart} className="w-full h-full object-contain" />
                </a>
              </li>
              <li className="h-full">
                <a href={url.settings} aria-label={t.option} className="h-full border-none hover:bg-gray-100 focus:outline-none focus:bg-gray-200">
                  <Picture src={asset.option} alt={alt.option} className="w-full h-full object-contain" />
                </a>
              </li>
            </ul>
          </div>
        </div>
      </nav>
    </div>
  );
};

export default MainNavigation;
