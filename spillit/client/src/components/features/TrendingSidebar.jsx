export default function TrendingSidebar({ topics = [] }) {
  return (
    <aside>
      <h2>Trending</h2>
      <ul>
        {topics.map((topic) => (
          <li key={topic}>{topic}</li>
        ))}
      </ul>
    </aside>
  );
}
