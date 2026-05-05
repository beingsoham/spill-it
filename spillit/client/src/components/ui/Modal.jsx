export default function Modal({ isOpen, title, children }) {
  if (!isOpen) {
    return null;
  }

  return (
    <div role="dialog" aria-modal="true">
      <h2>{title}</h2>
      {children}
    </div>
  );
}
