export default function Toast({ message }) {
  if (!message) {
    return null;
  }

  return <div role="status">{message}</div>;
}
