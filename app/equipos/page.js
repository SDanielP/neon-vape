"use client"

import React from "react" // Add this import
import { useState, useEffect } from "react"
import Image from "next/image"
import Link from "next/link"
import { ShoppingCart, Plus, Minus, Send, X, Menu, ArrowUpDown } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { cn } from "@/lib/utils"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"

// Component to format product descriptions with line breaks
const ProductDescription = ({ description }) => {
  const formattedDescription = description.split("\n").map((line, index) => (
    <React.Fragment key={index}>
      {line}
      <br />
    </React.Fragment>
  ));

  return <div>{formattedDescription}</div>;
};

export default function EquiposPage() {
  // Sample products data for Equipos category
  const initialProducts = [
    {
      id: 1,
      name: "Voopoo Drag Nano 2",
      description: "  El Drag Nano 2 es un dispositivo compacto pero potente que mantiene el diseño clásico de la serie Drag. Fabricado con aleación de zinc, ofrece una sensación metálica de alta calidad.\nCuenta con un innovador sistema de flujo de aire infinito que permite ajustar la experiencia de vapeo según tus preferencias.\nAdemás, posee un sistema de llenado superior fácil y a prueba de fugas, con un cartucho visible que muestra el nivel de e-líquido en tiempo real.\nEs compatible con los cartuchos VINCI Pod y viene equipado con dos pods de diferentes resistencias para ofrecer diversas experiencias de sabor.\n¿Qué incluye el kit?\n1x Drag Nano 2\n1x Recambio (resistencia 0.8ohm)\n1x Recambio (resistencia 1.2ohm)\n1x Cable USB-C\n1x Cadena/colgante\n1x Manual de Usuario",
      price: 35000,
      image: "/Drag-nano2.jpg",
    }
    ,    
    {
      id: 2,
      name: "Voopoo Vinci Pod Royale Edition",
      description: "El Voopoo Vinci Pod Royal Edition es una versión premium del Vinci Pod, con un diseño elegante en aleación de aluminio 6061.\nCuenta con una batería de 800 mAh y una potencia de hasta 15W, ideal para vapeo MTL. Su cartucho de 2 ml es visible y se rellena por la parte superior.\nAdemás, tiene un sistema de flujo de aire ajustable y es compatible con los cartuchos Vinci Q, Drag Nano 2 y Vinci Pod.\n¿Qué incluye el kit?\n1x Voopoo Vinci Royal edition\n1x Cartucho de recambio v2 (0.8ohm)\n1x Cartucho de recambio v2 (1.2ohm)\n1x Cable USB-C\n1x Manual de usuario",
      price: 30000,
      image: "/Vinci-pod.jpg",
    },
    {
      id: 3,
      name: "Voopoo Argus G2 Mini",
      description: "El Voopoo Argus G2 Mini es compacto y ligero, fabricado en aleación de aluminio y policarbonato. Su batería de 1200 mAh ofrece una potencia ajustable de 5W a 30W.\nEl cartucho de 2 ml se rellena por la parte superior y permite un control preciso del flujo de aire.\nSu interfaz con indicadores LED facilita la visualización del estado de la batería y otros datos.\n¿Qué incluye el kit?\n1x Argus G2 Mini\n1x Pod Argus Top Fill de 0.7ohm\n1x Manual de usuario",
      price: 30000,
      image: "/Argus-g2.jpg",
    },
  ]

  // State for products, cart items, cart visibility, and mobile menu
  const [products, setProducts] = useState(initialProducts)
  const [cartItems, setCartItems] = useState({})
  const [isCartOpen, setIsCartOpen] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [sortOrder, setSortOrder] = useState("default") // default, lowToHigh, highToLow
  const [expandedDescriptions, setExpandedDescriptions] = useState({});

  // Load cart items from localStorage on component mount
  useEffect(() => {
    const storedCartItems = JSON.parse(localStorage.getItem("cartItems")) || {};
    setCartItems(storedCartItems);
  }, []);

  // Sort products when sort order changes
  useEffect(() => {
    const sortedProducts = [...initialProducts]

    if (sortOrder === "lowToHigh") {
      sortedProducts.sort((a, b) => a.price - b.price)
    } else if (sortOrder === "highToLow") {
      sortedProducts.sort((a, b) => b.price - a.price)
    }

    setProducts(sortedProducts)
  }, [sortOrder])

  // Calculate total items in cart
  const totalItems = Object.values(cartItems).flat().reduce((total, item) => total + item.quantity, 0)

  // Calculate total price
  const totalPrice = Object.values(cartItems)
    .flat()
    .reduce((total, item) => total + (item.product?.price || 0) * item.quantity, 0);

  // Add product to cart grouped by category
  const addToCart = (product) => {
    setCartItems((prevItems) => {
      const category = "Equipos";
      const updatedItems = { ...prevItems };

      if (!updatedItems[category]) {
        updatedItems[category] = [];
      }

      const existingItem = updatedItems[category].find((item) => item.product.id === product.id);

      if (existingItem) {
        updatedItems[category] = updatedItems[category].map((item) =>
          item.product.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
        );
      } else {
        updatedItems[category].push({
          product: { ...product }, // Include price and other details
          quantity: 1,
        });
      }

      // Save updated cart to localStorage
      localStorage.setItem("cartItems", JSON.stringify(updatedItems));
      return updatedItems;
    });
  }

  // Remove product from cart
  const removeFromCart = (productId) => {
    setCartItems((prevItems) => {
      const category = "Equipos";
      const updatedItems = { ...prevItems };

      if (updatedItems[category]) {
        updatedItems[category] = updatedItems[category].filter((item) => item.product.id !== productId);
      }

      return updatedItems;
    });
  }

  // Update product quantity in cart
  const updateQuantity = (productId, newQuantity) => {
    if (newQuantity < 1) return

    setCartItems((prevItems) => {
      const category = "Equipos";
      const updatedItems = { ...prevItems };

      if (updatedItems[category]) {
        updatedItems[category] = updatedItems[category].map((item) =>
          item.product.id === productId ? { ...item, quantity: newQuantity } : item
        );
      }

      return updatedItems;
    });
  }

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

  const toggleDescription = (productId) => {
    setExpandedDescriptions((prev) => ({
      ...prev,
      [productId]: !prev[productId],
    }));
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
            <Link href="/liquidos" className="text-gray-300 hover:text-white transition-colors">
              Líquidos
            </Link>
            <Link href="/equipos" className="text-cyan-300 hover:text-cyan-200 transition-colors">
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
              className="block text-lg font-medium text-gray-300 hover:text-white transition-colors"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Líquidos
            </Link>
            <Link
              href="/equipos"
              className="block text-lg font-medium text-cyan-300 hover:text-cyan-200 transition-colors"
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
      <div className="bg-gradient-to-r from-cyan-900/50 to-blue-900/50 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-8">
          <div className="flex items-center gap-4">
            <Link href="/" className="text-gray-300 hover:text-white">
              Inicio
            </Link>
            <span className="text-gray-500">/</span>
            <h1 className="text-2xl font-bold text-cyan-300">Equipos</h1>
          </div>
        </div>
      </div>

      {/* Main content */}
      <main className="container mx-auto px-4 py-8">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8">
          <h2 className="text-3xl font-bold mb-4 sm:mb-0">Nuestros Equipos</h2>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="border-blue-500 hover:bg-blue-900/50">
                <ArrowUpDown className="h-4 w-4 mr-2" />
                Ordenar por precio
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="bg-black/90 border-blue-500/50">
              <DropdownMenuItem
                className={`${sortOrder === "default" ? "bg-blue-900/50 text-cyan-300" : ""} hover:bg-blue-900/30 cursor-pointer`}
                onClick={() => setSortOrder("default")}
              >
                Predeterminado
              </DropdownMenuItem>
              <DropdownMenuItem
                className={`${sortOrder === "lowToHigh" ? "bg-blue-900/50 text-cyan-300" : ""} hover:bg-blue-900/30 cursor-pointer`}
                onClick={() => setSortOrder("lowToHigh")}
              >
                Precio: Menor a Mayor
              </DropdownMenuItem>
              <DropdownMenuItem
                className={`${sortOrder === "highToLow" ? "bg-blue-900/50 text-cyan-300" : ""} hover:bg-blue-900/30 cursor-pointer`}
                onClick={() => setSortOrder("highToLow")}
              >
                Precio: Mayor a Menor
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        <div className="h-1 w-20 bg-gradient-to-r from-cyan-500 to-blue-500 mb-8"></div>

        {/* Products grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {products.map((product) => (
            <div
              key={product.id}
              className="bg-black/40 backdrop-blur-sm border border-blue-500/30 rounded-lg overflow-hidden hover:shadow-[0_0_15px_rgba(59,130,246,0.3)] transition-all duration-300"
            >
              <div className="p-4">
                <div className="relative h-48 mb-4 overflow-hidden rounded-md">
                  <Image 
                    src={product.image || "/placeholder.svg"} 
                    alt={product.name} 
                    fill 
                    className="object-contain" 
                  />
                </div>
                <h3 className="text-xl font-semibold mb-2 text-cyan-300">{product.name}</h3>
                <div className="text-gray-300 mb-4 text-sm">
                  {expandedDescriptions[product.id] ? (
                    <ProductDescription description={product.description} />
                  ) : (
                    <>
                      <ProductDescription description={product.description.slice(0, 100)} />
                      ...
                    </>
                  )}
                  <button
                    onClick={() => toggleDescription(product.id)}
                    className="text-blue-400 hover:underline ml-2"
                  >
                    {expandedDescriptions[product.id] ? "Leer menos" : "Leer más"}
                  </button>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-lg font-bold text-blue-400">${product.price.toFixed(2)}</span>
                  <Button
                    onClick={() => addToCart(product)}
                    className="bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white"
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
          "fixed inset-y-0 right-0 w-full sm:w-96 bg-black/95 border-l border-blue-500/30 shadow-[0_0_25px_rgba(59,130,246,0.2)] z-50 transform transition-transform duration-300 ease-in-out",
          isCartOpen ? "translate-x-0" : "translate-x-full",
        )}
      >
        <div className="h-full flex flex-col p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-cyan-400 flex items-center gap-2">
              <ShoppingCart className="h-5 w-5" /> Tu Carrito
            </h2>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsCartOpen(false)}
              className="text-gray-400 hover:text-white hover:bg-blue-900/50"
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
                    <h3 className="text-lg font-bold text-cyan-300 mb-2">{category}</h3>
                    {items.map((item) => (
                      <div key={item.product.id} className="bg-blue-900/30 rounded-lg p-4">
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
                            <h3 className="font-medium text-cyan-300">
                              {item.product.name}{" "}
                              {item.size && <span className="text-gray-400 text-sm">({item.size})</span>}
                            </h3>
                            <p className="text-blue-400 text-sm font-bold">
                              ${item.product?.price?.toFixed(2) || "0.00"}
                            </p>
                          </div>
                        </div>

                        <div className="flex justify-between items-center mt-3">
                          <div className="flex items-center gap-2">
                            <Button
                              variant="outline"
                              size="icon"
                              className="h-7 w-7 border-blue-500 hover:bg-blue-800"
                              onClick={() => updateQuantity(item.product.id, item.quantity - 1)}
                            >
                              <Minus className="h-3 w-3" />
                            </Button>
                            <span className="w-8 text-center">{item.quantity}</span>
                            <Button
                              variant="outline"
                              size="icon"
                              className="h-7 w-7 border-blue-500 hover:bg-blue-800"
                              onClick={() => updateQuantity(item.product.id, item.quantity + 1)}
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
                <Separator className="bg-blue-500/30" />
                <div className="flex justify-between text-lg font-bold">
                  <span>Total:</span>
                  <span className="text-blue-400">${totalPrice.toFixed(2)}</span>
                </div>
                <Button
                  className="w-full bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white"
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

