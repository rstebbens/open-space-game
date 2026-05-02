export default function Table({ plays, others }) {
  return (
    <div style={{ border: "1px solid white", padding: 20 }}>
      <h4>Players</h4>

      {others.map((user) => (
        <div key={user.connectionId}>
          {user.presence?.name}
        </div>
      ))}

      <h4>Plays</h4>

      {plays?.map((p, i) => (
        <div key={i}>
          {p.player} played {p.card}
        </div>
      ))}
    </div>
  );
}