import { useAuth } from '../context/AuthContext';
import {useCart} from '../context/CartContext';
import { Link } from 'react-router-dom';
import { useEffect } from 'react';

function Navbar() {
  const { user, login, logout } = useAuth();
  const { cartDetails } = useCart();

  useEffect(() => {
    cartDetails();
  }, []);

  return (
    <nav className="bg-white shadow-lg">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex items-center">
            <Link to="/" className="text-xl font-bold text-gray-800">
              TechStore
            </Link>
          </div>

          {/* Navigation Links */}
          <div className={`flex-1 flex ${user ? 'justify-center' : 'justify-center'}`}>
            <Link to="/products" className={`text-gray-600 hover:text-gray-800 text-lg ${user ? 'mr-60' : ''}`}>
                Products
              </Link>

              {user && (
                <>
                  {/* Cart Link */}
                  <Link to="/cart" className={`text-gray-600 hover:text-gray-800 text-lg ml-28 `} onClick={cartDetails}>
                    Cart
                  </Link>
                </>
              )}
          </div>

          {/* User Actions */}
          <div className="flex items-center space-x-4">
            {user && (
              <>
                {/*Logout Button */}
                <div className="flex items-center space-x-4">
                  <button onClick={logout} className="btn btn-secondary">
                    Logout
                  </button>
                </div>
              </>
            )}

            {/* Login Button */}
            {!user && (
              <button onClick={login} className="btn btn-primary" style={{ marginLeft: '50px' }}>
                Login with Google
              </button>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;