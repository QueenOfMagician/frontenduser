"use client"

import type * as React from "react"
import { createContext, useState, useEffect, useContext } from "react"
import { format, isValid, differenceInSeconds } from "date-fns"

// Types and Interfaces
interface Product {
  kode: string
  nama: string
  deskripsi: string
  kategori: string
  harga_buka: number
  harga_saatini: number | null
  gambar: string | null
  lelang_dibuka: string
  lelang_ditutup: string
  penjual: string
}

interface AuctionContextType {
  allProducts: Product[]
  displayedProducts: Product[]
  isLoading: boolean
  error: string | null
  sortOrder: "newest" | "oldest"
  countdowns: { [key: string]: string }
  setSortOrder: (order: "newest" | "oldest") => void
  loadMore: () => void
}

// Context Creation
const AuctionContext = createContext<AuctionContextType | undefined>(undefined)

// Custom Hook
export const useAuction = () => {
  const context = useContext(AuctionContext)
  if (context === undefined) {
    throw new Error("useAuction must be used within an AuctionProvider")
  }
  return context
}

// Provider Component
export const AuctionProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // State Management
  const [allProducts, setAllProducts] = useState<Product[]>([])
  const [displayedProducts, setDisplayedProducts] = useState<Product[]>([])
  const [page, setPage] = useState(1)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [sortOrder, setSortOrder] = useState<"newest" | "oldest">("newest")
  const [countdowns, setCountdowns] = useState<{ [key: string]: string }>({})

  // Initial Data Fetch
  useEffect(() => {
    setIsLoading(true)
    fetch("http://34.128.95.7:8000/lelang/list-barang/", {
      method: "GET",
      headers: {
        Authorization: `Bearer ${sessionStorage.getItem("accessToken")}`,
      },
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error("Network response was not ok")
        }
        return response.json()
      })
      .then((data) => {
        if (!Array.isArray(data)) {
          throw new Error("Invalid data format")
        }
        setAllProducts(data)
        setIsLoading(false)
      })
      .catch((error) => {
        location.reload();
        console.error("Error fetching data:", error)
        setError("Failed to fetch products. Please try again later.")
        setIsLoading(false)
      })
  }, [])

  // Sort and Display Products
  useEffect(() => {
    const sortedProducts = [...allProducts].sort((a, b) => {
      const dateA = a.lelang_dibuka ? new Date(a.lelang_dibuka).getTime() : 0
      const dateB = b.lelang_dibuka ? new Date(b.lelang_dibuka).getTime() : 0
      return sortOrder === "newest" ? dateB - dateA : dateA - dateB
    })
    setDisplayedProducts(sortedProducts.slice(0, page * 15))
  }, [allProducts, sortOrder, page])

  // Load More Function
  const loadMore = () => {
    setPage((prevPage) => prevPage + 1)
  }

  // Countdown Timer
  useEffect(() => {
    const intervalId = setInterval(() => {
      const newCountdowns: { [key: string]: string } = {}
      displayedProducts.forEach((product) => {
        if (!product.lelang_ditutup) {
          newCountdowns[product.kode] = "Invalid Date"
          return
        }

        const endDate = new Date(product.lelang_ditutup)
        if (!isValid(endDate)) {
          newCountdowns[product.kode] = "Invalid Date"
          return
        }

        const secondsLeft = differenceInSeconds(endDate, new Date())
        if (secondsLeft > 0) {
          const hours = Math.floor(secondsLeft / 3600)
          const minutes = Math.floor((secondsLeft % 3600) / 60)
          const seconds = secondsLeft % 60
          newCountdowns[product.kode] = `${hours}h ${minutes}m ${seconds}s`
        } else {
          newCountdowns[product.kode] = "Ended"
        }
      })
      setCountdowns(newCountdowns)
    }, 1000)
    return () => clearInterval(intervalId)
  }, [displayedProducts])

  // WebSocket for Price Updates
  useEffect(() => {
    const priceUpdateConnections = allProducts.map((product) => {
      const ws = new WebSocket(`ws://34.128.95.7:8000/ws/auction/${product.kode}/`)

      ws.onopen = () => {
        console.log(`Price WebSocket connected for product: ${product.kode}`)
      }

      ws.onmessage = (event) => {
        const data = JSON.parse(event.data)
        if (data.harga_baru && data.barang_id) {
          setAllProducts((prevProducts) =>
            prevProducts.map((p) => (p.kode === data.barang_id ? { ...p, harga_saatini: data.harga_baru } : p)),
          )
        }
      }

      ws.onerror = (error) => {
        console.error(`Price WebSocket error for product ${product.kode}:`, error)
      }

      return ws
    })

    return () => {
      priceUpdateConnections.forEach((ws) => ws.close())
    }
  }, [allProducts])

  // WebSocket for New Items
  useEffect(() => {
    const ws = new WebSocket("ws://34.128.95.7:8000/ws/update/")

    ws.onopen = () => {
      console.log("New items WebSocket connected")
    }

    ws.onmessage = (event) => {
      const data = JSON.parse(event.data)
      console.log("New item received:", data)

      if (data.message === "Barang baru ditambahkan" && data.item) {
        setAllProducts((prevProducts) => {
          // Check for duplicates
          if (prevProducts.some((p) => p.kode === data.item.kode)) {
            return prevProducts
          }

          // Add new item and maintain sort order
          const newProducts = [...prevProducts, data.item]
          return newProducts.sort((a, b) => {
            const dateA = a.lelang_dibuka ? new Date(a.lelang_dibuka).getTime() : 0
            const dateB = b.lelang_dibuka ? new Date(b.lelang_dibuka).getTime() : 0
            return sortOrder === "newest" ? dateB - dateA : dateA - dateB
          })
        })
      }
    }

    ws.onerror = (error) => {
      console.error("New items WebSocket error:", error)
    }

    ws.onclose = () => {
      console.log("New items WebSocket closed")
    }

    return () => ws.close()
  }, [sortOrder])

  // Context Value
  const value: AuctionContextType = {
    allProducts,
    displayedProducts,
    isLoading,
    error,
    sortOrder,
    countdowns,
    setSortOrder,
    loadMore,
  }

  return <AuctionContext.Provider value={value}>{children}</AuctionContext.Provider>
}

// Utility Functions
export const formatDate = (dateString: string) => {
  if (!dateString) return "Invalid Date"
  const date = new Date(dateString)
  if (!isValid(date)) {
    console.error(`Invalid date: ${dateString}`)
    return "Invalid Date"
  }
  return format(date, "MMM d, yyyy")
}

export const formatNumber = (num: number | undefined | null): string => {
  if (typeof num !== "number" || isNaN(num)) {
    return "N/A"
  }
  return num.toLocaleString("id-ID")
}

