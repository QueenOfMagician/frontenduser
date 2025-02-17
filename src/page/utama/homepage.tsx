"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { DollarSign, Calendar, Clock } from "lucide-react"
import { Link, useSearchParams } from "react-router-dom"
import FooterPage from "@/components/pagecomponent/footer-page"
import Chatbot from "@/components/pagecomponent/chatbot"
import HeaderPage from "@/components/pagecomponent/header-page"
import Banner from "@/components/pagecomponent/banner"
import { useEffect, useState } from "react"
import { useAuction, formatDate, formatNumber } from "@/page/data/dataBarangLelang"

export default function ListBarang() {
  const { displayedProducts, isLoading, error, sortOrder, countdowns, setSortOrder, loadMore, allProducts } =
    useAuction()

  const [searchParams] = useSearchParams()
  const [filteredProducts, setFilteredProducts] = useState(displayedProducts)
  const searchQuery = searchParams.get("q")

  useEffect(() => {
    const fetchSearchResults = async () => {
      if (searchQuery) {
        try {
          const response = await fetch(`http://127.0.0.1:8000/lelang/search/?q=${encodeURIComponent(searchQuery)}`)
          if (!response.ok) throw new Error("Search failed")
          const data = await response.json()
          setFilteredProducts(data)
        } catch (error) {
          console.error("Search error:", error)
          setFilteredProducts([])
        }
      } else {
        setFilteredProducts(displayedProducts)
      }
    }

    fetchSearchResults()
  }, [searchQuery, displayedProducts])

  if (isLoading) {
    return <div className="flex items-center justify-center min-h-screen">Loading...</div>
  }

  if (error) {
    return <div className="flex items-center justify-center min-h-screen text-red-500">{error}</div>
  }

  const productsToDisplay = searchQuery ? filteredProducts : displayedProducts

  return (
    <>
      <HeaderPage />
      <Banner />
      <main className="flex-1 bg-gradient-to-r from-purple-100 to-pink-100 dark:from-purple-900 dark:to-pink-900 flex items-center justify-center min-h-screen">
        <section className="w-full py-12 md:py-24 lg:py-32">
          <div className="container px-4 md:px-6">
            <div className="flex justify-between items-center mb-8">
              <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl text-purple-800 dark:text-purple-200">
                {searchQuery ? `Search Results for "${searchQuery}"` : "Auctions"}
              </h2>
              <Select value={sortOrder} onValueChange={(value: "newest" | "oldest") => setSortOrder(value)}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Sort by" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="newest">Newest First</SelectItem>
                  <SelectItem value="oldest">Oldest First</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Products Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {productsToDisplay.map((product) => (
                <Card key={product.kode} className="overflow-hidden transition-shadow duration-300 hover:shadow-xl">
                  <CardContent className="p-2">
                    <div className="overflow-hidden rounded-lg mb-2">
                      <img
                        src={`http://127.0.0.1:8000/${product.gambar}`}
                        alt={product.nama}
                        className="w-full h-60 object-cover rounded-lg"
                      />
                    </div>
                    <div className="p-4">
                      <h2 className="text-xl font-semibold text-purple-700 dark:text-purple-300 mb-2">
                        {product.nama}
                      </h2>
                      <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">Seller: {product.penjual}</p>
                      <div className="flex justify-between items-center mb-3">
                        <span className="flex items-center text-green-600 dark:text-green-400">
                          <DollarSign className="h-4 w-4 mr-1" />${formatNumber(product.harga_saatini)}
                        </span>
                        <span className="text-sm text-gray-500 dark:text-gray-400">
                          Initial: ${formatNumber(product.harga_buka)}
                        </span>
                      </div>
                      <div className="flex justify-between text-xs text-gray-500 dark:text-gray-400 mb-4">
                        <span className="flex items-center">
                          <Calendar className="h-3 w-3 mr-1" />
                          {formatDate(product.lelang_dibuka)}
                        </span>
                        <span className="flex items-center">
                          <Clock className="h-3 w-3 mr-1" />
                          {countdowns[product.kode] || "Calculating..."}
                        </span>
                      </div>
                      <Link to={`/biding/${product.kode}`}>
                        <Button className="w-full bg-purple-600 hover:bg-purple-700 text-white">Bid Now</Button>
                      </Link>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {!searchQuery && displayedProducts.length < allProducts.length && (
              <div className="mt-8 text-center">
                <Button onClick={loadMore} className="bg-purple-600 hover:bg-purple-700 text-white">
                  Load More
                </Button>
              </div>
            )}
          </div>
        </section>
      </main>
      <FooterPage />
      <Chatbot />
    </>
  )
}

