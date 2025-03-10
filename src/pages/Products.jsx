import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';

const PRODUCTS = [
  {
    id: 1,
    productName: 'Professional DSLR Camera',
    description: 'High-end camera for professional photography',
    price: 1299,
    image: 'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=400&q=80'
  },
  {
    id: 2,
    productName: 'Smartphone Pro Max',
    description: 'Latest flagship smartphone with advanced features',
    price: 999,
    image: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=400&q=80'
  },
  {
    id: 3,
    productName: 'Ultra-Slim Laptop',
    description: 'Powerful laptop for work and entertainment',
    price: 1499,
    image: 'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=400&q=80'
  },
  {
    id: 4,
    productName: 'Retro Instant Camera',
    description: 'Vintage-style camera for instant memories',
    price: 89,
    image: 'https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?w=400&q=80'
  }
];

function Products() {
  const { user } = useAuth();
  const { addToCart } = useCart();
  const [addedToCart, setAddedToCart] = useState({});

  const handleAddToCart = (product) => {
    if (!user) {
      alert('Please login to add items to cart');
      return;
    }
    
    addToCart(product);
    setAddedToCart(prev => ({ ...prev, [product.id]: true }));
    setTimeout(() => {
      setAddedToCart(prev => ({ ...prev, [product.id]: false }));
    }, 2000);
  };

  return (
    <div>
      <h2 className="text-3xl font-bold mb-8 text-center">Our Products</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-14">
        {PRODUCTS.map(product => (
          <div key={product.id} className="bg-white rounded-lg shadow-md overflow-hidden w-82">
            <img
              src={product.image}
              alt={product.name}
              className="w-full h-48 object-cover"
            />
            <div className="p-4">
              <h3 className="text-xl font-semibold mb-2">{product.name}</h3>
              <p className="text-gray-600 mb-4">{product.description}</p>
              <div className="flex justify-between items-center">
                <span className="text-xl font-bold">&#8377;&nbsp;{product.price}</span>
                <button
                  onClick={() => handleAddToCart(product)}
                  className={`btn ${
                    addedToCart[product.id] ? 'bg-green-500' : 'btn-primary'
                  }`}
                >
                  {addedToCart[product.id] ? 'Added!' : 'Add to Cart'}
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Products;