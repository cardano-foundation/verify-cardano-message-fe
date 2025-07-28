import { useState } from "react";

export default function ShareButton({
  data,
  result,
  type = "cip8",
  className = "",
}) {
  const [copied, setCopied] = useState(false);
  const [isSharing, setIsSharing] = useState(false);

  const handleShare = async () => {
    setIsSharing(true);

    try {
      // Create a share entry on the server
      const response = await fetch("/api/share", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          result,
          data,
          type,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to create share");
      }

      const { shareId } = await response.json();

      // Generate shareable URL with the share ID
      const baseUrl = window.location.origin;
      const shareUrl = `${baseUrl}/shared/${shareId}`;

      await navigator.clipboard.writeText(shareUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Failed to share:", err);
      // TODO: Show error toast/notification
    } finally {
      setIsSharing(false);
    }
  };

  return (
    <button
      onClick={handleShare}
      className={`inline-flex items-center gap-2 px-3 py-2 text-sm font-medium text-cf-blue-700 bg-cf-blue-50 hover:bg-cf-blue-100 border border-cf-blue-200 rounded-lg transition-all duration-200 hover:scale-105 ${className}`}
      title="Copy shareable link to clipboard"
    >
      <svg
        className="w-4 h-4"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        {copied ? (
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M5 13l4 4L19 7"
          />
        ) : isSharing ? (
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
          />
        ) : (
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.367 2.684 3 3 0 00-5.367-2.684z"
          />
        )}
      </svg>
      {copied ? "Copied!" : isSharing ? "Sharing..." : "Share Result"}
    </button>
  );
}
