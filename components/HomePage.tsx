import React, { useState, FormEvent, useRef, useEffect } from "react";
import { shortenUrl } from "../services/api";

const isValidUrl = (urlString: string): boolean => {
  try {
    const url = new URL(urlString);
    return url.protocol === "http:" || url.protocol === "https:";
  } catch (_) {
    return false;
  }
};

const HomePage: React.FC = () => {
  const [urlInput, setUrlInput] = useState<string>("");
  const [shortenedUrl, setShortenedUrl] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [copied, setCopied] = useState<boolean>(false);

  const resultRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (shortenedUrl && resultRef.current) {
      resultRef.current.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  }, [shortenedUrl]);

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);
    setShortenedUrl(null);
    setCopied(false);

    if (!urlInput.trim()) {
      setError("Please enter a URL.");
      return;
    }

    if (!isValidUrl(urlInput)) {
      setError("Please enter a valid URL (e.g., https://example.com).");
      return;
    }

    setIsLoading(true);
    try {
      const data = await shortenUrl(urlInput);

      // Correctly construct the base path for the shortened URL
      let path = window.location.pathname;
      if (path.endsWith("index.html")) {
        path = path.substring(0, path.lastIndexOf("/") + 1);
      }
      const newUrl = `${window.location.origin}${path}${data.hashurl}`;

      setShortenedUrl(newUrl);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "An unexpected error occurred.",
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleCopy = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    console.log("Copy button clicked");

    if (!shortenedUrl) {
      console.log("No shortened URL to copy");
      return;
    }

    console.log("Shortened URL to copy:", shortenedUrl);

    try {
      // Modern clipboard API
      if (navigator.clipboard && window.isSecureContext) {
        await navigator.clipboard.writeText(shortenedUrl);
        console.log("URL copied to clipboard successfully using modern API");
      } else {
        // Fallback for older browsers
        const textArea = document.createElement("textarea");
        textArea.value = shortenedUrl;
        textArea.style.position = "fixed";
        textArea.style.opacity = "0";
        document.body.appendChild(textArea);
        textArea.select();
        textArea.setSelectionRange(0, 99999); // For mobile devices

        const successful = document.execCommand("copy");
        document.body.removeChild(textArea);

        if (!successful) {
          throw new Error("Fallback copy method failed");
        }
        console.log("URL copied to clipboard successfully using fallback");
      }

      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy URL:", err);
      alert(
        "Failed to copy URL to clipboard. Please copy manually: " +
          shortenedUrl,
      );
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center p-4 bg-slate-50 font-sans pt-20">
      <div className="w-full max-w-2xl text-center mt-10">
        <h1 className="text-5xl md:text-6xl font-bold text-slate-800 mb-3 tracking-tight">
          Url Shorter
        </h1>
        <p className="text-lg text-slate-500 mb-10">
          The simple and modern way to shorten your links using n8n.
        </p>

        <div className="bg-white p-6 sm:p-8 rounded-2xl shadow-sm">
          <form onSubmit={handleSubmit}>
            <div className="flex flex-col sm:flex-row items-center gap-4">
              <div className="relative w-full">
                <i className="fa-solid fa-link absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"></i>
                <input
                  type="text"
                  value={urlInput}
                  onChange={(e) => setUrlInput(e.target.value)}
                  placeholder="Enter your long URL here..."
                  className="w-full bg-slate-100 border-transparent rounded-lg py-3.5 pl-12 pr-4 text-slate-900 placeholder-slate-400 focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 outline-none transition duration-300"
                  disabled={isLoading}
                />
                {urlInput && (
                  <button
                    type="button"
                    onClick={() => setUrlInput("")}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition duration-300"
                    title="Clear input"
                  >
                    <i className="fa-solid fa-xmark"></i>
                  </button>
                )}
              </div>
              <button
                type="submit"
                className="w-full sm:w-auto bg-cyan-500 hover:bg-cyan-600 text-white font-bold py-3.5 px-8 rounded-lg transition duration-300 disabled:bg-slate-300 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <i className="fa-solid fa-spinner fa-spin"></i>
                    <span>Shortening...</span>
                  </>
                ) : (
                  <>
                    <i className="fa-solid fa-wand-magic-sparkles"></i>
                    <span>Shorten</span>
                  </>
                )}
              </button>
            </div>
            {error && <p className="text-red-500 mt-4 text-left">{error}</p>}
          </form>
        </div>

        {shortenedUrl && (
          <div
            ref={resultRef}
            className="mt-8 bg-white p-6 rounded-2xl animate-fade-in-up shadow-sm"
          >
            <div className="flex justify-between items-center mb-3">
              <h3 className="text-lg font-semibold text-slate-700">
                Your shortened URL is ready!
              </h3>
              <button
                onClick={() => {
                  setUrlInput("");
                  setShortenedUrl(null);
                  setError(null);
                  setCopied(false);
                }}
                type="button"
                className="text-slate-400 hover:text-slate-600 transition duration-300"
                title="Create new short URL"
              >
                <i className="fa-solid fa-rotate-right text-lg"></i>
              </button>
            </div>
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-slate-50 p-4 rounded-lg">
              <a
                href={shortenedUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-cyan-600 font-mono text-lg break-all hover:underline"
              >
                {shortenedUrl}
              </a>
              <button
                onClick={handleCopy}
                type="button"
                className={`w-full sm:w-auto text-sm font-bold py-2 px-4 rounded-lg transition duration-300 flex items-center justify-center gap-2 cursor-pointer ${
                  copied
                    ? "bg-green-500 text-white"
                    : "bg-slate-200 hover:bg-slate-300 text-slate-600"
                }`}
              >
                {copied ? (
                  <>
                    <i className="fa-solid fa-check"></i>
                    <span>Copied!</span>
                  </>
                ) : (
                  <>
                    <i className="fa-solid fa-copy"></i>
                    <span>Copy</span>
                  </>
                )}
              </button>
            </div>
          </div>
        )}
      </div>

      <footer className="absolute bottom-4 text-center text-slate-400 text-sm">
        <p>Created by Ogya Adyatma Putra using n8n as backend.</p>
      </footer>

      <style>{`
        @keyframes fade-in-up {
          0% {
            opacity: 0;
            transform: translateY(20px);
          }
          100% {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-fade-in-up {
          animation: fade-in-up 0.5s ease-out forwards;
        }
      `}</style>
    </div>
  );
};

export default HomePage;
