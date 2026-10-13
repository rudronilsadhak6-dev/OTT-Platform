import React, { useEffect, useState } from "react";

// Movies stream from the internet, so we tell the user when they go offline
const OfflineBanner = () => {
  const [online, setOnline] = useState(navigator.onLine);

  useEffect(() => {
    const goOnline = () => setOnline(true);
    const goOffline = () => setOnline(false);
    window.addEventListener("online", goOnline);
    window.addEventListener("offline", goOffline);
    return () => {
      window.removeEventListener("online", goOnline);
      window.removeEventListener("offline", goOffline);
    };
  }, []);

  if (online) return null;
  return (
    <div className="offline-banner" role="status">
      You are offline. Movies and series play again once your internet is back.
    </div>
  );
};

export default OfflineBanner;
