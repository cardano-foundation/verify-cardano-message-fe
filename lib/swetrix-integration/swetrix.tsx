import Script from 'next/script'

export const Swetrix = {
  initialScript: () => (
    <script src="https://swetrix.org/swetrix.js" defer></script>
  ),
  script: () => (
    <Script id="swetrixScript" strategy="afterInteractive">
      {`document.addEventListener('DOMContentLoaded', function() {
        swetrix.init('GRxW5Lv9sQLD')
        swetrix.trackViews()
      })`}
    </Script>
  ),
  nonScript: () => (
    <noscript>
      <img
        src="https://api.swetrix.com/log/noscript?pid=GRxW5Lv9sQLD"
        alt=""
        referrerPolicy="no-referrer-when-downgrade"
      />
    </noscript>
  ),
}