import { Link } from "react-router-dom";
import { CartItem, User } from "../src/App";

interface CartProps {
  cart: CartItem[];
  updateQuantity: (itemId: string, quantity: number) => void;
  removeFromCart: (itemId: string) => void;
  clearCart: () => void;
  cartTotal: number;
  user: User | null;
}

export default function Cart({
  cart,
  updateQuantity,
  removeFromCart,
  clearCart,
  cartTotal,
  user,
}: CartProps) {
  const handleCheckout = async () => {
    if (!user) {
      alert("Je moet ingelogd zijn om te bestellen");
      return;
    }

    // Hier kun je later de order API aanroepen
    alert("Bestelling geplaatst! (Demo)");
    clearCart();
  };

  if (cart.length === 0) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-16 text-center">
        <h1 className="text-3xl font-bold text-gray-800 mb-4">
          Je winkelwagen is leeg
        </h1>
        <p className="text-gray-600 mb-8">
          Voeg producten toe om te beginnen met winkelen
        </p>
        <Link
          to="/"
          className="inline-block bg-blue-600 hover:bg-blue-700 text-white font-medium px-6 py-3 rounded-lg transition-colors"
        >
          Bekijk producten
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-gray-800 mb-8">Winkelwagen</h1>

      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        {/* Cart Items */}
        <div className="divide-y divide-gray-200">
          {cart.map((item) => (
            <div
              key={item.id}
              className="p-6 flex items-center justify-between"
            >
              <div className="flex items-center space-x-4">
                <div className="w-16 h-16 bg-gray-100 rounded-lg flex items-center justify-center">
                  {item.image_url ? (
                    <img
                      src={item.image_url}
                      alt={item.name}
                      className="max-h-full max-w-full object-contain"
                    />
                  ) : (
                    <span className="text-2xl">🎴</span>
                  )}
                </div>
                <div>
                  <h3 className="font-semibold text-gray-800">{item.name}</h3>
                  <p className="text-gray-600">€{item.price.toFixed(2)}</p>
                </div>
              </div>

              <div className="flex items-center space-x-4">
                {/* Quantity Controls */}
                <div className="flex items-center border border-gray-300 rounded-lg">
                  <button
                    onClick={() => updateQuantity(item.id, item.quantity - 1)}
                    className="px-3 py-1 text-gray-600 hover:bg-gray-100 transition-colors"
                  >
                    -
                  </button>
                  <span className="px-4 py-1 border-x border-gray-300">
                    {item.quantity}
                  </span>
                  <button
                    onClick={() => updateQuantity(item.id, item.quantity + 1)}
                    className="px-3 py-1 text-gray-600 hover:bg-gray-100 transition-colors"
                  >
                    +
                  </button>
                </div>

                {/* Item Total */}
                <div className="w-24 text-right font-semibold">
                  €{(item.price * item.quantity).toFixed(2)}
                </div>

                {/* Remove Button */}
                <button
                  onClick={() => removeFromCart(item.id)}
                  className="text-red-500 hover:text-red-700 transition-colors"
                >
                  🗑️
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Cart Summary */}
        <div className="bg-gray-50 p-6">
          <div className="flex justify-between items-center mb-4">
            <span className="text-gray-600">Subtotaal:</span>
            <span className="text-xl font-bold">€{cartTotal.toFixed(2)}</span>
          </div>

          <div className="flex space-x-4">
            <button
              onClick={clearCart}
              className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-800 font-medium py-3 rounded-lg transition-colors"
            >
              Wagen legen
            </button>
            <button
              onClick={handleCheckout}
              className="flex-1 bg-green-600 hover:bg-green-700 text-white font-medium py-3 rounded-lg transition-colors"
            >
              {user ? "Bestellen" : "Log in om te bestellen"}
            </button>
          </div>

          {!user && (
            <p className="text-center text-sm text-gray-500 mt-4">
              <Link to="/login" className="text-blue-600 hover:underline">
                Log in
              </Link>{" "}
              of{" "}
              <Link to="/register" className="text-blue-600 hover:underline">
                registreer
              </Link>{" "}
              om je bestelling te plaatsen
            </p>
          )}
        </div>
      </div>

      {/* Continue Shopping */}
      <div className="mt-6 text-center">
        <Link
          to="/"
          className="text-blue-600 hover:underline"
        >
          ← Verder winkelen
        </Link>
      </div>
    </div>
  );
}