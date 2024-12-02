import { useState, useEffect } from 'react';
import mermaid, { MermaidConfig } from 'mermaid';

// Mermaidの設定型定義
const mermaidConfig: MermaidConfig = {
  startOnLoad: true,
  theme: 'dark',
  securityLevel: 'loose',
  themeVariables: {
    darkMode: true,
    background: '#0d1117',
    primaryColor: '#58a6ff',
    primaryTextColor: '#c9d1d9',
    primaryBorderColor: '#30363d',
    lineColor: '#8b949e',
    secondaryColor: '#161b22',
    tertiaryColor: '#292e36'
  }
};

// Mermaidの初期設定
mermaid.initialize(mermaidConfig);

interface MermaidRendererProps {
  content: string;
}

interface DangerousHTML {
  __html: string;
}

const MermaidRenderer: React.FC<MermaidRendererProps> = ({ content }) => {
  const [svg, setSvg] = useState<string>('');
  
  useEffect(() => {
    const renderDiagram = async (): Promise<void> => {
      try {
        const id = `mermaid-${Math.random().toString(36).substr(2, 9)}`;
        const { svg: renderedSvg } = await mermaid.render(id, content);
        setSvg(renderedSvg);
      } catch (error) {
        console.error('Mermaid rendering failed:', error instanceof Error ? error.message : String(error));
        setSvg('');
      }
    };
    
    renderDiagram();
  }, [content]);

  const createMarkup = (): DangerousHTML => ({
    __html: svg
  });

  return svg ? (
    <div 
      className="mermaid-diagram" 
      dangerouslySetInnerHTML={createMarkup()} 
    />
  ) : (
    <div className="mermaid-error">図の生成に失敗しました</div>
  );
};

export default MermaidRenderer;