"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import Link from "next/link"
import { ShoppingCart, Minus, Plus, Send } from "lucide-react"
import { Button } from "../components/ui/button"
import { Badge } from "../components/ui/badge"
import { Separator } from "../components/ui/separator"
import { Menu, X } from "lucide-react"
import { cn } from "@/lib/utils"

export default function HomePage() {
  // State for cart items count (shared across pages)
  const [cartItemsCount, setCartItemsCount] = useState(0)
  // State for mobile menu
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  // State for cart visibility
  const [isCartOpen, setIsCartOpen] = useState(false)
  // State for cart items
  const [cartItems, setCartItems] = useState({})

  // Load cart items count and items from localStorage on component mount
  useEffect(() => {
    const storedCartItems = JSON.parse(localStorage.getItem("cartItems")) || {};
    const count = Object.values(storedCartItems)
      .flat()
      .reduce((total, item) => total + item.quantity, 0);
    setCartItemsCount(count);
    setCartItems(storedCartItems);
  }, []);

  // Update cart items count and items whenever localStorage changes
  useEffect(() => {
    const handleStorageChange = () => {
      const storedCartItems = JSON.parse(localStorage.getItem("cartItems")) || {};
      const count = Object.values(storedCartItems)
        .flat()
        .reduce((total, item) => total + item.quantity, 0);
      setCartItemsCount(count);
      setCartItems(storedCartItems);
    };

    window.addEventListener("storage", handleStorageChange);
    return () => window.removeEventListener("storage", handleStorageChange);
  }, []);

  // Calculate total price
  const totalPrice = Object.values(cartItems)
    .flat()
    .reduce((total, item) => total + (item.product?.price || 0) * item.quantity, 0);

  // Remove product from cart
  const removeFromCart = (productId) => {
    setCartItems((prevItems) => {
      const updatedItems = { ...prevItems };
      Object.keys(updatedItems).forEach((category) => {
        updatedItems[category] = updatedItems[category].filter(
          (item) => item.product.id !== productId
        );
      });
      localStorage.setItem("cartItems", JSON.stringify(updatedItems));
      return updatedItems;
    });
  };

  // Update product quantity in cart
  const updateQuantity = (productId, newQuantity) => {
    if (newQuantity < 1) return;

    setCartItems((prevItems) => {
      const updatedItems = { ...prevItems };
      Object.keys(updatedItems).forEach((category) => {
        updatedItems[category] = updatedItems[category].map((item) =>
          item.product.id === productId
            ? { ...item, quantity: newQuantity }
            : item
        );
      });
      localStorage.setItem("cartItems", JSON.stringify(updatedItems));
      return updatedItems;
    });
  };

  // Send cart to WhatsApp
  const sendToWhatsApp = () => {
    const message = Object.entries(cartItems)
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

  // Category data
  const categories = [
    {
      id: "liquidos",
      name: "Líquidos",
      description: "Variedad de líquidos premium para vapeo con diferentes sabores y concentraciones.",
      image: "/Liquidos.jpg",
      color: "from-fuchsia-600 to-purple-600",
    },
    {
      id: "equipos",
      name: "Equipos",
      description: "Dispositivos de vapeo de alta calidad, desde principiantes hasta avanzados.",
      image: "/Equipos.jpg",
      color: "from-cyan-600 to-blue-600",
    },
    {
      id: "repuestos",
      name: "Repuestos",
      description: "Accesorios y repuestos para mantener tu equipo funcionando perfectamente.",
      image: "/Repuestos.jpg",
      color: "from-green-500 to-emerald-600",
    },
  ]

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
            {categories.map((category) => (
              <Link
                key={category.id}
                href={`/${category.id}`}
                className="text-gray-300 hover:text-white transition-colors"
              >
                {category.name}
              </Link>
            ))}
          </div>

          <Button
            variant="outline"
            className="relative border-purple-500 hover:bg-purple-900/50"
            onClick={() => setIsCartOpen(true)}
          >
            <ShoppingCart className="h-5 w-5 text-fuchsia-400" />
            {cartItemsCount > 0 && (
              <Badge className="absolute -top-2 -right-2 bg-fuchsia-500 hover:bg-fuchsia-500">{cartItemsCount}</Badge>
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
              className="block text-lg font-medium text-white hover:text-fuchsia-300 transition-colors"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Inicio
            </Link>

            {categories.map((category) => (
              <Link
                key={category.id}
                href={`/${category.id}`}
                className="block text-lg font-medium text-gray-300 hover:text-white transition-colors"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                {category.name}
              </Link>
            ))}
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

      {/* Overlay for cart sidebar */}
      {isCartOpen && (
        <div
          className="fixed inset-0 bg-black/70 z-40 backdrop-blur-sm"
          onClick={() => setIsCartOpen(false)}
        />
      )}

      {/* Cart Sidebar */}
      <div
        className={cn(
          "fixed inset-y-0 right-0 w-full sm:w-96 bg-black/95 border-l border-purple-500/30 shadow-[0_0_25px_rgba(219,39,119,0.2)] z-50 transform transition-transform duration-300 ease-in-out",
          isCartOpen ? "translate-x-0" : "translate-x-full"
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

          {Object.values(cartItems).flat().length === 0 ? (
            <div className="flex-1 flex flex-col items-center justify-center text-gray-400">
              <ShoppingCart className="h-16 w-16 mb-4 opacity-30" />
              <p>Tu carrito está vacío</p>
            </div>
          ) : (
            <>
              <div className="flex-1 overflow-y-auto space-y-4">
                {Object.entries(cartItems).map(([category, items]) => (
                  <div key={category}>
                    <h3 className="text-lg font-bold text-fuchsia-300 mb-2">
                      {category}
                    </h3>
                    {items.map((item) => (
                      <div
                        key={item.product.id}
                        className="bg-purple-900/30 rounded-lg p-4"
                      >
                        <div className="flex gap-4">
                          <div className="relative h-16 w-16 flex-shrink-0 rounded overflow-hidden">
                            <Image
                              src={item.product.image || "/placeholder.svg"}
                              alt={item.product.name}
                              fill
                              className="object-cover"
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
                              onClick={() =>
                                updateQuantity(item.product.id, item.quantity - 1)
                              }
                            >
                              <Minus className="h-3 w-3" />
                            </Button>
                            <span className="w-8 text-center">{item.quantity}</span>
                            <Button
                              variant="outline"
                              size="icon"
                              className="h-7 w-7 border-purple-500 hover:bg-purple-800"
                              onClick={() =>
                                updateQuantity(item.product.id, item.quantity + 1)
                              }
                            >
                              <Plus className="h-3 w-3" />
                            </Button>
                          </div>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="text-red-400 hover:text-red-300 hover:bg-red-900/30"
                            onClick={() => removeFromCart(item.product.id)}
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

      {/* Hero Section */}
      <section className="pt-2 md:pt-2 px-2 mt-5">
        <div className="container mx-auto text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-6">
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-fuchsia-500 to-cyan-500">
              Bienvenido a Neon Vape
            </span>
          </h1>
          <p className="text-xl md:text-xl text-gray-300 max-w-3xl mx-auto mb-6">
            Descubre nuestra selección premium de productos para vapeo
          </p>

          {/* Glowing underline */}
          <div className="h-1 w-32 bg-gradient-to-r from-fuchsia-500 to-cyan-500 mx-auto shadow-[0_0_10px_rgba(219,39,119,0.7)]"></div>
        </div>
      </section>

      {/* Categories Section */}
      <section className="py-8 px-4">
        <div className="container mx-auto">

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {categories.map((category) => (
              <Link href={`/${category.id}`} key={category.id} className="block">
                <div className="bg-black/40 backdrop-blur-sm border border-purple-500/30 rounded-xl overflow-hidden hover:shadow-[0_0_20px_rgba(219,39,119,0.4)] transition-all duration-300 h-full">
                  <div className="relative h-48 overflow-hidden">
                    <Image
                      src={category.image || "/placeholder.svg"}
                      alt={category.name}
                      fill
                      className="object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent"></div>
                    <div className="absolute bottom-0 left-0 right-0 p-4">
                      <h3 className="text-2xl font-bold">{category.name}</h3>
                    </div>
                  </div>
                  <div className="p-6">
                    <p className="text-gray-300 mb-6">{category.description}</p>
                    <Button className={`w-full bg-gradient-to-r ${category.color} hover:opacity-90 text-white`}>
                      Explorar {category.name}
                    </Button>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="mt-20 border-t border-purple-500/20 py-8">
        <div className="container mx-auto px-4 text-center text-gray-400">
          <p>© 2024 Neon Vape. Todos los derechos reservados.</p>
        </div>
      </footer>
    </div>
  )
}

