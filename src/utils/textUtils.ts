export const formatTime = (time: number): string => {
  const minutes = Math.floor(time / 60000);
  const seconds = Math.floor((time % 60000) / 1000);
  const milliseconds = Math.floor((time % 1000) / 10);
  return `${minutes.toString().padStart(2, "0")}:${seconds
    .toString()
    .padStart(2, "0")}.${milliseconds.toString().padStart(2, "0")}`;
};

export const processText = (text: string) => {
  const parts: {
    text: string;
    type: "url" | "mention" | "hashtag" | "normal";
  }[] = [];
  let lastIndex = 0;

  const combinedRegex =
    /(?:(?:https?:\/\/)?(?:www\.)?[a-zA-Z0-9-]+(?:\.[a-zA-Z]{2,})+(?:\/[^\s]*)?)|(?:@\w+)|(?:#\w+)/g;

  let match;
  while ((match = combinedRegex.exec(text)) !== null) {
    if (match.index > lastIndex) {
      parts.push({
        text: text.slice(lastIndex, match.index),
        type: "normal",
      });
    }

    const matchText = match[0];
    if (matchText.startsWith("@")) {
      parts.push({ text: matchText, type: "mention" });
    } else if (matchText.startsWith("#")) {
      parts.push({ text: matchText, type: "hashtag" });
    } else {
      parts.push({ text: matchText, type: "url" });
    }

    lastIndex = match.index + matchText.length;
  }

  if (lastIndex < text.length) {
    parts.push({
      text: text.slice(lastIndex),
      type: "normal",
    });
  }

  return parts;
};
