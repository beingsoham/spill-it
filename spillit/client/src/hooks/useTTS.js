export function useTTS() {
  const speak = (text) => {
    if (typeof window === "undefined") {
      return;
    }

    const utterance = new SpeechSynthesisUtterance(text);
    window.speechSynthesis.speak(utterance);
  };

  return { speak };
}
