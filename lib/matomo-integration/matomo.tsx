import Script from 'next/script'

export const Matomo = {
  script: () => (
    <Script id="matomoScript" strategy="afterInteractive">
      {` var _paq = window._paq = window._paq || [];
         /* tracker methods like "setCustomDimension" should be called before "trackPageView" */
         _paq.push(['trackPageView']);
         _paq.push(['enableLinkTracking']);
        (function() {
        var u="https://cardanofoundation.matomo.cloud/";
        _paq.push(['setTrackerUrl', u+'matomo.php']);
        _paq.push(['setSiteId', '4']);
        var d=document, g=d.createElement('script'), s=d.getElementsByTagName('script')[0];
        g.async=true; g.src='https://cdn.matomo.cloud/cardanofoundation.matomo.cloud/matomo.js'; s.parentNode.insertBefore(g,s);
      })()`}
    </Script>
  ),
}