import { createContext, useContext, useState } from 'react';

const CartContext = createContext();

export const useCart = () => useContext(CartContext);

export function CartProvider({ children }) {
  const [cart, setCart] = useState([]);
  const [cartId, setCartId] = useState(null);
  const cartDetails= async () => {
    try{
      const response = await fetch('api/user/cartdetails',{
        method:'GET',
        credentials: "include",
      });
      const data = await response.json();
      setCartId(data.id);
      setCart(data.allItems);
    }catch(error){
      console.error("Failed to fetch cart details:", error.message);
    }
  }

  const addToCart = async (product) => {
    try {
      const userId = localStorage.getItem("userId");
  
      const url = "/api/user/cart/add-item";

      const requestBody = {
          id: product.id,
          name: product.name,
          price: product.price,
          image: product.image
      };
      const response = await fetch("/api/user/cart/add-item", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({
          id: product.id,
          productName: product.productName,
          price: product.price,
          image: product.image,
        }),
      });
  
      if (!response.ok) {
        throw new Error(`Error: ${response.status} - ${response.statusText}`);
      }
  
       await cartDetails();
    } catch (error) {
      console.error("Failed to add item to cart:", error.message);
    }
  };

  const removeFromCart = async (productId) => {
    try{
    const result= await fetch("/api/user/cart/remove-item", {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
      body: JSON.stringify({
        cartId: cartId,
        itemId: productId,
      }),
    });
    if (!result.ok) {
      throw new Error(`Error: ${response.status} - ${response.statusText}`);
    }
    await cartDetails();
  }catch(error){
    console.error("Failed to remove item from cart:", error.message);
  }
  };


  const getCartTotal = () => {
    return cart.reduce((total, item) => total + (item.price * item.quantity), 0);
  };

  const value = {
    cart,
    setCart,
    cartDetails,
    addToCart,
    removeFromCart,
    getCartTotal
  };

  return (
    <CartContext.Provider value={value}>
      {children}
    </CartContext.Provider>
  );
}