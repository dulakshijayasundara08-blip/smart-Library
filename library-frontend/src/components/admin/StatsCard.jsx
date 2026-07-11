// src/components/admin/StatsCard.jsx
export default function StatsCard({ title, val, color }) {
  return (
    <div style={{ background: color, color: 'white', padding: '20px', borderRadius: '10px', flex: 1 }}>
      <h3>{title}</h3>
      <p style={{ fontSize: '24px', fontWeight: 'bold' }}>{val}</p>
    </div>
  );
}