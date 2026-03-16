import React, { useState } from "react";

const UrlDisplay = ({ urlShort, urlLong, clicks = 0, id ,onRowClick}) => {
  const [isCopied, setCopy] = useState(false);

  const handleCopy = async () => {
    try {
      setCopy(true);
      await navigator.clipboard.writeText(urlShort);
      setTimeout(() => {
        setCopy(false);
      }, 1000);
    } catch (err) {
      console.error("Copy failed", err);
    }
  };

  return (
    <tr
      onClick={onRowClick}
      className="cursor-pointer hover:bg-yellow-50 transition-colors"  // ✅ visual feedback
    >
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
          {isCopied ? <div>Copied 👍</div> : <div>Copy</div>}
        </button>
      </td>
    </tr>
  );
};

export default UrlDisplay;
