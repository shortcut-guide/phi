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
      <nav id="vertical-nav" className="fixed flex flex-col w-[15%] max-w-[50px] h-screen overflow-y-auto overflow-x-hidden border-r border-gray-200 bg-white z-5">
        <div className="h-full py-5 flex items-center justify-between flex-col box-border">
          <div className="flex items-center flex-col box-border">
            <ul className="flex flex-col gap-y-10">
              <li className="flex items-center justify-center">
                <Logo alt="phis admin" className="w-[72%] text-gray-600 group-focus:text-gray-800 invert" />
              </li>
              <li className="flex items-center justify-center">
                <a aria-label={t.search} className="w-[72%] border-none hover:bg-gray-100 focus:outline-none focus:bg-gray-200">
                  <Picture src={asset.searchingBar} alt={alt.search} className="w-full" />
                </a>
              </li>
              <li className="flex items-center justify-center">
                <a href={url.sale} aria-label={t.sale} className="w-[70%] border-none hover:bg-gray-100 focus:outline-none focus:bg-gray-200">
                  <Picture src={asset.sale} alt={alt.sale} className="w-full" />
                </a>
              </li>
              <li className="flex items-center justify-center">
                <a href={url.releases} aria-label={t.new} className="w-[70%] border-none hover:bg-gray-100 focus:outline-none focus:bg-gray-200">
                  <Picture src={asset.new} alt={alt.new} className="w-full" />
                </a>
              </li>
              <li className="flex items-center justify-center">
                <a href={url.messages} aria-label={t.message} className="w-[72%] border-none hover:bg-gray-100 focus:outline-none focus:bg-gray-200">
                  <Picture src={asset.message} alt={alt.message} className="w-full" />
                </a>
              </li>
            </ul>
          </div>

          <div className="flex items-center justify-center box-border">
            <a aria-label={t.option} className="w-[70%] border-none hover:bg-gray-100 focus:outline-none focus:bg-gray-200">
              <Picture src={asset.option} alt={alt.option} className="w-full" />
            </a>
          </div>
        </div>
      </nav>
    </div>
  );
};

export default MainNavigation;
