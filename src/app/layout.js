import Script from "next/script";
import "./globals.css";

export const metadata = {
  title: "POSTR. — AI Poster Prompt Library",
  description: "A small library of ready-to-copy prompts for posters and aesthetic images. Unlock a prompt, watch a short reel, and copy it to your favourite AI generator.",
};

export default function RootLayout({ children }) {
  const interstitialAdUnit = process.env.NEXT_PUBLIC_GAM_INTERSTITIAL_AD_UNIT || "/21775744923/example/interstitial";

  return (
    <html lang="en">
      <head>
        {/* Google Publisher Tag (GPT) JS script */}
        <Script
          src="https://securepubads.g.doubleclick.net/tag/js/gpt.js"
          strategy="afterInteractive"
        />
        {/* Configure Web Interstitial ad slot globally */}
        <Script id="gpt-interstitial-setup" strategy="afterInteractive">
          {`
            window.googletag = window.googletag || { cmd: [] };
            googletag.cmd.push(function() {
              // Interstitial ads display between page views
              var interstitialSlot = googletag.defineOutOfPageSlot(
                '${interstitialAdUnit}',
                googletag.enums.OutOfPageFormat.INTERSTITIAL
              );
              
              if (interstitialSlot) {
                interstitialSlot.addService(googletag.pubads());
              }
              googletag.enableServices();
            });
          `}
        </Script>
      </head>
      <body>
        {children}
      </body>
    </html>
  );
}
