import DownloadButton from "./downloadButton";

export function CopyButton({ targetRef }: { targetRef: React.RefObject<HTMLDivElement | null> }) {
  
  const handleCopy = () => {
    if (!targetRef.current) return;

    const range = document.createRange();
    const selection = window.getSelection();

    range.selectNodeContents(targetRef.current);
    selection?.removeAllRanges();
    selection?.addRange(range);

    try {
      document.execCommand("copy");
    } catch (err) {
      console.error("Failed to copy:", err);
    }

    selection?.removeAllRanges();
  };

  return (
    <button
      onClick={handleCopy}
      className="mt-2 flex font-bold text-white transition"
    >
    
    <DownloadButton  text="copy" />
    </button>
    
  );
}


