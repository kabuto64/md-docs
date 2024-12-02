import { useState, useEffect, ComponentPropsWithoutRef } from 'react';
import { useParams } from 'react-router-dom';
import ReactMarkdown from 'react-markdown';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { oneDark, oneLight } from 'react-syntax-highlighter/dist/esm/styles/prism';
import type { SyntaxHighlighterProps } from 'react-syntax-highlighter';
import MermaidRenderer from './MermaidRenderer';
import TableOfContents from './TableOfContents';

// コードブロックのプロパティの型定義
interface CodeProps extends ComponentPropsWithoutRef<'code'> {
  inline?: boolean;
  className?: string;
  children: React.ReactNode;
}

// ヘッダーのプロパティの型定義
interface HeaderProps {
  children: React.ReactNode;
}

const MarkdownViewer: React.FC = () => {
  const [content, setContent] = useState<string>('');
  const { docId } = useParams<string>();
  const [isDark, setIsDark] = useState<boolean>(() => {
    const saved: string|null = localStorage.getItem('theme');
    const theme = document.documentElement.getAttribute('data-theme');
    return saved ? saved === 'dark' : theme === 'dark';
  });

  useEffect(() => {
    const loadContent = async () => {
      try {
        if (!docId) throw new Error('Document ID is missing');
        const module = await import(`../../contents/${docId}.md?raw`);
        setContent(module.default);
      } catch (error) {
        console.error('Error loading markdown:', error);
        setContent('Document not found');
      }
    };

    loadContent();
  }, [docId]);

  useEffect(() => {
    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        if (mutation.attributeName === 'data-theme') {
          const theme = document.documentElement.getAttribute('data-theme');
          setIsDark(theme === 'dark');
        }
      });
    });

    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['data-theme']
    });

    return () => observer.disconnect();
  }, []);

  // ヘッダーIDを生成するユーティリティ関数
  const generateId = (text: string): string => {
    return text.toString().toLowerCase().replace(/[^a-z0-9]+/g, '-');
  };

  const components: Record<string, React.FC<any>> = {
    code: ({ inline, className, children, ...props }: CodeProps) => {
      const match = /language-(\w+)/.exec(className || '');
      const content = String(children).replace(/\n$/, '');

      if (match && match[1] === 'mermaid') {
        return <MermaidRenderer content={content} />;
      }

      if (!inline && match) {
        return (
          <SyntaxHighlighter
            style={isDark ? oneDark : oneLight}
            language={match[1]}
            PreTag="div"
            {...(props as SyntaxHighlighterProps)}
          >
            {content}
          </SyntaxHighlighter>
        );
      }

      return (
        <code className={className} {...props}>
          {children}
        </code>
      );
    },
    h1: ({ children }: HeaderProps) => (
      <h1 id={generateId(children?.toString() || '')}>{children}</h1>
    ),
    h2: ({ children }: HeaderProps) => (
      <h2 id={generateId(children?.toString() || '')}>{children}</h2>
    ),
    h3: ({ children }: HeaderProps) => (
      <h3 id={generateId(children?.toString() || '')}>{children}</h3>
    ),
    h4: ({ children }: HeaderProps) => (
      <h4 id={generateId(children?.toString() || '')}>{children}</h4>
    )
  };

  return (
    <div className="content-wrapper">
      <div className="markdown-content">
        <ReactMarkdown components={components}>{content}</ReactMarkdown>
      </div>
      <TableOfContents content={content} />
    </div>
  );
};

export default MarkdownViewer;