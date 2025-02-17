import { useState, useEffect } from 'react'
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet"
import { Filter, Clock, DollarSign, Calendar } from "lucide-react"
import { format, isValid } from 'date-fns'
import { Link } from 'react-router-dom'
import FooterPage from '@/components/pagecomponent/footer-page'
import Chatbot from '@/components/pagecomponent/chatbot'
import HeaderPage from '@/components/pagecomponent/header-page'
import Banner from '@/components/pagecomponent/banner'

interface Product {
  id: number
  nama: string
  kategori: string
  sub_kategori: string
  harga_awal: number
  harga_saatini: number
  gambar: string
  tanggal_rilis: string
  tanggal_tutup: string
  penjual: string
}


const categories: { [key: string]: string[] } = {
  "All": ["All"],
  "Non-Physical": ["Blockchain Domain", "Items in Game", "Virtual Land", "Card Collections", "Arts Collections", "Music", "Identity Virtual", "License", "Ticketing"],
  "Physical": ["Real Estate Property", "Luxury Goods", "Fine Arts", "Jewellery", "Manufactured Goods"]
}

export default function ListBarang() {
  const [isFilterOpen, setIsFilterOpen] = useState(false)
  const [filters, setFilters] = useState({
    kategori: "All",
    sub_kategori: "All",
    tanggal_rilis: "all",
    priceRange: "all",
    closingSoon: "all"
  })
  const [allProducts, setAllProducts] = useState<Product[]>([])
  const [products, setProducts] = useState<Product[]>([])
  const [displayedProducts, setDisplayedProducts] = useState<Product[]>([])
  const [page, setPage] = useState(1)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    setIsLoading(true)
    fetch('http://127.0.0.1:8000/lelang/list-barang/', {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${sessionStorage.getItem('accessToken')}`
      }
    })
    .then(response => {
      if (!response.ok) {
        throw new Error('Network response was not ok')
      }
      return response.json()
    })
    .then(data => {
      setAllProducts(data)
      setIsLoading(false)
    })
    .catch(error => {
      console.error('Error fetching data:', error)
      setError('Failed to fetch products. Please try again later.')
      setIsLoading(false)
    })
  }, [])

  useEffect(() => {
    const filteredProducts = allProducts.filter(product => {
      const categoryMatch = 
        filters.kategori === "All" || 
        product.kategori === filters.kategori

      const subCategoryMatch = 
        filters.sub_kategori === "All" || 
        product.sub_kategori === filters.sub_kategori

      const releaseDateMatch = filters.tanggal_rilis === "all" || 
        (filters.tanggal_rilis === "24h" && new Date(product.tanggal_rilis) >= new Date(Date.now() - 24 * 60 * 60 * 1000)) ||
        (filters.tanggal_rilis === "7d" && new Date(product.tanggal_rilis) >= new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)) ||
        (filters.tanggal_rilis === "15d" && new Date(product.tanggal_rilis) >= new Date(Date.now() - 15 * 24 * 60 * 60 * 1000)) ||
        (filters.tanggal_rilis === "1m" && new Date(product.tanggal_rilis) >= new Date(Date.now() - 30 * 24 * 60 * 60 * 1000))
      
      const priceRangeMatch = filters.priceRange === "all" ||
        (filters.priceRange === "0-100" && product.harga_saatini <= 100) ||
        (filters.priceRange === "100-500" && product.harga_saatini > 100 && product.harga_saatini <= 500) ||
        (filters.priceRange === "500-1000" && product.harga_saatini > 500 && product.harga_saatini <= 1000) ||
        (filters.priceRange === "1000+" && product.harga_saatini > 1000)
      
      const closingSoonMatch = filters.closingSoon === "all" ||
        (filters.closingSoon === "24h" && new Date(product.tanggal_tutup) <= new Date(Date.now() + 24 * 60 * 60 * 1000)) ||
        (filters.closingSoon === "7d" && new Date(product.tanggal_tutup) <= new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)) ||
        (filters.closingSoon === "15d" && new Date(product.tanggal_tutup) <= new Date(Date.now() + 15 * 24 * 60 * 60 * 1000)) ||
        (filters.closingSoon === "1m" && new Date(product.tanggal_tutup) <= new Date(Date.now() + 30 * 24 * 60 * 60 * 1000))

      return categoryMatch && subCategoryMatch && releaseDateMatch && priceRangeMatch && closingSoonMatch
    })
    
    setProducts(filteredProducts)
    setPage(1)
    setDisplayedProducts(filteredProducts.slice(0, 15))
  }, [filters, allProducts])

  const handleFilterChange = (filterType: string, value: string) => {
    setFilters(prevFilters => {
      if (filterType === 'kategori') {
        return { ...prevFilters, [filterType]: value, sub_kategori: "All" }
      }
      return { ...prevFilters, [filterType]: value }
    })
  }

  const applyFilters = () => {
    setIsFilterOpen(false)
  }

  const loadMore = () => {
    const nextPage = page + 1
    const startIndex = (nextPage - 1) * 15
    const endIndex = startIndex + 15
    setDisplayedProducts([...displayedProducts, ...products.slice(startIndex, endIndex)])
    setPage(nextPage)
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    if (!isValid(date)) {
      console.error(`Invalid date: ${dateString}`)
      return 'Invalid Date'
    }
    return format(date, 'MMM d, yyyy')
  }

  if (isLoading) {
    return <div className="flex items-center justify-center min-h-screen">Loading...</div>
  }

  if (error) {
    return <div className="flex items-center justify-center min-h-screen text-red-500">{error}</div>
  }

  const formatNumber = (num: number): string => {
    // Convert to string and trim trailing zeros
    const formatted = num.toString().replace(/\.?0+$/, '');
    return formatted;
  };

  return (
    <>
      <HeaderPage />
      <Banner />
      <main className="flex-1 bg-gradient-to-r from-purple-100 to-pink-100 dark:from-purple-900 dark:to-pink-900 flex items-center justify-center min-h-screen">
        <section className="w-full py-12 md:py-24 lg:py-32">
          <div className="container px-4 md:px-6">
            <div className="flex justify-between items-center mb-8">
              <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl text-purple-800 dark:text-purple-200">Auctions</h2>
              <Sheet open={isFilterOpen} onOpenChange={setIsFilterOpen}>
                <SheetTrigger asChild>
                  <Button variant="outline" className="bg-white dark:bg-gray-800">
                    <Filter className="mr-2 h-4 w-4" />
                    Filter
                  </Button>
                </SheetTrigger>
                <SheetContent>
                  <SheetHeader>
                    <SheetTitle>Filter Auctions</SheetTitle>
                  </SheetHeader>
                  <div className="grid gap-4 py-4">
                    <div className="space-y-2">
                      <Label htmlFor="kategori">Category</Label>
                      <Select value={filters.kategori} onValueChange={(value) => handleFilterChange("kategori", value)}>
                        <SelectTrigger id="kategori">
                          <SelectValue placeholder="Select kategori" />
                        </SelectTrigger>
                        <SelectContent>
                          {Object.keys(categories).map((kategori) => (
                            <SelectItem key={kategori} value={kategori}>
                              {kategori}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="sub_kategori">Sub Category</Label>
                      <Select value={filters.sub_kategori} onValueChange={(value) => handleFilterChange("sub_kategori", value)}>
                        <SelectTrigger id="sub_kategori">
                          <SelectValue placeholder="Select sub kategori" />
                        </SelectTrigger>
                        <SelectContent>
                          {categories[filters.kategori].map((sub_kategori) => (
                            <SelectItem key={sub_kategori} value={sub_kategori}>
                              {sub_kategori}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="release-date">Release Date</Label>
                      <Select value={filters.tanggal_rilis} onValueChange={(value) => handleFilterChange("tanggal_rilis", value)}>
                        <SelectTrigger id="release-date">
                          <SelectValue placeholder="Select release date" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">All Time</SelectItem>
                          <SelectItem value="24h">Last 24 hours</SelectItem>
                          <SelectItem value="7d">Last 7 days</SelectItem>
                          <SelectItem value="15d">Last 15 days</SelectItem>
                          <SelectItem value="1m">Last month</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="price-range">Price Range</Label>
                      <Select value={filters.priceRange} onValueChange={(value) => handleFilterChange("priceRange", value)}>
                        <SelectTrigger id="price-range">
                          <SelectValue placeholder="Select price range" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">All Prices</SelectItem>
                          <SelectItem value="0-100">$0 - $100</SelectItem>
                          <SelectItem value="100-500">$100 - $500</SelectItem>
                          <SelectItem value="500-1000">$500 - $1000</SelectItem>
                          <SelectItem value="1000+">$1000+</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="closing-soon">Closing Soon</Label>
                      <Select value={filters.closingSoon} onValueChange={(value) => handleFilterChange("closingSoon", value)}>
                        <SelectTrigger id="closing-soon">
                          <SelectValue placeholder="Select closing time" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">All</SelectItem>
                          <SelectItem value="24h">Next 24 hours</SelectItem>
                          <SelectItem value="7d">Next 7 days</SelectItem>
                          <SelectItem value="15d">Next 15 days</SelectItem>
                          <SelectItem value="1m">Next month</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  <Button onClick={applyFilters} className="w-full mt-4">Apply Filters</Button>
                </SheetContent>
              </Sheet>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {displayedProducts.map((product) => (
                <Card key={product.id} className="overflow-hidden transition-shadow duration-300 hover:shadow-xl">
                  <CardContent className="p-0">
                    <img src={`http://127.0.0.1:8000${product.gambar}`} alt={product.nama} className="w-full h-48 object-cover" />
                    <div className="p-4">
                      <h2 className="text-xl font-semibold text-purple-700 dark:text-purple-300 mb-2">{product.nama}</h2>
                      <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">Seller: {product.penjual}</p>
                      <div className="flex justify-between items-center mb-3">
                        <span className="flex items-center text-green-600 dark:text-green-400">
                          <DollarSign className="h-4 w-4 mr-1" />
                          ${formatNumber(product.harga_saatini)}
                        </span>
                        <span className="text-sm text-gray-500 dark:text-gray-400">
                          Initial: ${formatNumber(product.harga_awal)}
                        </span>
                      </div>
                      <div className="flex justify-between text-xs text-gray-500 dark:text-gray-400 mb-4">
                        <span className="flex items-center">
                          <Calendar className="h-3 w-3 mr-1" />
                          {formatDate(product.tanggal_rilis)}
                        </span>
                        <span className="flex items-center">
                          <Clock className="h-3 w-3 mr-1" />
                          {formatDate(product.tanggal_tutup)}
                        </span>
                      </div>
                      <Link to="/biding">
                        <Button className="w-full bg-purple-600 hover:bg-purple-700 text-white">Bid Now</Button>
                      </Link>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
            {displayedProducts.length < products.length && (
              <div className="mt-8 text-center">
                <Button onClick={loadMore} className="bg-purple-600 hover:bg-purple-700 text-white">Load More</Button>
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