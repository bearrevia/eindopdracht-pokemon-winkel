import { Link } from "react-router-dom";
import { User } from "../src/App";

interface HeaderProps {
  user: User | null;
  onLogout: () => void;
}

export default function Header({ user, onLogout }: HeaderProps) {
  return (
    <header className="bg-blue-600 text-white shadow-lg sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
        <Link to="/" className="text-2xl font-bold hover:text-blue-200">
          🎮 Pokemon Winkel
        </Link>

        <div className="flex items-center space-x-4">
          {user ? (
            <div className="flex items-center space-x-4">
              <span className="text-sm">
                Welkom, <span className="font-semibold">{user.first_name || user.email}</span>
              </span>
              <button
                onClick={onLogout}
                className="bg-red-500 hover:bg-red-600 px-4 py-2 rounded-md text-sm font-medium transition-colors"
              >
                Uitloggen
              </button>
            </div>
          ) : (
            <div className="flex flex-col items-end">
              <Link
                to="/login"
                className="bg-white text-blue-600 hover:bg-blue-50 px-4 py-2 rounded-md text-sm font-medium transition-colors"
              >
                Inloggen
              </Link>
              <Link
                to="/register"
                className="text-xs text-blue-200 hover:text-white mt-1"
              >
                Nog geen account? Registreer hier
              </Link>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}