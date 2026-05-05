export default function BottomSheet({ isOpen, children }) {
  if (!isOpen) {
    return null;
  }

  return <div role="dialog">{children}</div>;
}
