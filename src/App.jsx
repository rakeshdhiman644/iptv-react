import { useEffect, useState } from "react";
import Controls from "./components/Controls";
import ChannelGrid from "./components/ChannelGrid";
import Player from "./components/Player";

const STREAMS_API = "https://iptv-org.github.io/api/streams.json";
const CHANNELS_API = "https://iptv-org.github.io/api/channels.json";
const LOGOS_API = "https://iptv-org.github.io/api/logos.json";
const CATEGORIES_API = "https://iptv-org.github.io/api/categories.json";
const LIMIT = 28;

export default function App() {
  const [streams, setStreams] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [channels, setChannels] = useState({});
  const [logos, setLogos] = useState({});
  const [categories, setCategories] = useState([]);
  const [page, setPage] = useState(1);
  const [playing, setPlaying] = useState(null);
  const [loadingMore, setLoadingMore] = useState(false);

  useEffect(() => {
    async function load() {
      const [s, c, l, cat] = await Promise.all([
        fetch(STREAMS_API).then(r => r.json()),
        fetch(CHANNELS_API).then(r => r.json()),
        fetch(LOGOS_API).then(r => r.json()),
        fetch(CATEGORIES_API).then(r => r.json())
      ]);

      const channelMap = {};
      c.forEach(ch => channelMap[ch.id] = ch);

      const logoMap = {};
      l.forEach(lo => lo.channel && (logoMap[lo.channel] = lo.url));

      setChannels(channelMap);
      setLogos(logoMap);
      setCategories(cat);

      const valid = s.filter(x => x.url && channelMap[x.channel]);
      setStreams(valid);
      setFiltered(valid);
    }
    load();
  }, []);

  const applyFilters = (text, cat) => {
    const q = text.toLowerCase();
    const f = streams.filter(s => {
      const ch = channels[s.channel];
      if (!ch) return false;
      return (
        ch.name.toLowerCase().includes(q) &&
        (!cat || ch.categories?.includes(cat))
      );
    });
    setFiltered(f);
    setPage(1);
  };

  return (
    <>
      <h2>📺 Channel List</h2>

      {playing && (
        <Player channel={playing} onClose={() => setPlaying(null)} />
      )}

      <Controls
        categories={categories}
        channels={channels}
        onFilter={applyFilters}
      />

      <ChannelGrid
        data={filtered.slice(0, LIMIT * page)}
        channels={channels}
        logos={logos}
        onPlay={setPlaying}
      />

      {LIMIT * page < filtered.length && (
        <button
          id="loadMore"
          onClick={() => {
            // show a loading state briefly while more items are rendered
            setLoadingMore(true);
            setTimeout(() => {
              setPage(p => p + 1);
              setLoadingMore(false);
            }, 500);
          }}
          disabled={loadingMore}
        >
          {loadingMore ? "Loading..." : "Load More"}
        </button>
      )}
    </>
  );
}
