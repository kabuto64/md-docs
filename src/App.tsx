import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Layout from './components/layout/Layout';
import MarkdownViewer from './components/viewer/MarkdownViewer';
import { useEffect, useState } from 'react';

function App() : JSX.Element{
  const [firstDoc, setFirstDoc] = useState<string>('');

  useEffect(() => {
    // 最初のドキュメント名を取得
    const modules = import.meta.glob('./contents/*.md');
    const firstPath = Object.keys(modules)[0];
    if (firstPath) {
      const docName = firstPath.split('/').pop()?.replace('.md', '') || '';
      setFirstDoc(docName);
    }
  }, []);

  return (
    <>
      <Router>
      <Routes>
        <Route path="/" element={<Layout />}>
            <Route index element={
                firstDoc ? <Navigate to={`/${firstDoc}`} replace /> : null
            } />
          <Route path=":docId" element={<MarkdownViewer />} />
        </Route>
      </Routes>
    </Router>
    </>
  )
}

export default App
