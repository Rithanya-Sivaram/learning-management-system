import React from "react";

const styles = {
  container: { display: "flex", flexDirection: "column", gap: "16px" },
  heading1: {
    fontSize: "1.75rem",
    fontWeight: "600",
    color: "var(--card-foreground)",
    margin: "8px 0",
  },
  heading2: {
    fontSize: "1.5rem",
    fontWeight: "600",
    color: "var(--card-foreground)",
    margin: "8px 0",
  },
  heading3: {
    fontSize: "1.25rem",
    fontWeight: "600",
    color: "var(--card-foreground)",
    margin: "8px 0",
  },
  heading4: {
    fontSize: "1.125rem",
    fontWeight: "600",
    color: "var(--card-foreground)",
    margin: "8px 0",
  },
  heading5: {
    fontSize: "1rem",
    fontWeight: "var(--font-weight-medium)",
    color: "var(--card-foreground)",
    lineHeight: 1.5,
    margin: 0,
  },
  heading6: {
    fontSize: "0.875rem",
    fontWeight: "var(--font-weight-medium)",
    color: "var(--card-foreground)",
    lineHeight: 1.5,
    margin: 0,
  },
  blockquote: {
    borderLeft: "4px solid #d0d7de",
    paddingLeft: "12px",
    margin: "12px 0",
    color: "#57606a",
    backgroundColor: "#f6f8fa",
    fontStyle: "italic",
  },
  paragraph: {
    fontSize: "1rem",
    color: "var(--card-foreground)",
    lineHeight: 1.7,
    margin: "8px 0",
  },
  strike: { textDecoration: "line-through", color: "red" },
  ul: { paddingLeft: "1.5rem", margin: "0.5rem 0", listStyleType: "disc" },
  ol: { paddingLeft: "1.5rem", margin: "0.5rem 0", listStyleType: "decimal" },
  li: {
    fontSize: "1rem",
    color: "var(--card-foreground)",
    lineHeight: 1.6,
    margin: "0.25rem 0",
  },
  strong: { fontWeight: "bold", color: "#111" },
  em: { fontStyle: "italic", color: "#222" },
  del: { textDecoration: "line-through", color: "#b91c1c" },
  code: {
    backgroundColor: "#f5f5f5",
    padding: "2px 6px",
    borderRadius: "4px",
    fontFamily: "monospace",
    fontSize: "0.9rem",
  },
  unorderedList: { listStyleType: "disc" },
  orderedList: { listStyleType: "decimal" },
  hr: { border: "none", borderTop: "2px solid #ccc", margin: "1rem 0" },
  codeBlock: {
    backgroundColor: "#f6f8fa",
    padding: "12px",
    borderRadius: "6px",
    fontFamily: "monospace",
    fontSize: "0.95rem",
    overflowX: "auto",
    border: "1px solid #d0d7de",
    margin: "12px 0",
    color: "#24292f",
  },
  inlineCode: {
    backgroundColor: "#f6f8fa",
    padding: "2px 6px",
    borderRadius: "4px",
    fontFamily: "monospace",
    fontSize: "0.95rem",
    color: "#d63384",
  },
  link: { color: "var(--primary)", textDecoration: "none", cursor: "pointer" },
  linkHover: { textDecoration: "underline" },
  image: {
    width: "300px",
    height: "200px",
    objectFit: "cover",
    borderRadius: "8px",
  },
  table: { borderCollapse: "collapse", width: "100%", margin: "12px 0" },
  th: {
    border: "1px solid #d0d7de",
    padding: "8px",
    backgroundColor: "#f6f8fa",
    fontWeight: "600",
    textAlign: "left",
  },
  td: { border: "1px solid #d0d7de", padding: "8px" },
};

