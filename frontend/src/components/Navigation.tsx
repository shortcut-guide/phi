import PictureImage from "@/f/components/PictureImage";
import Logo from '@/f/components/Logo';

const MainNavigation = () => (
  <div id="main-navigation">
    <nav
      id="vertical-nav"
      className="fixed flex flex-col w-[15%] h-screen overflow-y-auto overflow-x-hidden border-r border-gray-200 bg-white z-5"
    >
      <div className="h-full py-5 flex items-center justify-between flex-col box-border">
        <div className="flex items-center flex-col box-border">
          <ul className="flex flex-col gap-y-10">
            <li className="flex items-center justify-center">
              <Logo alt="phis admin" className="w-[72%] text-gray-600 group-focus:text-gray-800 invert" />
            </li>
            <li className="flex items-center justify-center">
              <a aria-label="探索する" className="w-[72%] border-none hover:bg-gray-100 focus:outline-none focus:bg-gray-200">
                <PictureImage src="/assets/img/searching-bar.png" alt="search" className="w-full" />
              </a>
            </li>
            <li className="flex items-center justify-center">
              <a href="/pin-creation-tool/" aria-label="特価を探す" className="w-[70%] border-none hover:bg-gray-100 focus:outline-none focus:bg-gray-200">
                <PictureImage src="/assets/img/sale.png" alt="sale" className="w-full" />
              </a>
            </li>
            <li className="flex items-center justify-center">
              <a href="/releases/" aria-label="最新情報" className="w-[70%] border-none hover:bg-gray-100 focus:outline-none focus:bg-gray-200">
                <PictureImage src="/assets/img/new.png" alt="new" className="w-full" />
              </a>
            </li>
            <li className="flex items-center justify-center">
              <a href="/messages/" aria-label="メッセージ" className="w-[72%] border-none hover:bg-gray-100 focus:outline-none focus:bg-gray-200">
                <PictureImage src="/assets/img/message.png" alt="message" className="w-full" />
              </a>
            </li>
          </ul>
        </div>

        <div className="flex items-center justify-center box-border">
          <a aria-label="その他のオプション" className="w-[70%] border-none hover:bg-gray-100 focus:outline-none focus:bg-gray-200">
            <PictureImage src="/assets/img/option.png" alt="option" className="w-full" />
          </a>
        </div>
      </div>
    </nav>
  </div>
);

export default MainNavigation;
