// src/components/SearchBar.jsx
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSearch, faTimes } from '@fortawesome/free-solid-svg-icons';
import '../../styles/search-bar.css'

interface Result{
    id: string;
    title: string;
    context: string;
    path: string;
}

function SearchBar(): JSX.Element {
  const [searchTerm, setSearchTerm] = useState('');
  const [searchResults, setSearchResults] = useState<Result[]>([]);
  const [isSearching, setIsSearching] = useState(false);

  // マークダウンファイルを検索する関数
  const searchMarkdownFiles = async (term: string) => {
    if (!term.trim()) {
      setSearchResults([]);
      return;
    }

    setIsSearching(true);
    try {
      // すべてのマークダウンファイルをインポート
      const markdownFiles = import.meta.glob('../../contents/*.md', { as: 'raw' });
      const results: Result[] = [];

      for (const [path, loadFile] of Object.entries(markdownFiles)) {
        const content = await loadFile();
        const fileName = path.split('/').pop()?.replace('.md', '') || '';
        
        // タイトルを抽出（最初のh1タグの内容）
        const titleMatch = content.match(/^#\s+(.+)$/m);
        const title = titleMatch ? titleMatch[1] : fileName;

        // 検索語句でコンテンツを検索
        if (
          content.toLowerCase().includes(term.toLowerCase()) ||
          fileName.toLowerCase().includes(term.toLowerCase())
        ) {
          // 検索語句を含む部分の前後の文脈を抽出
          const contextMatch = content.toLowerCase().indexOf(term.toLowerCase());
          const start = Math.max(0, contextMatch - 50);
          const end = Math.min(content.length, contextMatch + 100);
          const context = content.slice(start, end).replace(/\n/g, ' ').trim();

          results.push({
            id: fileName,
            title,
            context: '...' + context + '...',
            path: path
          });
        }
      }

      setSearchResults(results);
    } catch (error) {
      console.error('Search error:', error);
    }
    setIsSearching(false);
  };

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>): void => {
    const term = e.target.value;
    setSearchTerm(term);
    searchMarkdownFiles(term);
  };

  const clearSearch = () => {
    setSearchTerm('');
    setSearchResults([]);
  };

  return (
    <div className="search-container">
      <div className="search-input-wrapper">
        <FontAwesomeIcon icon={faSearch} className="search-icon" />
        <input
          type="text"
          className="search-input"
          placeholder="ドキュメント内検索..."
          value={searchTerm}
          onChange={handleSearch}
        />
        {searchTerm && (
          <button className="clear-search" onClick={clearSearch}>
            <FontAwesomeIcon icon={faTimes} />
          </button>
        )}
      </div>

      {searchTerm && (
        <div className="search-results">
          {isSearching ? (
            <div className="search-loading">検索中...</div>
          ) : searchResults.length > 0 ? (
            <ul className="results-list">
              {searchResults.map((result) => (
                <li key={result.id} className="result-item">
                  <Link
                    to={`/${result.id}`}
                    className="result-link"
                    onClick={clearSearch}
                  >
                    <h4 className="result-title">{result.title}</h4>
                    <p className="result-context">{result.context}</p>
                  </Link>
                </li>
              ))}
            </ul>
          ) : (
            <div className="no-results">
              検索結果が見つかりませんでした
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default SearchBar;