// ----------- INLINE FORMATTER --------------
const formatInlineText = (text) => {
  const parts = [];
  let remaining = text;

  while (remaining) {
    const boldMatch = remaining.match(/\*\*(.*?)\*\*/);
    if (boldMatch) {
      if (boldMatch.index > 0)
        parts.push({
          type: "text",
          content: remaining.substring(0, boldMatch.index),
        });
      parts.push({ type: "bold", content: boldMatch[1] });
      remaining = remaining.substring(boldMatch.index + boldMatch[0].length);
      continue;
    }

    const italicMatch = remaining.match(/\*(.*?)\*/);
    if (italicMatch) {
      if (italicMatch.index > 0)
        parts.push({
          type: "text",
          content: remaining.substring(0, italicMatch.index),
        });
      parts.push({ type: "italic", content: italicMatch[1] });
      remaining = remaining.substring(
        italicMatch.index + italicMatch[0].length
      );
      continue;
    }

    const strikeMatch = remaining.match(/~~(.*?)~~/);
    if (strikeMatch) {
      if (strikeMatch.index > 0)
        parts.push({
          type: "text",
          content: remaining.substring(0, strikeMatch.index),
        });
      parts.push({ type: "strike", content: strikeMatch[1] });
      remaining = remaining.substring(
        strikeMatch.index + strikeMatch[0].length
      );
      continue;
    }

    const codeMatch = remaining.match(/`(.*?)`/);
    if (codeMatch) {
      if (codeMatch.index > 0)
        parts.push({
          type: "text",
          content: remaining.substring(0, codeMatch.index),
        });
      parts.push({ type: "code", content: codeMatch[1] });
      remaining = remaining.substring(codeMatch.index + codeMatch[0].length);
      continue;
    }

    const linkMatch = remaining.match(/\[([^\]]+)\]\(([^)]+)\)/);
    if (linkMatch) {
      if (linkMatch.index > 0)
        parts.push({
          type: "text",
          content: remaining.substring(0, linkMatch.index),
        });
      parts.push({ type: "link", content: linkMatch[1], url: linkMatch[2] });
      remaining = remaining.substring(linkMatch.index + linkMatch[0].length);
      continue;
    }

    parts.push({ type: "text", content: remaining });
    break;
  }

  return parts;
};

const RenderInlineText = ({ text }) => {
  const [hoveredLinks, setHoveredLinks] = React.useState({});
  const parts = formatInlineText(text);

  const isYouTubeUrl = (url) => {
    const ytRegex = /(?:youtube\.com\/watch\?v=|youtu\.be\/)([\w-]+)/;
    return ytRegex.test(url);
  };

  const getYouTubeEmbedUrl = (url) => {
    const ytRegex = /(?:youtube\.com\/watch\?v=|youtu\.be\/)([\w-]+)/;
    const match = url.match(ytRegex);
    if (match && match[1]) {
      return `https://www.youtube.com/embed/${match[1]}`;
    }
    return null;
  };

  return parts.map((part, index) => {
    if (part.type === "link" && isYouTubeUrl(part.url)) {
      const embedUrl = getYouTubeEmbedUrl(part.url);
      if (embedUrl) {
        return (
          <div key={index} style={{ margin: "12px 0" }}>
            <iframe
              width="560"
              height="315"
              src={embedUrl}
              title="YouTube video player"
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              style={{ maxWidth: "100%" }}
            ></iframe>
          </div>
        );
      }
    }

    switch (part.type) {
      case "bold":
        return <strong key={index}>{part.content}</strong>;
      case "italic":
        return <em key={index}>{part.content}</em>;
      case "strike":
        return (
          <span key={index} style={styles.strike}>
            {part.content}
          </span>
        );
      case "code":
        return (
          <code key={index} style={styles.inlineCode}>
            {part.content}
          </code>
        );
      case "link":
        return (
          <a
            key={index}
            href={part.url}
            target="_blank"
            rel="noopener noreferrer"
            style={{
              ...styles.link,
              ...(hoveredLinks[index] ? styles.linkHover : {}),
            }}
            onMouseEnter={() =>
              setHoveredLinks((prev) => ({ ...prev, [index]: true }))
            }
            onMouseLeave={() =>
              setHoveredLinks((prev) => ({ ...prev, [index]: false }))
            }
          >
            {part.content}
          </a>
        );
      default:
        return <span key={index}>{part.content}</span>;
    }
  });
};

