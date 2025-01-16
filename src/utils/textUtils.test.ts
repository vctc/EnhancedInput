import { processText } from "./textUtils";

describe("processText", () => {
  it("identifies URLs", () => {
    const text = "Check out https://www.example.com";
    const result = processText(text);
    expect(result).toEqual([
      { text: "Check out ", type: "normal" },
      { text: "https://www.example.com", type: "url" },
    ]);
  });

  it("identifies mentions", () => {
    const text = "Hello @user123";
    const result = processText(text);
    expect(result).toEqual([
      { text: "Hello ", type: "normal" },
      { text: "@user123", type: "mention" },
    ]);
  });

  it("identifies hashtags", () => {
    const text = "Trending #topic";
    const result = processText(text);
    expect(result).toEqual([
      { text: "Trending ", type: "normal" },
      { text: "#topic", type: "hashtag" },
    ]);
  });

  it("handles mixed content", () => {
    const text = "Visit https://example.com and mention @user #trending";
    const result = processText(text);
    expect(result).toEqual([
      { text: "Visit ", type: "normal" },
      { text: "https://example.com", type: "url" },
      { text: " and mention ", type: "normal" },
      { text: "@user", type: "mention" },
      { text: " ", type: "normal" },
      { text: "#trending", type: "hashtag" },
    ]);
  });
});
