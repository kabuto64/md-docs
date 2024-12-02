import { useState, useEffect } from 'react';

interface TableOfContentsProps {
  content: string;
}

interface Heading {
  level: number;
  title: string;
  id: string;
}

const TableOfContents: React.FC<TableOfContentsProps> = ({ content }) => {
  const [headings, setHeadings] = useState<Heading[]>([]);

  useEffect(() => {
    // Markdownからヘッダーを抽出
    const extractHeaders = (markdownContent: string): Heading[] => {
      return markdownContent
        .split('\n')
        .filter((line: string): boolean => line.startsWith('#'))
        .map((header: string): Heading => {
          const headerMatch = header.match(/^#+/);
          if (!headerMatch) {
            throw new Error('Invalid header format');
          }

          const level = headerMatch[0].length;
          const title = header.replace(/^#+\s/, '').replace(/\r/, '');
          const id = title.toLowerCase().replace(/[^a-z0-9]+/g, '-');

          return { level, title, id };
        });
    };

    try {
      const extractedHeaders = extractHeaders(content);
      setHeadings(extractedHeaders);
    } catch (error) {
      console.error('Error extracting headers:', error instanceof Error ? error.message : String(error));
      setHeadings([]);
    }
  }, [content]);

  const scrollToHeader = (id: string): void => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <nav className="table-of-contents" aria-label="目次">
      <h3 className="toc-title">目次</h3>
      {headings.length > 0 ? (
        <ul className="toc-list">
          {headings.map((heading, index) => (
            <li
              key={`${heading.id}-${index}`}
              className={`toc-item depth-${heading.level}`}
              style={{ marginLeft: `${(heading.level - 1) * 1}rem` }}
            >
              <button
                onClick={() => scrollToHeader(heading.id)}
                className="toc-link"
                type="button"
                aria-label={`${heading.title}へスクロール`}
              >
                {heading.title}
              </button>
            </li>
          ))}
        </ul>
      ) : (
        <p className="toc-empty">目次がありません</p>
      )}
    </nav>
  );
};

export default TableOfContents;