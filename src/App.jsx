import { useEffect, useState, useCallback, lazy, Suspense } from "react";
import Controls from "./components/Controls";
import ChannelGrid from "./components/ChannelGrid";
import Disclaimer from "./components/Disclaimer";

const Player = lazy(() => import("./components/Player"));

const STREAMS_API = "https://iptv-org.github.io/api/streams.json";
const CHANNELS_API = "https://iptv-org.github.io/api/channels.json";
const LOGOS_API = "https://iptv-org.github.io/api/logos.json";
const CATEGORIES_API = "https://iptv-org.github.io/api/categories.json";

const QUALITY_PRIORITY = [
  "2160p",
  "1440p",
  "1080p",
  "720p",
  "576p",
  "480p",
  "360p",
  "SD"
];

function qualityRank(q) {
  const idx = QUALITY_PRIORITY.indexOf(q || "SD");
  return idx === -1 ? QUALITY_PRIORITY.length : idx;
}

function dedupeStreamsByChannel(streams) {
  const map = new Map();

  streams.forEach(s => {
    if (!s.channel) return;

    if (!map.has(s.channel)) {
      map.set(s.channel, s);
    } else {
      const existing = map.get(s.channel);
      if (qualityRank(s.quality) < qualityRank(existing.quality)) {
        map.set(s.channel, s);
      }
    }
  });

  return Array.from(map.values());
}

export default function App() {
  const [streams, setStreams] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [channels, setChannels] = useState({});
  const [logos, setLogos] = useState({});
  const [categories, setCategories] = useState([]);
  const [playing, setPlaying] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      const [s, c, l, cat] = await Promise.allSettled([
        fetch(STREAMS_API).then(r => r.json()),
        fetch(CHANNELS_API).then(r => r.json()),
        fetch(LOGOS_API).then(r => r.json()),
        fetch(CATEGORIES_API).then(r => r.json())
      ]);

      const streams = s.status === "fulfilled" ? s.value : [];
      const channels = c.status === "fulfilled" ? c.value : [];
      const logos = l.status === "fulfilled" ? l.value : [];
      const categories = cat.status === "fulfilled" ? cat.value : [];

      const channelMap = {};
      channels.forEach(ch => channelMap[ch.id] = ch);

      const logoMap = {};
      logos.forEach(lo => lo.channel && (logoMap[lo.channel] = lo.url));

      setChannels(channelMap);
      setLogos(logoMap);
      setCategories(categories);

      const valid = streams.filter(x => x.url && channelMap[x.channel]);
      const unique = dedupeStreamsByChannel(valid);

      setStreams(unique);
      setFiltered(unique);
      setLoading(false);

    }
    load();
  }, []);

  const applyFilters = useCallback((text, cat) => {
    const q = text.toLowerCase();

    const result = streams.filter(s => {
      const ch = channels[s.channel];
      return (
        ch &&
        ch.name.toLowerCase().includes(q) &&
        (!cat || ch.categories?.includes(cat))
      );
    });

    setFiltered(result);
  }, [streams, channels]);

  return (
    <>
      <Disclaimer />
      <h2>📺 Channel List</h2>

      {playing && (
        <Suspense fallback={<div className="modal-loading">Loading Player...</div>}>
          <Player channel={playing} onClose={() => setPlaying(null)} />
        </Suspense>
      )}

      <Controls
        categories={categories}
        channels={channels}
        onFilter={applyFilters}
      />

      {loading ? (
        <div className="grid skeleton-container">
          {Array.from({ length: 27 }).map((_, i) => (
            <div className="card skeleton" key={i}>
              <div className="skeleton-img" />
              <div className="skeleton-line short" />
              <div className="skeleton-line" />
            </div>
          ))}
        </div>
      ) : (
        <ChannelGrid
          data={filtered}
          channels={channels}
          logos={logos}
          onPlay={setPlaying}
        />
      )}
    </>
  );
}
