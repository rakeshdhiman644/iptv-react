import { memo } from "react";

const FALLBACK_IMG = "https://placehold.co/160x90?text=No+Image";

const ChannelCard = memo(function ChannelCard({ stream, channel, logo, style, onClick }) {

  const handleImgError = (e) => {
    if (e.currentTarget.dataset.fallback !== "true") {
      e.currentTarget.src = FALLBACK_IMG;
      e.currentTarget.dataset.fallback = "true"; // prevents loop
    }
  };

  return (
    <div className="card" style={style} onClick={onClick}>
      {logo &&
        <img
          src={logo}
          alt={channel?.name || "Channel Logo"}
          loading="lazy"
          onError={handleImgError}
        />
      }
      <div className="channel-info">
        <strong>{channel.name}</strong>
        <div className="badge">{stream.quality || "SD"}</div>
      </div>
    </div>
  );
});

export default ChannelCard;
