import { useEffect, useRef } from "react";
import Hls from "hls.js";

export default function Player({ channel, onClose }) {
  const videoRef = useRef(null);
  const hlsRef = useRef(null);

  useEffect(() => {
    if (!channel?.url || !videoRef.current) return;

    const video = videoRef.current;

    if (Hls.isSupported()) {
      const hls = new Hls();
      hlsRef.current = hls;
      hls.loadSource(channel.url); // raw m3u8 URL
      hls.attachMedia(video);
    } else if (video.canPlayType("application/vnd.apple.mpegurl")) {
      video.src = channel.url;
    } else {
      console.error("HLS not supported in this browser");
    }

    video.play().catch(() => { });

    return () => {
      if (hlsRef.current) {
        hlsRef.current.destroy();
        hlsRef.current = null;
      }
      if (video) {
        try {
          video.pause();
          video.removeAttribute("src");
          video.load();
        } catch (e) { }
      }
    };
  }, [channel]);

  return (
    <div id="playerBox">
      <div className="player-header">
        <strong id="playerTitle" className="player-title">{channel.name}</strong>
        <button id="closePlayer" aria-label="Close player" onClick={onClose}>×</button>
      </div>
      <video ref={videoRef} controls autoPlay playsInline style={{ width: "100%" }} />
    </div>
  );
}
