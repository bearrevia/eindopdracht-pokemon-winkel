import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import type { User, Order } from "../src/types";

interface OrdersProps {
  user: User | null;
}

export default function Orders({ user }: OrdersProps) {
  const navigate = useNavigate();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [expandedOrder, setExpandedOrder] = useState<string | null>(null);

  useEffect(() => {
    if (!user) {
      navigate("/login");
      return;
    }
    fetchOrders();
  }, [user, navigate]);

  const fetchOrders = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch("http://127.0.0.1:8000/api/orders/", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) throw new Error("Kon bestellingen niet ophalen");
      const data = await response.json();
      setOrders(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Er is een fout opgetreden");
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("nl-NL", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "pending":
        return "bg-yellow-100 text-yellow-800";
      case "processing":
        return "bg-blue-100 text-blue-800";
      case "shipped":
        return "bg-purple-100 text-purple-800";
      case "delivered":
        return "bg-green-100 text-green-800";
      case "cancelled":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case "pending":
        return "In afwachting";
      case "processing":
        return "In behandeling";
      case "shipped":
        return "Verzonden";
      case "delivered":
        return "Bezorgd";
      case "cancelled":
        return "Geannuleerd";
      default:
        return status;
    }
  };

  if (!user) {
    return null;
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-gray-800 mb-8">Mijn Bestellingen</h1>

      {loading && (
        <div className="text-center py-12">
          <p className="text-gray-500">Bestellingen laden...</p>
        </div>
      )}

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}

      {!loading && !error && orders.length === 0 && (
        <div className="text-center py-12">
          <p className="text-gray-500 mb-4">Je hebt nog geen bestellingen geplaatst</p>
          <Link
            to="/"
            className="inline-block bg-blue-600 hover:bg-blue-700 text-white font-medium px-6 py-3 rounded-lg transition-colors"
          >
            Begin met winkelen
          </Link>
        </div>
      )}

      <div className="space-y-4">
        {orders.map((order) => (
          <div
            key={order.id}
            className="bg-white rounded-lg shadow-md overflow-hidden"
          >
            {/* Order Header */}
            <div
              className="p-6 cursor-pointer hover:bg-gray-50 transition-colors"
              onClick={() => setExpandedOrder(expandedOrder === order.id ? null : order.id)}
            >
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-sm text-gray-500 mb-1">
                    Bestelling geplaatst op {formatDate(order.created_at)}
                  </p>
                  <p className="text-sm text-gray-500">
                    Bestelnummer: <span className="font-mono">{order.id.slice(0, 8)}...</span>
                  </p>
                </div>
                <div className="text-right">
                  <span className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(order.status)}`}>
                    {getStatusText(order.status)}
                  </span>
                  <p className="text-xl font-bold text-gray-800 mt-2">
                    €{order.total_amount.toFixed(2)}
                  </p>
                </div>
              </div>

              <div className="flex items-center justify-between mt-4">
                <p className="text-sm text-gray-600">
                  {order.items.length} product{order.items.length !== 1 ? "en" : ""}
                </p>
                <span className="text-blue-600 text-sm">
                  {expandedOrder === order.id ? "▲ Minder details" : "▼ Meer details"}
                </span>
              </div>
            </div>

            {/* Order Details (Expanded) */}
            {expandedOrder === order.id && (
              <div className="border-t border-gray-200 p-6 bg-gray-50">
                {/* Products */}
                <h3 className="font-semibold text-gray-800 mb-3">Producten</h3>
                <div className="space-y-2 mb-6">
                  {order.items.map((item) => (
                    <div
                      key={item.id}
                      className="flex justify-between items-center bg-white p-3 rounded-lg"
                    >
                      <div>
                        <p className="font-medium text-gray-800">{item.product_name}</p>
                        <p className="text-sm text-gray-500">
                          {item.quantity}x €{item.product_price.toFixed(2)}
                        </p>
                      </div>
                      <p className="font-semibold">
                        €{(item.quantity * item.product_price).toFixed(2)}
                      </p>
                    </div>
                  ))}
                </div>

                {/* Shipping Address */}
                <h3 className="font-semibold text-gray-800 mb-3">Bezorgadres</h3>
                <div className="bg-white p-3 rounded-lg">
                  <p className="text-gray-700">
                    {order.street} {order.house_number}
                  </p>
                  <p className="text-gray-700">
                    {order.postal_code} {order.city}
                  </p>
                  <p className="text-gray-700">{order.country}</p>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Back to Shop */}
      <div className="mt-8 text-center">
        <Link to="/" className="text-blue-600 hover:underline">
          ← Terug naar winkel
        </Link>
      </div>
    </div>
  );
}
