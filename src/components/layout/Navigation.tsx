import { Link, useLocation } from 'react-router-dom';
import { useState, useEffect } from 'react';
import '../../styles/navigation.css'
import SearchBar from './SearchBar';
import ThemeToggle from './ThemeToggle'

interface Doc {
    path: string;
    fullName: string;
    displayName: string;
    order: string;
}
function Navigation(): JSX.Element {
  const [docs, setDocs] = useState<Doc[]>([]);
  const location = useLocation();

  useEffect(() => {
    const modules = import.meta.glob('../../contents/*.md');
    const docsPromises = Object.keys(modules).map(async (path) => {
      const fullName = path.split('/').pop()?.replace('.md', '') || "";
      // プレフィックスとタイトルを分離
      const match = fullName.match(/^(\d+)-(.+)$/);
      const order = match ? match[1] : '999'; // プレフィックスがない場合は後ろに
      const displayName = match ? match[2] : fullName; // プレフィックスを除いた名前

      return {
        path,
        fullName, // ルーティング用の完全な名前
        displayName, // 表示用の名前
        order
      };
    });

    Promise.all(docsPromises).then((results) => {
      const sortedDocs = results.sort((a, b) => {
        return parseInt(a.order) - parseInt(b.order);
      });
      setDocs(sortedDocs);
    });
  }, []);

  return (
    <nav className="navigation">
      <SearchBar />
      <div className="nav-content">
        <ul>
          {docs.map(({ fullName, displayName }) => {
            // 現在のパスと一致するかチェック
            const isActive = decodeURIComponent(location.pathname) === `/${fullName}`;
            return (
              <li 
              key={fullName} 
              className={isActive ? 'active' : ''}
              >
                <Link to={`/${fullName}`}>
                  {displayName}
                </Link>
              </li>
            );
          })}
        </ul>
      </div>
      <div>
        <ThemeToggle />
      </div>
    </nav>
  );
}

export default Navigation;