import { useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import { useCart } from "../context/CartContext";

function Cart() {
  const { cart, removeFromCart, getCartTotal, addToCart,setCart} = useCart();
  const { user } = useAuth();

  const loadRazorpay = async () => {
    return new Promise((resolve) => {
      if (document.querySelector("script[src='https://checkout.razorpay.com/v1/checkout.js']")) {
        resolve(true);
        return;
      }
      const script = document.createElement("script");
      script.src = "https://checkout.razorpay.com/v1/checkout.js";
      script.async = true;
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });
  };

  useEffect(() => {
    loadRazorpay();
  }, []);

  const verifyPayment = async (response) => {
    try {
      const verifyRes = await fetch("/api/payment/verify-payment", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          razorpay_payment_id: response.razorpay_payment_id,
          razorpay_order_id: response.razorpay_order_id,
          razorpay_signature: response.razorpay_signature
        }),
      });

      if (!verifyRes.ok) {
        const errorText = await verifyRes.text();
        throw new Error(`Verification failed: ${verifyRes.status} - ${errorText}`);
      }

      let verifyData;
      const contentType = verifyRes.headers.get("content-type");
      if (contentType && contentType.includes("application/json")) {
        verifyData = await verifyRes.json();
      } else {
        verifyData = await verifyRes.text();
      }

      alert(verifyData.message || verifyData || "Payment Verified Successfully!");

      const createPaymentRes = await fetch("/api/payment/create-payment", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          razorpayOrderId: response.razorpay_order_id,
          razorpayPaymentId: response.razorpay_payment_id,
          razorpaySignature: response.razorpay_signature,
          cartItems: cart.map((item) => ({
            productName: item.productName,
            price: item.price,
            quantity: item.quantity,
          })),
        }),
      });

      if (!createPaymentRes.ok) {
        throw new Error("Failed to create payment record");
      }
      alert("Payment Record Created Successfully!");
      setCart([]);
    } catch (error) {
      console.error("Payment verification failed:", error);
      alert(`Payment process failed: ${error.message}`);
    }
  };

  const handlePayment = async () => {
    try {
      const res = await fetch("/api/payment/create-order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          amount: getCartTotal() * 100,
          currency: "INR",
          receipt: "order_"+Date.now().toString(),
        }),
      });

      if (!res.ok) {
        throw new Error("Failed to create order");
      }
      const data = await res.json();

      if (!data || !data.order_id) {
        throw new Error("Invalid order response");
      }

      const isRazorpayLoaded = await loadRazorpay();
      if (!isRazorpayLoaded) {
        alert("Failed to load Razorpay. Please refresh and try again.");
        return;
      }

      let options = {
        key: import.meta.env.VITE_RAZORPAY_KEY,
        amount: getCartTotal() * 100,
        currency: "INR",
        name: "HARISH SANJAY",
        description: "Order Payment",
        order_id: data.order_id,
        handler: async (response) => await verifyPayment(response),
        prefill: {
          name: user.username,
          email: user.email,
        },
        theme: { color: "#3399cc" },
      };

      var rzp1 = new window.Razorpay(options);
      rzp1.open();
    } catch (error) {
      console.error("Payment initiation failed", error);
      alert(`Payment Failed: ${error.message}`);
    }
  };

  if (cart.length === 0) {
    return (
      <div className="text-center py-8">
        <h2 className="text-2xl font-bold mb-4">Your Cart is Empty</h2>
        <p className="text-gray-600">Start shopping to add items to your cart!</p>
      </div>
    );
  }

  return (
    <div>
      <h2 className="text-3xl font-bold mb-8">Your Cart</h2>
      <div className="space-y-4">
        {cart.map((item) => (
          <div key={item.id} className="flex items-center justify-between bg-white p-4 rounded-lg shadow">
            <div className="flex items-center space-x-4">
              <img src={item.image} alt={item.productName} className="w-16 h-16 object-cover rounded" />
              <div>
                <h3 className="text-lg font-semibold">{item.productName}</h3>
                <p className="text-gray-600">Quantity: {item.quantity}</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-lg font-bold">&#8377;&nbsp;{(item.price * item.quantity).toFixed(2)}</span>
              <button onClick={async () => {await removeFromCart(item.id)}} className="text-red-500 hover:text-red-700">Remove</button>
              <button onClick={async () => {await addToCart(item)}} className="text-green-500 hover:text-green-700">Add</button>
            </div>
          </div>
        ))}
        <div className="mt-8 p-4 bg-gray-50 rounded-lg">
          <div className="text-xl font-bold text-right">Total: &#8377;&nbsp;{getCartTotal().toFixed(2)}</div>
          <button onClick={handlePayment} className="mt-4  bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700">
            Proceed to Payment
          </button>
        </div>
      </div>
    </div>
  );
}

export default Cart;
