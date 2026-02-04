import { useState, useEffect } from "react";
import { CartItem } from "../src/App";

interface Item {
  id: string;
  name: string;
  description: string | null;
  price: number;
  image_url: string | null;
  category: string | null;
  stock: number;
  is_active: boolean;
}

interface WebshopProps {
  addToCart: (item: Omit<CartItem, "quantity">) => void;
}

export default function Webshop({ addToCart }: WebshopProps) {
  const [items, setItems] = useState<Item[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [addedItemId, setAddedItemId] = useState<string | null>(null);

  useEffect(() => {
    fetchItems();
  }, []);

  const fetchItems = async () => {
    try {
      const response = await fetch("http://127.0.0.1:8000/api/items/");
      if (!response.ok) throw new Error("Kon items niet ophalen");
      const data = await response.json();
      setItems(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Er is een fout opgetreden");
    } finally {
      setLoading(false);
    }
  };

  const handleAddToCart = (item: Item) => {
    addToCart({
      id: item.id,
      name: item.name,
      price: item.price,
      image_url: item.image_url,
    });
    
    // Toon feedback
    setAddedItemId(item.id);
    setTimeout(() => setAddedItemId(null), 1500);
  };

  return (
    <>
      {/* Hero Section */}
      <section className="relative h-96 w-full flex items-center justify-center bg-gradient-to-br from-blue-600 via-purple-600 to-yellow-400">
        <div className="absolute inset-0 bg-black/30"></div>
        <div className="relative z-10 text-center text-white px-6">
          <h2 className="text-5xl md:text-7xl font-extrabold mb-4 drop-shadow-lg">
            Welkom bij PokéShop
          </h2>
          <p className="text-xl md:text-2xl mb-8 max-w-2xl mx-auto drop-shadow-md">
            Ontdek de beste Pokémon-merchandise: knuffels, kleding en accessoires.
          </p>
          <a
            href="#products"
            className="inline-block bg-yellow-400 hover:bg-yellow-300 text-gray-900 font-bold px-8 py-4 rounded-full text-lg transition-all duration-300 shadow-lg hover:shadow-xl"
          >
            Bekijk producten
          </a>
        </div>
      </section>

      {/* Products Section */}
      <section id="products" className="py-20 px-6 bg-white">
        <div className="max-w-6xl mx-auto">
          <h3 className="text-3xl font-bold text-center mb-12">Onze Producten</h3>

          {loading && (
            <p className="text-center text-gray-500">Producten laden...</p>
          )}

          {error && (
            <p className="text-center text-red-500">{error}</p>
          )}

          {!loading && !error && items.length === 0 && (
            <p className="text-center text-gray-500">Geen producten beschikbaar</p>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {items.map((item) => (
              <article
                key={item.id}
                className="bg-gray-50 rounded-xl shadow-md hover:shadow-xl transition-shadow duration-300 overflow-hidden flex flex-col"
              >
                <div className="h-48 flex items-center justify-center bg-gradient-to-br from-yellow-50 to-blue-50 p-4">
                  {item.image_url ? (
                    <img
                      src={item.image_url}
                      alt={item.name}
                      className="max-h-full max-w-full object-contain"
                    />
                  ) : (
                    <div className="text-6xl">🎴</div>
                  )}
                </div>
                <div className="p-4 flex flex-col flex-1">
                  <h4 className="text-lg font-semibold mb-1">{item.name}</h4>
                  <p className="text-sm text-gray-500 mb-2 flex-1">
                    {item.description || "Geen beschrijving"}
                  </p>
                  <p className="text-xs text-gray-400 mb-2">
                    Voorraad: {item.stock > 0 ? item.stock : "Uitverkocht"}
                  </p>
                  <div className="flex items-center justify-between">
                    <strong className="text-xl text-gray-900">
                      €{item.price.toFixed(2)}
                    </strong>
                    <button
                      onClick={() => handleAddToCart(item)}
                      disabled={item.stock === 0}
                      className={`text-sm font-medium px-4 py-2 rounded-lg transition-colors duration-200 ${
                        addedItemId === item.id
                          ? "bg-green-500 text-white"
                          : item.stock === 0
                          ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                          : "bg-blue-600 hover:bg-blue-500 text-white"
                      }`}
                    >
                      {addedItemId === item.id
                        ? "✓ Toegevoegd!"
                        : item.stock === 0
                        ? "Uitverkocht"
                        : "In winkelwagen"}
                    </button>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="max-w-6xl mx-auto px-6 text-center">
          <h4 className="text-2xl font-bold mb-4">PokéShop</h4>
          <p className="text-gray-400 mb-6">De beste plek voor Pokémon-merchandise</p>
          <p className="text-sm text-gray-500">
            © {new Date().getFullYear()} PokéShop — Demo
          </p>
        </div>
      </footer>
    </>
  );
}