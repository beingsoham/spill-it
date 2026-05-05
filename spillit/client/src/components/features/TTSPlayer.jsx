export default function TTSPlayer({ text = "" }) {
  const speak = () => {
    if (typeof window === "undefined") {
      return;
    }

    const utterance = new SpeechSynthesisUtterance(text);
    window.speechSynthesis.speak(utterance);
  };

  return (
    <button type="button" onClick={speak}>
      Listen
    </button>
  );
}
