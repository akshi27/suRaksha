import { Link, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Shield, Activity, LogOut, Bell } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

interface NavbarProps {
  alertCount?: number;
}

const Navbar = ({ alertCount = 0 }: NavbarProps) => {
  const { user, logout } = useAuth();
  const location = useLocation();

  const navItems = [
    { path: '/dashboard', label: 'Dashboard', icon: Shield },
    { path: '/approved', label: 'Approved', icon: Shield },
    { path: '/activity-log', label: 'Live Activity Log', icon: Activity },
  ];

  return (
    <motion.nav
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      className="bg-white border-b border-gray-200 sticky top-0 z-50"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <Link to="/dashboard" className="flex items-center space-x-2">
            <Shield className="h-8 w-8 text-blue-600" />
            <span className="text-xl font-bold text-gray-900">
              Nexavault
            </span>
          </Link>

          <div className="flex items-center space-x-6">
            <div className="flex space-x-4">
              {navItems.map((item) => {
                const Icon = item.icon;
                const isActive = location.pathname === item.path;

                return (
                  <Link
                    key={item.path}
                    to={item.path}
                    className={`flex items-center space-x-2 px-3 py-2 rounded-lg transition-all duration-200 ${
                      isActive
                        ? 'bg-blue-100 text-blue-700'
                        : 'text-gray-600 hover:text-blue-600 hover:bg-blue-50'
                    }`}
                  >
                    <Icon className="h-4 w-4" />
                    <span className="text-sm font-medium">{item.label}</span>
                  </Link>
                );
              })}
            </div>

            <div className="flex items-center space-x-4">
              <button
                className="relative p-2 text-gray-600 hover:text-blue-600 transition-colors"
                aria-label="Notifications"
              >
                <Bell className="h-5 w-5" />
                {alertCount > 0 && (
                  <span className="absolute -top-1 -right-1 text-[10px] bg-red-500 text-white rounded-full h-4 w-4 flex items-center justify-center">
                    {alertCount}
                  </span>
                )}
              </button>

              <div className="flex items-center space-x-3">
                <div className="text-right">
                  <div className="text-sm font-medium text-gray-900">{user?.name}</div>
                  <div className="text-xs text-gray-500">{user?.email}</div>
                </div>
                <button
                  onClick={logout}
                  className="p-2 text-gray-600 hover:text-red-600 transition-colors"
                  title="Logout"
                  aria-label="Logout"
                >
                  <LogOut className="h-5 w-5" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </motion.nav>
  );
};

export default Navbar;
