export default function ChannelGrid({ data, channels, logos, onPlay }) {
  return (
    <div className="grid">
      {data.map(s => {
        const ch = channels[s.channel];
        return (
          <div className="card" key={s.url} onClick={() => onPlay({ ...s, name: ch.name })}>
            {logos[s.channel] && <img src={logos[s.channel]} />}
            <strong>{ch.name}</strong>
            <div>{s.quality || "N/A"}</div>
          </div>
        );
      })}
    </div>
  );
}
