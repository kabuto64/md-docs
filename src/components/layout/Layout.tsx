import { Outlet } from 'react-router-dom';
import Navigation from './Navigation';
import '../../styles/layout.css'
function Layout() : JSX.Element{
  return (
    <div className="app-container">
      <Navigation />
      <main className="content">
        <Outlet />
      </main>
    </div>
  );
}

export default Layout;