import Script from "next/script";
import { useEffect } from "react";
import { trackGAEvent } from "@/f/utils/track";

declare global {
  interface Window {
    dataLayer: any[];
    gtag?: (...args: any[]) => void;
  }
}

const GoogleTag = () => {
  useEffect(() => {
    window.dataLayer = window.dataLayer || [];
    function gtag(...args: any[]) {
      window.dataLayer.push(args);
    }
    gtag('js', new Date());
    gtag('config', 'G-XXXXXXXXXX'); // GA4 Measurement ID

    window.addEventListener("load", () => {
      trackGAEvent("page_view", { page_location: location.href });
    });
  }, []);

  return (
    <>
      <Script
        src="https://www.googletagmanager.com/gtag/js?id=G-XXXXXXXXXX"
        strategy="afterInteractive"
      />
    </>
  );
};

export default GoogleTag;