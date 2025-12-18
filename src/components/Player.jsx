import { useEffect, useRef } from "react";
import Hls from "hls.js";

export default function Player({ channel, onClose }) {
  const video = useRef(null);
  const hls = useRef(null);

  useEffect(() => {
    let mounted = true;

    async function attach() {
      if (!video.current) return;

      if (Hls.isSupported()) {
        hls.current = new Hls();
        hls.current.loadSource(channel.url);
        hls.current.attachMedia(video.current);
      } else {
        video.current.src = channel.url;
      }

      try {
        await video.current.play();
      } catch (e) {
        // Autoplay might be blocked; ignore silently
      }
    }

    attach();

    return () => {
      mounted = false;
      if (hls.current) {
        hls.current.destroy();
        hls.current = null;
      }
      if (video.current) {
        try {
          video.current.pause();
        } catch (e) {}
        try {
          video.current.removeAttribute("src");
          video.current.load();
        } catch (e) {}
      }
    };
  }, [channel]);

  // shrink player on scroll (adds/removes .mini)
  useEffect(() => {
    const onScroll = () => {
      const box = document.getElementById("playerBox");
      if (!box) return;
      if (window.scrollY > 80) box.classList.add("mini");
      else box.classList.remove("mini");
    };

    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <div id="playerBox">
      <div className="player-header">
        <strong id="playerTitle" className="player-title">{channel.name}</strong>
        <button id="closePlayer" aria-label="Close player" onClick={onClose}>×</button>
      </div>
      <video id="video" ref={video} controls autoPlay playsInline />
    </div>
  );
}
