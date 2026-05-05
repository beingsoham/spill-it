export default function FeedList({ items = [] }) {
  if (items.length === 0) {
    return <p>No posts yet.</p>;
  }

  return (
    <ul>
      {items.map((item) => (
        <li key={item.id}>{item.title}</li>
      ))}
    </ul>
  );
}
