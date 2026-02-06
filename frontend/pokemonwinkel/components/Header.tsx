import { Link } from "react-router-dom";
import type { User } from "../src/types";

interface HeaderProps {
  user: User | null;
  onLogout: () => void;
  cartItemCount: number;
}

export default function Header({ user, onLogout, cartItemCount }: HeaderProps) {
  return (
    <header className="bg-blue-600 text-white shadow-lg sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
        <Link to="/" className="hover:opacity-90 transition-opacity">
          <img src="/pokeshop-logo.svg" alt="PokéShop" className="h-10" />
        </Link>

        <div className="flex items-center space-x-4">
          {/* Winkelwagen */}
          <Link
            to="/cart"
            className="relative bg-yellow-500 hover:bg-yellow-600 px-4 py-2 rounded-md text-sm font-medium transition-colors flex items-center"
          >
            🛒
            {cartItemCount > 0 && (
              <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">
                {cartItemCount}
              </span>
            )}
          </Link>

          {user ? (
            <div className="flex items-center space-x-4">
              <Link
                to="/orders"
                className="bg-yellow-500 hover:bg-yellow-600 text-gray-900 px-4 py-2 rounded-md text-sm font-medium transition-colors"
              >
                Mijn Bestellingen
              </Link>
              {user.is_admin && (
                <Link
                  to="/admin"
                  className="bg-yellow-500 hover:bg-yellow-600 text-gray-900 px-4 py-2 rounded-md text-sm font-medium transition-colors"
                >
                  Admin Panel
                </Link>
              )}
              <span className="text-sm">
                Welkom, <span className="font-semibold">{user.first_name || user.email}</span>
              </span>
              <button
                onClick={onLogout}
                className="bg-yellow-500 hover:bg-yellow-600 text-gray-900 px-4 py-2 rounded-md text-sm font-medium transition-colors"
              >
                Uitloggen
              </button>
            </div>
          ) : (
            <Link
              to="/login"
              className="bg-yellow-500 hover:bg-yellow-600 text-gray-900 px-4 py-2 rounded-md text-sm font-medium transition-colors"
            >
              Inloggen
            </Link>
          )}
        </div>
      </div>
    </header>
  );
}