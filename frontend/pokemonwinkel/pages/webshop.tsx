import React from "react";

type Product = {
    id: number;
    name: string;
    price: string;
    img?: string;
    description?: string;
};

const products: Product[] = [
    { id: 1, name: "Pikachu Plush", price: "€12.50", description: "Zachte Pikachu knuffel" },
    { id: 2, name: "Charmander Cap", price: "€9.99", description: "Stoere pet met Charmander" },
    { id: 3, name: "Poké Ball Mug", price: "€7.50", description: "Koffiemok in Poké Ball stijl" },
    { id: 4, name: "Bulbasaur Backpack", price: "€24.99", description: "Handige rugzak met Bulbasaur" },
];

export default function Webshop() {
    return (
        <>
            {/* Hero Section met gradient */}
            <section className="relative h-screen w-full flex items-center justify-center bg-gradient-to-br from-blue-600 via-purple-600 to-yellow-400">
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
                <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce">
                    <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
                    </svg>
                </div>
            </section>

            {/* Products Section */}
            <section id="products" className="py-20 px-6 bg-white">
                <div className="max-w-6xl mx-auto">
                    <h3 className="text-3xl font-bold text-center mb-12">Populaire Producten</h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                        {products.map((p) => (
                            <article 
                                key={p.id} 
                                className="bg-gray-50 rounded-xl shadow-md hover:shadow-xl transition-shadow duration-300 overflow-hidden flex flex-col"
                            >
                                <div className="h-48 flex items-center justify-center bg-gradient-to-br from-yellow-50 to-blue-50 p-4">
                                    <div className="text-gray-400 text-sm">Afbeelding</div>
                                </div>
                                <div className="p-4 flex flex-col flex-1">
                                    <h4 className="text-lg font-semibold mb-1">{p.name}</h4>
                                    <p className="text-sm text-gray-500 mb-4 flex-1">{p.description}</p>
                                    <div className="flex items-center justify-between">
                                        <strong className="text-xl text-gray-900">{p.price}</strong>
                                        <button className="bg-blue-600 hover:bg-blue-500 text-white text-sm font-medium px-4 py-2 rounded-lg transition-colors duration-200">
                                            In wagen
                                        </button>
                                    </div>
                                </div>
                            </article>
                        ))}
                    </div>
                </div>
            </section>

            {/* Footer */}
            <footer id="contact" className="bg-gray-900 text-white py-12">
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