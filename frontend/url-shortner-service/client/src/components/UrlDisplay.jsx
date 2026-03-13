import React from "react";

const UrlDisplay = ({ urlShort, urlLong, clicks, id }) => {
  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(urlShort);
      alert("Copied to clipboard!");
    } catch (err) {
      console.error("Copy failed", err);
    }
  };

  return (
    <tr className="border-b border-yellow-100">
      <td className="p-4 truncate max-w-xs">{urlLong}</td>

      <td className="p-4 font-mono font-bold text-yellow-600">
        <a href={urlShort} target="_blank" rel="noopener noreferrer">
          {urlShort}
        </a>
      </td>

      <td className="p-4">{clicks}</td>

      <td className="p-4">
        <button
          onClick={handleCopy}
          className="bg-yellow-100 px-3 py-1 rounded-lg mr-2 transition-duration-300 hover:bg-yellow-900 hover:text-amber-50 hover:cursor-pointer"
        >
          Copy
        </button>
      </td>
    </tr>
  );
};

export default UrlDisplay;
