import { Home, FlaskRound as Flask, Microscope, Users, MessageCircle } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';

export default function Sidebar() {
  const location = useLocation();

  const navItems = [
    { icon: Home, label: 'Dashboard', path: '/' },
    { icon: Flask, label: 'Lab Projects', path: '/projects' },
    { icon: Microscope, label: 'Equipment', path: '/equipment' },
    { icon: Users, label: 'Lab Incharges', path: '/incharges' },
    { icon: MessageCircle, label: 'AI Assistant', path: '/assistant' },
  ];

  return (
    <div className="h-screen w-64 bg-indigo-900 text-white p-6">
      <div className="flex items-center gap-3 mb-10">
        <Flask size={32} className="text-indigo-300" />
        <h1 className="text-2xl font-bold">BioLedger</h1>
      </div>
      <nav>
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = location.pathname === item.path;
          return (
            <Link
              key={item.path}
              to={item.path}
              className={`flex items-center gap-3 p-3 rounded-lg mb-2 transition-colors ${
                isActive
                  ? 'bg-indigo-800 text-white'
                  : 'text-indigo-300 hover:bg-indigo-800 hover:text-white'
              }`}
            >
              <Icon size={20} />
              <span>{item.label}</span>
            </Link>
          );
        })}
      </nav>
    </div>
  );
}