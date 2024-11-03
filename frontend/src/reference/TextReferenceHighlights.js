import React from "react";

function flattenMap(inputMap) {
    const result = [];
  
    for (const key in inputMap) {
        console.log(inputMap[key]);
      if (Array.isArray(inputMap[key])) {
        inputMap[key].forEach(pair => {
          if (Array.isArray(pair) && pair.length === 2) {
            result.push(pair);
          }
        });
      }
    }
  
    return result;
  }

const TextReferenceHighlights = ({ text, highlights }) => {
    const renderHighlightedText = () => {
      const segments = [];
      let lastIndex = 0;

      const start_end_highlights = flattenMap(highlights);

      console.log(start_end_highlights);

      start_end_highlights.forEach(([start, end], index) => {
        // Add the non-highlighted segment before the highlight
        if (start > lastIndex) {
          segments.push(
            <span key={`plain-${index}-${lastIndex}`}>
              {text.slice(lastIndex, start)}
            </span>
          );
        }
  
        // Add the highlighted segment
        segments.push(
          <span
            key={`highlight-${index}`}
            style={{ backgroundColor: "rgba(255, 0, 0, 0.1)" }} // Very light red
          >
            {text.slice(start, end)}
          </span>
        );
  
        // Update lastIndex to the end of the highlighted part
        lastIndex = end;
      });
  
      // Add any remaining non-highlighted text
      if (lastIndex < text.length) {
        segments.push(
          <span key={`plain-last-${lastIndex}`}>
            {text.slice(lastIndex)}
          </span>
        );
      }
  
      return segments;
    };
  
    return <div>{renderHighlightedText()}</div>;
};

export default TextReferenceHighlights;