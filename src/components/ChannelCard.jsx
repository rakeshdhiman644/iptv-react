import { memo } from "react";

const ChannelCard = memo(function ChannelCard({ stream, channel, logo, style, onClick }) {
  return (
    <div className="card" style={style} onClick={onClick}>
      {logo && <img src={logo} alt={channel.name} loading="lazy" onError={(e) => e.target.src = "https://placehold.co/160x90?text=No\nImage"} />}
      <div className="channel-info">
        <strong>{channel.name}</strong>
        <div className="badge">{stream.quality || "SD"}</div>
      </div>
    </div>
  );
});

export default ChannelCard;
