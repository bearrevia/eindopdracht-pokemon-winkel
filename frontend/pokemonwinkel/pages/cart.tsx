import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import type { CartItem, User, AddressForm } from "../src/types";

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
  const navigate = useNavigate();
  const [showCheckout, setShowCheckout] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [address, setAddress] = useState<AddressForm>({
    street: "",
    house_number: "",
    postal_code: "",
    city: "",
    country: "Nederland",
  });

  const handleAddressChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setAddress((prev) => ({ ...prev, [name]: value }));
  };

  const handleCheckout = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user) {
      alert("Je moet ingelogd zijn om te bestellen");
      return;
    }

    // Valideer adres
    if (!address.street || !address.house_number || !address.postal_code || !address.city) {
      setError("Vul alle adresvelden in");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const token = localStorage.getItem("token");
      const orderData = {
        items: cart.map((item) => ({
          item_id: item.id,
          product_name: item.name,
          product_price: item.price,
          quantity: item.quantity,
        })),
        address: address,
      };

      const response = await fetch("http://127.0.0.1:8000/api/orders/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(orderData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || "Kon bestelling niet plaatsen");
      }

      clearCart();
      alert("Bestelling succesvol geplaatst!");
      navigate("/orders");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Er is een fout opgetreden");
    } finally {
      setLoading(false);
    }
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

          {!showCheckout ? (
            <div className="flex space-x-4">
              <button
                onClick={clearCart}
                className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-800 font-medium py-3 rounded-lg transition-colors"
              >
                Wagen legen
              </button>
              <button
                onClick={() => user ? setShowCheckout(true) : alert("Log in om te bestellen")}
                className="flex-1 bg-green-600 hover:bg-green-700 text-white font-medium py-3 rounded-lg transition-colors"
              >
                {user ? "Naar afrekenen" : "Log in om te bestellen"}
              </button>
            </div>
          ) : null}

          {!user && !showCheckout && (
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

      {/* Checkout Form */}
      {showCheckout && user && (
        <div className="mt-8 bg-white rounded-lg shadow-md p-6">
          <h2 className="text-2xl font-bold text-gray-800 mb-6">Bezorgadres</h2>

          {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
              {error}
            </div>
          )}

          <form onSubmit={handleCheckout} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label htmlFor="street" className="block text-sm font-medium text-gray-700 mb-1">
                  Straatnaam *
                </label>
                <input
                  type="text"
                  id="street"
                  name="street"
                  value={address.street}
                  onChange={handleAddressChange}
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Bijv. Hoofdstraat"
                />
              </div>

              <div>
                <label htmlFor="house_number" className="block text-sm font-medium text-gray-700 mb-1">
                  Huisnummer *
                </label>
                <input
                  type="text"
                  id="house_number"
                  name="house_number"
                  value={address.house_number}
                  onChange={handleAddressChange}
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Bijv. 123A"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label htmlFor="postal_code" className="block text-sm font-medium text-gray-700 mb-1">
                  Postcode *
                </label>
                <input
                  type="text"
                  id="postal_code"
                  name="postal_code"
                  value={address.postal_code}
                  onChange={handleAddressChange}
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Bijv. 1234 AB"
                />
              </div>

              <div>
                <label htmlFor="city" className="block text-sm font-medium text-gray-700 mb-1">
                  Plaats *
                </label>
                <input
                  type="text"
                  id="city"
                  name="city"
                  value={address.city}
                  onChange={handleAddressChange}
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Bijv. Amsterdam"
                />
              </div>
            </div>

            <div>
              <label htmlFor="country" className="block text-sm font-medium text-gray-700 mb-1">
                Land
              </label>
              <input
                type="text"
                id="country"
                name="country"
                value={address.country}
                onChange={handleAddressChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            <div className="border-t pt-4 mt-6">
              <div className="flex justify-between items-center mb-4">
                <span className="text-lg font-semibold">Totaal te betalen:</span>
                <span className="text-2xl font-bold text-green-600">€{cartTotal.toFixed(2)}</span>
              </div>

              <div className="flex space-x-4">
                <button
                  type="button"
                  onClick={() => setShowCheckout(false)}
                  className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-800 font-medium py-3 rounded-lg transition-colors"
                >
                  Terug
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="flex-1 bg-green-600 hover:bg-green-700 disabled:bg-green-400 text-white font-medium py-3 rounded-lg transition-colors"
                >
                  {loading ? "Bestelling plaatsen..." : "Bestelling plaatsen"}
                </button>
              </div>
            </div>
          </form>
        </div>
      )}

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