import { memo } from "react";
import { VirtuosoGrid } from "react-virtuoso";
import ChannelCard from "./ChannelCard";

const ChannelGrid = ({ data, channels, logos, onPlay }) => {
  return (
    <div style={{ flex: 1, height: "100%", width: "100%" }}>
      <VirtuosoGrid
        style={{ height: "100%" }}
        totalCount={data.length}
        listClassName="grid"
        itemContent={(index) => {
          const s = data[index];
          const ch = channels[s.channel];
          // Ensure we don't crash if channel data is missing (though filtered list should be safe)
          if (!ch) return null;

          return (
            <ChannelCard
              key={s.url}
              stream={s}
              channel={ch}
              logo={logos[s.channel]}
              onClick={() => onPlay({ ...s, name: ch.name })}
            />
          );
        }}
        onScroll={(e) => {
          const box = document.getElementById("playerBox");
          if (box) {
            if (e.target.scrollTop > 50) box.classList.add("mini");
            else box.classList.remove("mini");
          }
        }}
        // Optional: reduce overscan if performance is issue, or increase for smoother scroll
        overscan={200}
      />
    </div>
  );
};

export default memo(ChannelGrid);
