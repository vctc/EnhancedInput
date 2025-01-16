import React, { useState, useCallback, useRef, useEffect } from "react";
import { processText } from "../utils/textUtils";

interface EnhancedInputProps {
  maxLength?: number;
  placeholder?: string;
  className?: string;
}

const users = [
  "french",
  "sarah",
  "mike",
  "alex",
  "emma",
  "chris",
  "taylor",
  "pat",
  "sam",
  "jamie",
  "casey",
  "jordan",
  "avery",
  "quinn",
  "skyler",
  "blake",
  "morgan",
  "riley",
  "charlie",
  "france",
  "frog",
  "apple",
  "mac",
];

const EnhancedInput: React.FC<EnhancedInputProps> = ({
  maxLength = 200,
  placeholder = "write something...",
  className = "",
}) => {
  const [text, setText] = useState("");
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [mentionStart, setMentionStart] = useState<number | null>(null);
  const [cursorPosition, setCursorPosition] = useState<number>(0);
  const [caretCoords, setCaretCoords] = useState<{
    top: number;
    left: number;
  } | null>(null);
  const [selectedSuggestionIndex, setSelectedSuggestionIndex] =
    useState<number>(0);
  const [textareaHeight, setTextareaHeight] = useState<number>(100);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const overlayRef = useRef<HTMLDivElement>(null);
  const suggestionsRef = useRef<HTMLDivElement>(null);

  const syncScroll = useCallback(() => {
    if (textareaRef.current && overlayRef.current) {
      overlayRef.current.scrollTop = textareaRef.current.scrollTop;
      overlayRef.current.scrollLeft = textareaRef.current.scrollLeft;
    }
  }, []);

  const updateCursorPosition = useCallback((position: number) => {
    setCursorPosition(position);
    if (textareaRef.current) {
      textareaRef.current.setSelectionRange(position, position);
    }
  }, []);

  const getCaretCoordinates = useCallback(() => {
    if (!textareaRef.current) return null;

    const textarea = textareaRef.current;
    const { selectionStart } = textarea;

    // Create a temporary span to measure text
    const span = document.createElement("span");
    const textNode = document.createTextNode("");
    span.appendChild(textNode);
    span.style.cssText = window.getComputedStyle(textarea).cssText;
    span.style.position = "absolute";
    span.style.left = "-9999px";
    span.style.whiteSpace = "pre-wrap";
    document.body.appendChild(span);

    const textBeforeCaret = textarea.value.substring(0, selectionStart);
    const lines = textBeforeCaret.split("\n");
    const currentLineNumber = lines.length - 1;
    const currentLineText = lines[currentLineNumber];
    const lastAtIndex = currentLineText.lastIndexOf("@");

    if (lastAtIndex === -1) return null;

    // Get the text up to the @ symbol
    const textUpToAt = currentLineText.substring(0, lastAtIndex);
    textNode.textContent = textUpToAt;
    const atSymbolOffset = span.offsetWidth;

    // Clean up
    document.body.removeChild(span);

    const { paddingLeft, lineHeight } = window.getComputedStyle(textarea);

    // Calculate exact position

    return {
      top: parseFloat(lineHeight),
      left: atSymbolOffset + parseFloat(paddingLeft),
    };
  }, []);

  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLTextAreaElement>) => {
      const newText = e.target.value;
      const newCursorPosition = e.target.selectionStart;

      if (newText.length <= maxLength) {
        setText(newText);
        updateCursorPosition(newCursorPosition);

        // Adjust textarea height
        e.target.style.height = "auto";
        e.target.style.height = `${e.target.scrollHeight}px`;
        setTextareaHeight(e.target.scrollHeight);

        const currentLineStart =
          newText.lastIndexOf("\n", newCursorPosition - 1) + 1;
        const currentLineText = newText.slice(
          currentLineStart,
          newCursorPosition
        );
        const lastAtSymbol = currentLineText.lastIndexOf("@");

        if (lastAtSymbol !== -1) {
          const textAfterAt = currentLineText.slice(lastAtSymbol + 1);
          const hasSpaceAfterAt = /\s/.test(textAfterAt);

          if (!hasSpaceAfterAt) {
            setMentionStart(currentLineStart + lastAtSymbol);
            const searchTerm = textAfterAt.toLowerCase();
            const filtered = users.filter((user) =>
              user.toLowerCase().startsWith(searchTerm)
            );
            setSuggestions(filtered);
            setSelectedSuggestionIndex(0);
            setCaretCoords(getCaretCoordinates());
            return;
          }
        }

        setMentionStart(null);
        setSuggestions([]);
        setCaretCoords(null);
      }
    },
    [maxLength, getCaretCoordinates, updateCursorPosition]
  );

  const insertMention = useCallback(
    (suggestion: string) => {
      if (mentionStart !== null && textareaRef.current) {
        const before = text.slice(0, mentionStart);
        const after = text.slice(cursorPosition);
        const mentionText = `@${suggestion} `;
        const newText = before + mentionText + after;
        const newCursorPosition = mentionStart + mentionText.length;

        setText(newText);
        setSuggestions([]);
        setMentionStart(null);
        setCaretCoords(null);
        setSelectedSuggestionIndex(0);

        requestAnimationFrame(() => {
          if (textareaRef.current) {
            textareaRef.current.focus();
            textareaRef.current.setSelectionRange(
              newCursorPosition,
              newCursorPosition
            );
            updateCursorPosition(newCursorPosition);
          }
        });
      }
    },
    [text, mentionStart, cursorPosition, updateCursorPosition]
  );

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
      if (suggestions.length > 0) {
        switch (e.key) {
          case "ArrowDown":
            e.preventDefault();
            setSelectedSuggestionIndex((prev) =>
              prev < suggestions.length - 1 ? prev + 1 : prev
            );
            break;
          case "ArrowUp":
            e.preventDefault();
            setSelectedSuggestionIndex((prev) => (prev > 0 ? prev - 1 : prev));
            break;
          case "Enter":
            if (suggestions[selectedSuggestionIndex]) {
              e.preventDefault();
              insertMention(suggestions[selectedSuggestionIndex]);
            }
            break;
          case "Escape":
            setSuggestions([]);
            setMentionStart(null);
            setCaretCoords(null);
            setSelectedSuggestionIndex(0);
            break;
          case " ":
            if (mentionStart !== null) {
              e.preventDefault();
              insertMention(suggestions[selectedSuggestionIndex]);
            }
            break;
        }
      } else if (e.key === "Backspace" && textareaRef.current) {
        const currentPosition = textareaRef.current.selectionStart;
        const beforeCursor = text.slice(0, currentPosition);
        const mentionMatch = beforeCursor.match(/@\w+\s*$/);

        if (mentionMatch && mentionMatch[0]) {
          e.preventDefault();
          const mentionStart = beforeCursor.lastIndexOf(mentionMatch[0]);
          const newText =
            text.slice(0, mentionStart) + text.slice(currentPosition);
          setText(newText);
          updateCursorPosition(mentionStart);
        }
      }
    },
    [
      suggestions,
      selectedSuggestionIndex,
      mentionStart,
      insertMention,
      text,
      updateCursorPosition,
    ]
  );

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        textareaRef.current &&
        !textareaRef.current.contains(e.target as Node) &&
        suggestionsRef.current &&
        !suggestionsRef.current.contains(e.target as Node)
      ) {
        setSuggestions([]);
        setMentionStart(null);
        setCaretCoords(null);
        setSelectedSuggestionIndex(0);
      }
    };

    document.addEventListener("click", handleClickOutside);
    return () => document.removeEventListener("click", handleClickOutside);
  }, []);

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
      setTextareaHeight(textareaRef.current.scrollHeight);
    }
  }, [text]);

  useEffect(() => {
    if (suggestionsRef.current) {
      const selectedElement = suggestionsRef.current.children[
        selectedSuggestionIndex
      ] as HTMLElement;
      if (selectedElement) {
        selectedElement.scrollIntoView({ block: "nearest" });
      }
    }
  }, [selectedSuggestionIndex]);

  return (
    <div className={`bg-white rounded-lg shadow-md p-4 ${className}`}>
      <div className="relative" style={{ minHeight: `${textareaHeight}px` }}>
        <div className="w-full min-h-[100px] rounded-lg overflow-hidden">
          <textarea
            ref={textareaRef}
            value={text}
            onChange={handleChange}
            onKeyDown={handleKeyDown}
            onScroll={syncScroll}
            placeholder={placeholder}
            className="absolute top-0 left-0 w-full h-full p-3 bg-transparent resize-none focus:outline-none z-10 overflow-hidden"
            style={{
              caretColor: "black",
              color: "transparent",
              background: "transparent",
              paddingBottom: "2rem",
            }}
          />
          <div
            ref={overlayRef}
            className="absolute top-0 left-0 w-full h-full p-3 pointer-events-none whitespace-pre-wrap break-words overflow-hidden"
            style={{
              paddingBottom: "2rem",
            }}
          >
            {processText(text).map((part, index) => {
              switch (part.type) {
                case "url":
                  return (
                    <span key={index} className="text-blue-500">
                      {part.text}
                    </span>
                  );
                case "mention":
                  return (
                    <span
                      key={index}
                      className="bg-gray-100 text-black rounded-md py-[1px]"
                    >
                      {part.text}
                    </span>
                  );
                case "hashtag":
                  return (
                    <span key={index} className="text-blue-500">
                      {part.text}
                    </span>
                  );
                default:
                  return (
                    <span key={index} className="text-gray-900">
                      {part.text}
                    </span>
                  );
              }
            })}
          </div>
        </div>

        {suggestions.length > 0 && caretCoords && (
          <div
            ref={suggestionsRef}
            className="absolute w-48 bg-white rounded-md shadow-lg border border-gray-200 z-20 max-h-40 overflow-y-auto"
            style={{
              top: `${caretCoords.top + 24}px`,
              left: `${caretCoords.left}px`,
              position: "absolute",
            }}
          >
            {suggestions.map((suggestion, index) => (
              <div
                key={suggestion}
                className={`px-4 py-2 cursor-pointer ${
                  index === selectedSuggestionIndex
                    ? "bg-gray-100"
                    : "hover:bg-gray-50"
                }`}
                onClick={(e) => {
                  e.stopPropagation();
                  insertMention(suggestion);
                }}
              >
                @{suggestion}
              </div>
            ))}
          </div>
        )}
      </div>
      <div className="flex justify-end mt-2">
        <span className="text-sm text-gray-500">
          {text.length}/{maxLength}
        </span>
      </div>
    </div>
  );
};

export default EnhancedInput;
