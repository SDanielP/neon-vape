"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import Link from "next/link"
import { ShoppingCart, Plus, Minus, Send, X, Menu } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { cn } from "@/lib/utils"

// Debug: Confirm that the file is loaded
console.log("LiquidosPage component loaded");
//{ id: 8, name: "VAINILLA SKY", description: "Mezcla de distintos tipos de vainillas dulces.", category: "Postres", image: "/Postres.jpg" },
export default function LiquidosPage() {
  // Updated products data with categories
  const initialProducts = [
    { id: 1, name: "6 LECHES (NUEVA RECETA)", description: "Malteada de frutilla, leche condensada y cremas.", category: "Postres", image: "/Postres.jpg" },
    { id: 2, name: "BAILEYS", description: "Licor de chocolate con finas notas de café.", category: "Postres", image: "/Postres.jpg" },
    { id: 3, name: "DRAGON ROJO", description: "Fruta del dragon con frutillas, natillas y cremas.", category: "Postres", image: "/Postres.jpg" },
    { id: 4, name: "FRÁRBARO", description: "Frutillas con crema (nueva receta).", category: "Postres", image: "/Postres.jpg" },
    { id: 5, name: "IT", description: "Tarta de manzana con crema y canela (similar al Gambit).", category: "Postres", image: "/Postres.jpg" },
    { id: 6, name: "MANA LIMON", description: "Galleta con crema de vainilla y limon (muy intenso).", category: "Postres", image: "/Postres.jpg" },
    { id: 7, name: "TENTACION (RECETA MEJORADA)", description: "Frutilla con chocolate de cobertura. (Más frutilla, más dulce y menos oscuro).", category: "Postres", image: "/Postres.jpg" },
    { id: 9, name: "BANABOOM (RECETA MEJORADA)", description: "Banana, chocolate y cremas. (Color menos oscuro, más intenso de sabor).", category: "Postres", image: "/Postres.jpg" },
    { id: 10, name: "COQUITOS", description: "Tarta de dulce de leche con coco.", category: "Postres", image: "/Postres.jpg" },
    { id: 11, name: "ANANÁ FIZZ", description: "Dulce, ácido e intenso.", category: "Frutales", image: "/Frutales.jpg" },
    { id: 12, name: "CIRCUS", description: "Manzana roja con caramelo.", category: "Frutales", image: "/Frutales.jpg" },
    { id: 13, name: "DURAZNO", description: "Durazno dulce.", category: "Frutales", image: "/Frutales.jpg" },
    { id: 14, name: "MANGO", description: "Mango dulce.", category: "Frutales", image: "/Frutales.jpg" },
    { id: 15, name: "MEGA MELONS", description: "Papaya, mango y melon.", category: "Frutales", image: "/Frutales.jpg" },
    { id: 16, name: "MELoN", description: "Caramelo de melon y yogurt.", category: "Frutales", image: "/Frutales.jpg" },
    { id: 17, name: "PEDO DE MONO (RECETA MEJORADA)", description: "Frutilla, banana y crema de mani. (Más banana dulce y cremas).", category: "Frutales", image: "/Frutales.jpg" },
    { id: 18, name: "PERICLES", description: "Peras en almibar con un toque de ron.", category: "Frutales", image: "/Frutales.jpg" },
    { id: 19, name: "SANDÍA", description: "Sandia dulce.", category: "Frutales", image: "/Frutales.jpg" },
    { id: 20, name: "UVA FIZZ", description: "Uva concord dulce, intensa y ácida.", category: "Frutales", image: "/Frutales.jpg" },
    { id: 21, name: "ANANA FRESH", description: "Ananá dulce ácido y fresco (frio medio).", category: "Fresh", image: "/Fresh.jpg" },
    { id: 22, name: "ARANDANO FRESH", description: "Arándanos dulces e intensos (frio medio).", category: "Fresh", image: "/Fresh.jpg" },
    { id: 23, name: "SPEED OF MELON", description: "Interesante mezcla de bebida energizante y mega melons.", category: "Frutales", image: "/Frutales.jpg" },
    { id: 24, name: "KAMUS", description: "Menta, menthol, eucalipto y coolada (frío muy intenso).", category: "Fresh", image: "/Fresh.jpg" },
    { id: 25, name: "LUPIN NUEVA RECETA", description: "Limonada de frutilla con un toque de frio.", category: "Fresh", image: "/Fresh.jpg" },
    { id: 26, name: "MANGO FRESH", description: "Mango dulce y fresco (frío medio).", category: "Fresh", image: "/Fresh.jpg" },
    { id: 27, name: "MEGA TROPICAL (NUEVA RECETA)", description: "Mango y bananas duices con cremas, riquísimo.", category: "Fresh", image: "/Fresh.jpg" },
    { id: 28, name: "PINKI", description: "Frutos rojos con toques de Anís y mentol, similar a Red Astaire (frio suave).", category: "Fresh", image: "/Fresh.jpg" },
    { id: 29, name: "PIÑA COLADA", description: "Ananá y mango con leche de coco (frío medio).", category: "Fresh", image: "/Fresh.jpg" },
    { id: 30, name: "SANDÍA FRESH", description: "Sandia fresca y dulce (intensidad media).", category: "Fresh", image: "/Fresh.jpg" },
    { id: 31, name: "ARMSTRONG", description: "Tabaco cubano con notas de frutos secos y caramelo.", category: "Tabaquiles", image: "/Tabaquiles.jpg" },
    { id: 32, name: "ARGENTO", description: "Tabaco rubio con notas de uva, super seco.", category: "Tabaquiles", image: "/Tabaquiles.jpg" },
    { id: 33, name: "UVA FRESH", description: "Caramelo de uva con coolada (frio Medio).", category: "Fresh", image: "/Fresh.jpg" },
    { id: 34, name: "BONNIE AND CLYDE", description: "Tabaco rojo con caramelo, ron, tabaco de pipa y frutos secos (tabaquil intenso).", category: "Tabaquiles", image: "/Tabaquiles.jpg" },
    { id: 35, name: "CAPONE", description: "Tabaco negro con vainillas y caramelo para redondear (sabor Intenso similar a un cigarrillo).", category: "Tabaquiles", image: "/Tabaquiles.jpg" },
    { id: 36, name: "ÉXTASIS", description: "Tabaco con chocolate crema de mani y banana con notas de coco de fondo.", category: "Tabaquiles", image: "/Tabaquiles.jpg" },
    { id: 37, name: "GOLDEN VIRGINIA", description: "Tabaco rubio suave.", category: "Tabaquiles", image: "/Tabaquiles.jpg" },
    { id: 38, name: "TRIBECA", description: "Tabaco rubio con caramelo y frutos secos.", category: "Tabaquiles", image: "/Tabaquiles.jpg" },
    { id: 39, name: "DON JUAN TABACO DULCE", description: "Tabaco rubio con tarta, helado de vainilla, sutiles notas de chocolate con leche y un predominante sabor a pecan para redondear.", category: "Tabaquiles", image: "/Tabaquiles.jpg" },
  ]

  const [products, setProducts] = useState(initialProducts)
  const [cartItems, setCartItems] = useState({})
  const [isCartOpen, setIsCartOpen] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState("") // Track search input
  const [selectedCategory, setSelectedCategory] = useState("Todos") // Track selected category
  const [selectedSizes, setSelectedSizes] = useState({})
  const [selectedQuantities, setSelectedQuantities] = useState({})

  const sizePrices = { "30ml": 5500, "60ml": 7000, "120ml": 11000 }

  // Filter products by category and search query
  const filteredProducts = initialProducts.filter((product) => {
    const matchesCategory =
      selectedCategory === "Todos" || product.category === selectedCategory
    const matchesSearch =
      product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.description.toLowerCase().includes(searchQuery.toLowerCase())
    return matchesCategory && matchesSearch
  })

  // Ensure selectedSizes is initialized only once
  useEffect(() => {
    if (Object.keys(selectedSizes).length === 0) {
      const defaultSizes = {};
      initialProducts.forEach((product) => {
        defaultSizes[product.id] = "30ml";
      });
      setSelectedSizes(defaultSizes);
    }
  }, []);

  // Load cart items from localStorage on component mount
  useEffect(() => {
    const storedCartItems = JSON.parse(localStorage.getItem("cartItems")) || {};
    setCartItems(storedCartItems);
  }, []);

  // Set default selected size to "30ml" for all products (only once)
  useEffect(() => {
    const defaultSizes = {};
    initialProducts.forEach((product) => {
      defaultSizes[product.id] = "30ml";
    });
    setSelectedSizes(defaultSizes);
  }, []); // Removed dependency on initialProducts to avoid infinite loop

  // Calculate total items in cart
  const totalItems = Object.values(cartItems).flat().reduce((total, item) => total + item.quantity, 0)

  // Calculate total price
  const totalPrice = Object.values(cartItems)
    .flat()
    .reduce((total, item) => total + (item.product?.price || 0) * item.quantity, 0);

  // Agregar producto al carrito agrupado por categoría
  const addToCart = (product, size, quantity) => {
    console.log("Agregando producto al carrito:", product.name);

    setCartItems((prevItems) => {
      const updatedItems = { ...prevItems };

      if (!updatedItems[product.category]) {
        updatedItems[product.category] = [];
      } else {
        updatedItems[product.category] = [...updatedItems[product.category]];
      }

      const existingItemIndex = updatedItems[product.category].findIndex(
        (item) => item.product.id === product.id && item.size === size
      );

      if (existingItemIndex !== -1) {
        const updatedProduct = {
          ...updatedItems[product.category][existingItemIndex],
          quantity: updatedItems[product.category][existingItemIndex].quantity + quantity,
        };
        updatedItems[product.category][existingItemIndex] = updatedProduct;
      } else {
        updatedItems[product.category].push({
          product: { ...product, price: sizePrices[size] }, // Include price
          size,
          quantity,
        });
      }

      localStorage.setItem("cartItems", JSON.stringify(updatedItems));
      return updatedItems;
    });
  };

  // Remove product from cart
  const removeFromCart = (productId, size) => {
    setCartItems((prevItems) => {
      const updatedItems = { ...prevItems };
      const category = Object.keys(updatedItems).find((cat) =>
        updatedItems[cat].some((item) => item.product.id === productId && item.size === size)
      );

      if (category) {
        updatedItems[category] = updatedItems[category].filter(
          (item) => !(item.product.id === productId && item.size === size)
        );
      }

      // Save updated cart to localStorage
      localStorage.setItem("cartItems", JSON.stringify(updatedItems));
      return updatedItems;
    });
  }

  // Update product quantity in cart
  const updateQuantity = (productId, size, newQuantity) => {
    if (newQuantity < 1) return

    setCartItems((prevItems) => {
      const updatedItems = { ...prevItems };
      const category = Object.keys(updatedItems).find((cat) =>
        updatedItems[cat].some((item) => item.product.id === productId && item.size === size)
      );

      if (category) {
        updatedItems[category] = updatedItems[category].map((item) =>
          item.product.id === productId && item.size === size
            ? { ...item, quantity: newQuantity }
            : item
        );
      }

      return updatedItems;
    });
  }

  // Send cart to WhatsApp
  const sendToWhatsApp = () => {
    const message = Object.entries(cartItems)
      .filter(([_, items]) => items.length > 0) // Exclude empty categories
      .map(([category, items]) => {
        const categoryMessage = items
          .map(
            (item) =>
              `*${item.product.name} (${item.size || "N/A"})* x${item.quantity} - $${(
                (item.product.price || 0) * item.quantity
              ).toFixed(2)}`
          )
          .join("\n");
        return `🛒 Mi Pedido (${category}):\n${categoryMessage}`;
      })
      .join("\n\n");

    const totalMessage = `\n\n*Total: $${totalPrice.toFixed(2)}*`;

    const phoneNumber = "543813501872";
    const whatsappUrl = `https://api.whatsapp.com/send?phone=${phoneNumber}&text=${encodeURIComponent(
      `${message}${totalMessage}`
    )}`;

    window.open(whatsappUrl, "_blank");

    setCartItems({});
    localStorage.removeItem("cartItems");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-black to-purple-900 text-white">
      {/* Header */}
      <header className="sticky top-0 z-10 backdrop-blur-md bg-black/30 border-b border-purple-500/20">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="icon"
              className="md:hidden text-gray-400 hover:text-white hover:bg-purple-900/50"
              onClick={() => setIsMobileMenuOpen(true)}
            >
              <Menu className="h-6 w-6" />
            </Button>
            <Link href="/">
              <h1 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-fuchsia-500 to-cyan-500">
                NEON VAPE
              </h1>
            </Link>
          </div>

          <div className="hidden md:flex items-center space-x-6">
            <Link href="/" className="text-gray-300 hover:text-white transition-colors">
              Inicio
            </Link>
            <Link href="/liquidos" className="text-fuchsia-300 hover:text-fuchsia-200 transition-colors">
              Líquidos
            </Link>
            <Link href="/equipos" className="text-gray-300 hover:text-white transition-colors">
              Equipos
            </Link>
            <Link href="/repuestos" className="text-gray-300 hover:text-white transition-colors">
              Repuestos
            </Link>
          </div>

          <Button
            variant="outline"
            className="relative border-purple-500 hover:bg-purple-900/50"
            onClick={() => setIsCartOpen(true)}
          >
            <ShoppingCart className="h-5 w-5 text-fuchsia-400" />
            {totalItems > 0 && (
              <Badge className="absolute -top-2 -right-2 bg-fuchsia-500 hover:bg-fuchsia-500">{totalItems}</Badge>
            )}
          </Button>
        </div>
      </header>

      {/* Mobile Menu Sidebar */}
      <div
        className={cn(
          "fixed inset-y-0 left-0 w-64 bg-black/95 border-r border-purple-500/30 shadow-[0_0_25px_rgba(219,39,119,0.2)] z-50 transform transition-transform duration-300 ease-in-out md:hidden",
          isMobileMenuOpen ? "translate-x-0" : "-translate-x-full",
        )}
      >
        <div className="h-full flex flex-col p-6">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-xl font-bold text-fuchsia-400">Menú</h2>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsMobileMenuOpen(false)}
              className="text-gray-400 hover:text-white hover:bg-purple-900/50"
            >
              <X className="h-5 w-5" />
            </Button>
          </div>

          <nav className="space-y-6">
            <Link
              href="/"
              className="block text-lg font-medium text-gray-300 hover:text-white transition-colors"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Inicio
            </Link>
            <Link
              href="/liquidos"
              className="block text-lg font-medium text-fuchsia-300 hover:text-fuchsia-200 transition-colors"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Líquidos
            </Link>
            <Link
              href="/equipos"
              className="block text-lg font-medium text-gray-300 hover:text-white transition-colors"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Equipos
            </Link>
            <Link
              href="/repuestos"
              className="block text-lg font-medium text-gray-300 hover:text-white transition-colors"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Repuestos
            </Link>
          </nav>
        </div>
      </div>

      {/* Overlay for mobile menu */}
      {isMobileMenuOpen && (
        <div
          className="fixed inset-0 bg-black/70 z-40 backdrop-blur-sm md:hidden"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}

      {/* Category Header */}
      <div className="bg-gradient-to-r from-fuchsia-900/50 to-purple-900/50 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-8">
          <div className="flex items-center gap-4">
            <Link href="/" className="text-gray-300 hover:text-white">
              Inicio
            </Link>
            <span className="text-gray-500">/</span>
            <h1 className="text-2xl font-bold text-fuchsia-300">Líquidos</h1>
          </div>
        </div>
      </div>
      <h2 className="text-3xl font-bold mb-4 ml-4 mt-4 sm:mb-0">Nuestros Liquidos</h2>
      {/* Quick Filters and Search */}
      <div className="container mx-auto px-4 py-4">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="flex flex-wrap justify-center gap-2">
            {["Todos", "Postres", "Frutales", "Fresh", "Tabaquiles"].map((category) => (
              <Button
                key={category}
                variant={selectedCategory === category ? "solid" : "outline"}
                className={`text-sm ${
                  selectedCategory === category
                    ? "bg-gradient-to-r from-fuchsia-600 to-purple-600 text-white"
                    : "border-purple-500 text-gray-300 hover:bg-purple-900/50"
                }`}
                onClick={() => setSelectedCategory(category)}
              >
                {category}
              </Button>
            ))}
          </div>
          <input
            type="text"
            placeholder="Buscar líquidos..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full sm:w-64 px-4 py-2 rounded-md bg-black/40 border border-purple-500 text-gray-300 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-fuchsia-500"
          />
        </div>
      </div>

      {/* Main content */}
      <main className="container mx-auto px-4 py-4">
        
        <div className="h-1 w-20 bg-gradient-to-r from-fuchsia-500 to-cyan-500 mb-8"></div>

        {/* Products grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProducts.map((product) => (
            <div
              key={product.id}
              className="bg-black/40 backdrop-blur-sm border border-purple-500/30 rounded-lg overflow-hidden hover:shadow-[0_0_15px_rgba(219,39,119,0.3)] transition-all duration-300"
            >
              <div className="p-4">
                <div className="relative h-48 mb-4 overflow-hidden rounded-md">
                  <Image src={product.image || "/placeholder.svg"} alt={product.name} fill className="object-contain" />
                </div>
                <h3 className="text-xl font-semibold mb-2 text-fuchsia-300">{product.name}</h3>
                <p className="text-gray-300 mb-4 text-sm">{product.description}</p>
                <div className="flex flex-col gap-2">
                  <div className="flex justify-between gap-2">
                    {["30ml", "60ml", "120ml"].map((size) => (
                      <div key={size} className="flex flex-col items-center">
                        <Button
                          variant={selectedSizes[product.id] === size ? "solid" : "outline"}
                          className={`flex-1 text-sm ${
                            selectedSizes[product.id] === size
                              ? "bg-gradient-to-r from-fuchsia-600 to-purple-600 text-white"
                              : "border-purple-500 text-gray-300 hover:bg-purple-900/50"
                          }`}
                          onClick={() => {
                            setSelectedSizes((prev) => ({ ...prev, [product.id]: size }));
                            setSelectedQuantities((prev) => ({
                              ...prev,
                              [product.id]: prev[product.id] || 1, // Default to 1 if not already set
                            }));
                          }}
                        >
                          {size}
                        </Button>
                        <span className="text-gray-400 text-xs mt-1">
                          ${sizePrices[size]?.toFixed(2) || "0.00"}
                        </span>
                      </div>
                    ))}
                  </div>

                  {selectedSizes[product.id] && (
                    <div className="flex items-center justify-between mt-2">
                      <span className="text-gray-300 text-sm">Cantidad:</span>
                      <div className="flex items-center gap-2">
                        <Button
                          variant="outline"
                          size="icon"
                          className="h-7 w-7 border-purple-500 hover:bg-purple-800"
                          onClick={() => {
                            console.log("Decreasing quantity for product:", product.id); // Debug: Log product ID on decrement
                            setSelectedQuantities((prev) => ({
                              ...prev,
                              [product.id]: Math.max((prev[product.id] || 1) - 1, 1), // Ensure quantity cannot go below 1
                            }));
                          }}
                        >
                          <Minus className="h-3 w-3" />
                        </Button>
                        <span className="w-8 text-center text-gray-300">
                          {selectedQuantities[product.id] || 1} {/* Default to 1 */}
                        </span>
                        <Button
                          variant="outline"
                          size="icon"
                          className="h-7 w-7 border-purple-500 hover:bg-purple-800"
                          onClick={() => {
                            console.log("Increasing quantity for product:", product.id); // Debug: Log product ID on increment
                            setSelectedQuantities((prev) => ({
                              ...prev,
                              [product.id]: (prev[product.id] || 1) + 1,
                            }));
                          }}
                        >
                          <Plus className="h-3 w-3" />
                        </Button>
                      </div>
                    </div>
                  )}

                  <Button
                    onClick={() => {
                      console.log("Button clicked for product:", product.id); // Debug: Log product ID on button click
                      console.log("Selected size:", selectedSizes[product.id]); // Debug: Log selected size
                      console.log("Selected quantity:", selectedQuantities[product.id] || 1); // Debug: Log selected quantity
                      addToCart(
                        product,
                        selectedSizes[product.id],
                        selectedQuantities[product.id] || 1 // Ensure quantity defaults to 1
                      );
                    }}
                    className="w-full bg-gradient-to-r from-fuchsia-600 to-purple-600 hover:from-fuchsia-500 hover:to-purple-500 text-white mt-2"
                  >
                    Añadir al Carrito
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </main>

      {/* Cart sidebar */}
      <div
        className={cn(
          "fixed inset-y-0 right-0 w-full sm:w-96 bg-black/95 border-l border-purple-500/30 shadow-[0_0_25px_rgba(219,39,119,0.2)] z-50 transform transition-transform duration-300 ease-in-out",
          isCartOpen ? "translate-x-0" : "translate-x-full",
        )}
      >
        <div className="h-full flex flex-col p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-fuchsia-400 flex items-center gap-2">
              <ShoppingCart className="h-5 w-5" /> Tu Carrito
            </h2>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsCartOpen(false)}
              className="text-gray-400 hover:text-white hover:bg-purple-900/50"
            >
              <X className="h-5 w-5" />
            </Button>
          </div>

          {totalItems === 0 ? (
            <div className="flex-1 flex flex-col items-center justify-center text-gray-400">
              <ShoppingCart className="h-16 w-16 mb-4 opacity-30" />
              <p>Tu carrito está vacío</p>
            </div>
          ) : (
            <>
              <div className="flex-1 overflow-y-auto space-y-4">
                {Object.entries(cartItems).map(([category, items]) => (
                  <div key={category}>
                    <h3 className="text-lg font-bold text-fuchsia-300 mb-2">{category}</h3>
                    {items.map((item) => (
                      <div key={item.product.id} className="bg-purple-900/30 rounded-lg p-4">
                        <div className="flex gap-4">
                          <div className="relative h-16 w-16 flex-shrink-0 rounded overflow-hidden">
                            <Image
                              src={item.product.image || "/placeholder.svg"}
                              alt={item.product.name}
                              fill
                              className="object-contain"
                            />
                          </div>
                          <div className="flex-1">
                            <h3 className="font-medium text-fuchsia-300">
                              {item.product.name}{" "}
                              {item.size && <span className="text-gray-400 text-sm">({item.size})</span>}
                            </h3>
                            <p className="text-cyan-400 text-sm font-bold">
                              ${item.product?.price?.toFixed(2) || "0.00"}
                            </p>
                          </div>
                        </div>

                        <div className="flex justify-between items-center mt-3">
                          <div className="flex items-center gap-2">
                            <Button
                              variant="outline"
                              size="icon"
                              className="h-7 w-7 border-purple-500 hover:bg-purple-800"
                              onClick={() => updateQuantity(item.product.id, item.size, item.quantity - 1)}
                            >
                              <Minus className="h-3 w-3" />
                            </Button>
                            <span className="w-8 text-center">{item.quantity}</span>
                            <Button
                              variant="outline"
                              size="icon"
                              className="h-7 w-7 border-purple-500 hover:bg-purple-800"
                              onClick={() => updateQuantity(item.product.id, item.size, item.quantity + 1)}
                            >
                              <Plus className="h-3 w-3" />
                            </Button>
                          </div>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="text-red-400 hover:text-red-300 hover:bg-red-900/30"
                            onClick={() => removeFromCart(item.product.id, item.size)}
                          >
                            Eliminar
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                ))}
              </div>

              <div className="mt-6 space-y-4">
                <Separator className="bg-purple-500/30" />
                <div className="flex justify-between text-lg font-bold">
                  <span>Total:</span>
                  <span className="text-cyan-400">${totalPrice.toFixed(2)}</span>
                </div>
                <Button
                  className="w-full bg-gradient-to-r from-fuchsia-600 to-purple-600 hover:from-fuchsia-500 hover:to-purple-500 text-white"
                  onClick={sendToWhatsApp}
                >
                  <Send className="h-4 w-4 mr-2" /> Enviar a WhatsApp
                </Button>
              </div>
            </>
          )}
        </div>
      </div>

      {/* Overlay for cart */}
      {isCartOpen && (
        <div className="fixed inset-0 bg-black/70 z-40 backdrop-blur-sm" onClick={() => setIsCartOpen(false)} />
      )}
    </div>
  )
}

