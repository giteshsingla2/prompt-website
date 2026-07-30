import Script from "next/script";
import HeaderCode from "@/components/HeaderCode";
import { getCachedSettings } from "@/lib/dataCache";
import "./globals.css";

export const metadata = {
  title: "POSTR. — AI Poster Prompt Library",
  description: "A small library of ready-to-copy prompts for posters and aesthetic images. Unlock a prompt, watch a short ad, and copy it to your favourite AI generator.",
};

export default async function RootLayout({ children }) {
  // Fetch settings from cache (only hits DB on first load or after revalidateTag('settings'))
  let headerCode = "";
  try {
    const settings = await getCachedSettings();
    headerCode = settings["header_code"] || "";
  } catch (e) {
    // DB unavailable — skip header code injection
  }

  const interstitialAdUnit = process.env.NEXT_PUBLIC_GAM_INTERSTITIAL_AD_UNIT || "/21775744923/example/interstitial";
  const topBannerAdUnit = process.env.NEXT_PUBLIC_GAM_TOP_BANNER_AD_UNIT || "/21775744923/example/adaptive-banner";
  const anchorAdUnit = process.env.NEXT_PUBLIC_GAM_ANCHOR_AD_UNIT || "/21775744923/example/anchor";

  return (
    <html lang="en" suppressHydrationWarning={true}>
      <head>
        {/* Google Publisher Tag (GPT) library */}
        <Script
          src="https://securepubads.g.doubleclick.net/tag/js/gpt.js"
          strategy="afterInteractive"
        />
        {/* Global GPT slots setup */}
        <Script id="gpt-global-ad-setup" strategy="afterInteractive">
          {`
            window.googletag = window.googletag || { cmd: [] };
            googletag.cmd.push(function() {
              // 1. Define Top Banner (Responsive: 728x90 on desktop, 320x50 on mobile)
              var topBannerSlot = googletag.defineSlot(
                '${topBannerAdUnit}',
                [[728, 90], [320, 50]],
                'div-gpt-ad-top-banner'
              );
              
              if (topBannerSlot) {
                var sizeMapping = googletag.sizeMapping()
                  .addSize([1024, 0], [728, 90]) // Desktop
                  .addSize([0, 0], [320, 50])    // Mobile/Tablet
                  .build();
                topBannerSlot.defineSizeMapping(sizeMapping);
                topBannerSlot.addService(googletag.pubads());
              }

              // 2. Define Bottom Anchor Ad (out-of-page floating slot)
              var anchorSlot = googletag.defineOutOfPageSlot(
                '${anchorAdUnit}',
                googletag.enums.OutOfPageFormat.BOTTOM_ANCHOR
              );
              if (anchorSlot) {
                anchorSlot.addService(googletag.pubads());
              }

              // 3. Define Web Interstitial Ad (displays between page loads)
              var interstitialSlot = googletag.defineOutOfPageSlot(
                '${interstitialAdUnit}',
                googletag.enums.OutOfPageFormat.INTERSTITIAL
              );
              if (interstitialSlot) {
                interstitialSlot.addService(googletag.pubads());
              }

              googletag.enableServices();

              // Trigger display for static layout slots
              if (topBannerSlot) {
                googletag.display('div-gpt-ad-top-banner');
              }
              if (anchorSlot) {
                googletag.display(anchorSlot);
              }
            });
          `}
        </Script>
        {/* Custom header code from DB (managed via admin panel Settings) */}
        <HeaderCode code={headerCode} />
      </head>
      <body suppressHydrationWarning={true}>
        {/* Top Banner Ad Placed Before Everything Else */}
        <div className="pf-top-ad-wrapper">
          <div id="div-gpt-ad-top-banner" />
        </div>
        
        {children}
      </body>
    </html>
  );
}