// ----------- MAIN RENDERER ----------------
export default function MarkdownRenderer({ content }) {
  const parseMarkdown = (text) => {
    if (!text) return [];
    const lines = text.split("\n");
    const elements = [];
    let currentParagraph = "";
    let inCodeBlock = false;
    let codeContent = "";
    let listItems = [];
    let inList = false;
    let tableRows = [];
    let inTable = false;

    let blockquoteBuffer = [];
    let blockquoteDepth = 0;
    const flushBlockquote = () => {
      if (blockquoteBuffer.length > 0) {
        elements.push({
          type: "blockquote",
          content: blockquoteBuffer.join("\n"),
          depth: blockquoteDepth,
        });
        blockquoteBuffer = [];
        blockquoteDepth = 0;
      }
    };

    const flushParagraph = () => {
      if (currentParagraph.trim()) {
        elements.push({ type: "paragraph", content: currentParagraph.trim() });
        currentParagraph = "";
      }
    };
    const flushList = () => {
      if (listItems.length > 0) {
        const listType = listItems[0].type;
        elements.push({
          type: listType,
          items: listItems.map((i) => i.content),
        });
        listItems = [];
        inList = false;
      }
    };
    const flushTable = () => {
      if (tableRows.length > 0) {
        elements.push({ type: "table", rows: tableRows });
        tableRows = [];
        inTable = false;
      }
    };

    lines.forEach((line) => {
      if (line.trim() === "```") {
        if (inCodeBlock) {
          elements.push({ type: "codeblock", content: codeContent });
          codeContent = "";
          inCodeBlock = false;
        } else {
          flushParagraph();
          flushList();
          flushTable();
          flushBlockquote();
          inCodeBlock = true;
        }
        return;
      }
      if (inCodeBlock) {
        codeContent += line + "\n";
        return;
      }

      const imgMatch = line.match(/!\[([^\]]*)\]\(([^)]+)\)/);
      if (imgMatch) {
        flushParagraph();
        flushList();
        flushTable();
        flushBlockquote();
        elements.push({ type: "image", alt: imgMatch[1], url: imgMatch[2] });
        return;
      }

      if (line.startsWith("|")) {
        flushParagraph();
        flushList();
        flushBlockquote();
        const row = line
          .split("|")
          .slice(1, -1)
          .map((c) => c.trim());
        tableRows.push(row);
        inTable = true;
        return;
      } else if (inTable && line.trim() === "") {
        flushTable();
      }

      if (line.startsWith("###### "))
        return elements.push({ type: "h6", content: line.substring(7) });
      if (line.startsWith("##### "))
        return elements.push({ type: "h5", content: line.substring(6) });
      if (line.startsWith("#### "))
        return elements.push({ type: "h4", content: line.substring(5) });
      if (line.startsWith("### "))
        return elements.push({ type: "h3", content: line.substring(4) });
      if (line.startsWith("## "))
        return elements.push({ type: "h2", content: line.substring(3) });
      if (line.startsWith("# "))
        return elements.push({ type: "h1", content: line.substring(2) });

      if (line.startsWith(">")) {
        const depth = line.match(/^>+/)[0].length;
        const text = line.replace(/^>+\s*/, "");
        if (blockquoteBuffer.length > 0 && depth !== blockquoteDepth) {
          flushBlockquote();
        }
        if (blockquoteBuffer.length === 0) blockquoteDepth = depth;
        blockquoteBuffer.push(text || "");
        return;
      } else if (blockquoteBuffer.length > 0) {
        flushBlockquote();
      }

      if (line.match(/^[\*\-\+]\s+/)) {
        listItems.push({
          type: "ul",
          content: line.replace(/^[\*\-\+]\s+/, ""),
        });
        inList = true;
        return;
      }

      if (line.match(/^\d+\.\s+/)) {
        listItems.push({ type: "ol", content: line.replace(/^\d+\.\s+/, "") });
        inList = true;
        return;
      }
      if (inList && line.trim() === "") {
        flushList();
        return;
      }

      if (line.trim() === "") {
        flushParagraph();
        flushList();
        flushTable();
        flushBlockquote();
        return;
      }
      if (/^\s*---\s*$/.test(line)) {
        flushParagraph();
        flushList();
        flushTable();
        flushBlockquote();
        elements.push({ type: "hr" });
        return;
      }

      if (currentParagraph) currentParagraph += " " + line;
      else currentParagraph = line;
    });

    flushParagraph();
    flushList();
    flushTable();
    flushBlockquote();
    return elements;
  };

  const elements = parseMarkdown(content);

  return (
    <div style={styles.container}>
      {elements.map((element, index) => {
        switch (element.type) {
          case "h1":
            return (
              <h1 key={index} style={styles.heading1}>
                <RenderInlineText text={element.content} />
              </h1>
            );
          case "h2":
            return (
              <h2 key={index} style={styles.heading2}>
                <RenderInlineText text={element.content} />
              </h2>
            );
          case "h3":
            return (
              <h3 key={index} style={styles.heading3}>
                <RenderInlineText text={element.content} />
              </h3>
            );
          case "h4":
            return (
              <h4 key={index} style={styles.heading4}>
                <RenderInlineText text={element.content} />
              </h4>
            );
          case "h5":
            return (
              <h5 key={index} style={styles.heading5}>
                <RenderInlineText text={element.content} />
              </h5>
            );
          case "h6":
            return (
              <h6 key={index} style={styles.heading6}>
                <RenderInlineText text={element.content} />
              </h6>
            );
          case "paragraph":
            return (
              <p key={index} style={styles.paragraph}>
                <RenderInlineText text={element.content} />
              </p>
            );
          case "ul":
            return (
              <ul key={index} style={styles.ul}>
                {element.items.map((item, i) => (
                  <li key={i} style={styles.li}>
                    <RenderInlineText text={item} />
                  </li>
                ))}
              </ul>
            );
          case "ol":
            return (
              <ol key={index} style={styles.ol}>
                {element.items.map((item, i) => (
                  <li key={i} style={styles.li}>
                    <RenderInlineText text={item} />
                  </li>
                ))}
              </ol>
            );
          case "hr":
            return <hr key={index} style={styles.hr} />;
          case "blockquote":
            return (
              <blockquote
                key={index}
                style={{
                  ...styles.blockquote,
                  marginLeft: `${(element.depth - 1) * 16}px`,
                }}
              >
                {element.content.split("\n").map((line, i) => {
                  if (!line.trim()) return <br key={i} />;

                  if (line.startsWith("#### ")) {
                    return (
                      <h4 key={i} style={styles.heading4}>
                        <RenderInlineText text={line.slice(5)} />
                      </h4>
                    );
                  }
                  if (line.startsWith("### ")) {
                    return (
                      <h3 key={i} style={styles.heading3}>
                        <RenderInlineText text={line.slice(4)} />
                      </h3>
                    );
                  }
                  if (line.startsWith("## ")) {
                    return (
                      <h2 key={i} style={styles.heading2}>
                        <RenderInlineText text={line.slice(3)} />
                      </h2>
                    );
                  }
                  if (line.startsWith("# ")) {
                    return (
                      <h1 key={i} style={styles.heading1}>
                        <RenderInlineText text={line.slice(2)} />
                      </h1>
                    );
                  }

                  if (line.match(/^[\*\-\+]\s+/)) {
                    return (
                      <ul key={i} style={styles.ul}>
                        <li style={styles.li}>
                          <RenderInlineText
                            text={line.replace(/^[\*\-\+]\s+/, "")}
                          />
                        </li>
                      </ul>
                    );
                  }
                  if (line.match(/^\d+\.\s+/)) {
                    return (
                      <ol key={i} style={styles.ol}>
                        <li style={styles.li}>
                          <RenderInlineText
                            text={line.replace(/^\d+\.\s+/, "")}
                          />
                        </li>
                      </ol>
                    );
                  }

                  return (
                    <p key={i} style={styles.paragraph}>
                      <RenderInlineText text={line} />
                    </p>
                  );
                })}
              </blockquote>
            );
          case "codeblock":
            return (
              <pre key={index} style={styles.codeBlock}>
                <code>{element.content}</code>
              </pre>
            );
          case "image":
            return (
              <img
                key={index}
                src={element.url}
                alt={element.alt}
                style={styles.image}
              />
            );
          case "table":
            return (
              <table key={index} style={styles.table}>
                <thead>
                  <tr>
                    {element.rows[0].map((cell, i) => (
                      <th key={i} style={styles.th}>
                        {cell}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {element.rows.slice(1).map((row, i) => (
                    <tr key={i}>
                      {row.map((cell, j) => (
                        <td key={j} style={styles.td}>
                          {cell}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            );
          default:
            return null;
        }
      })}
    </div>
  );
}
