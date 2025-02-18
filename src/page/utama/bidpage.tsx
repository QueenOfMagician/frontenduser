"use client"

import { useState, useEffect, useRef } from "react"
import { useParams } from "react-router-dom"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { format } from "date-fns"
import { ScrollArea } from "@/components/ui/scroll-area"
import HeaderPage from "@/components/pagecomponent/header-page"
import { useAuction } from "@/page/data/dataBarangLelang"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"

interface Bid {
  id: number
  pelelang: string
  harga_bid: number
  waktu_bid: string
}

export default function BidPage() {
  const { kode } = useParams<{ kode: string }>()
  const { allProducts } = useAuction()
  const [product, setProduct] = useState<any>(null)
  const [countdown, setCountdown] = useState("")
  const [bidHistory, setBidHistory] = useState<Bid[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [bidAmount, setBidAmount] = useState("")
  const wsRef = useRef<WebSocket | null>(null)

  useEffect(() => {
    const foundProduct = allProducts.find((p) => p.kode === kode)
    if (foundProduct) {
      setProduct(foundProduct)
      setIsLoading(false)
      setBidAmount(Math.ceil((foundProduct.harga_saatini || 0) * 1.01).toString())
      fetchBidHistory()

      
      wsRef.current = new WebSocket(`ws://34.128.95.7:8000/ws/auction/${kode}/`)

      wsRef.current.onmessage = (event) => {
        const data = JSON.parse(event.data)
        if (data.harga_baru && data.barang_id === foundProduct.kode) {
          setProduct((prevProduct: typeof product | null) => ({
            ...prevProduct,
            harga_saatini: data.harga_baru,
          }))          
          fetchBidHistory() 
        }
      }

      return () => {
        if (wsRef.current) {
          wsRef.current.close()
        }
      }
    }
  }, [kode, allProducts])

  useEffect(() => {
    if (!product) return

    const timer = setInterval(() => {
      const now = new Date().getTime()
      const closingTime = new Date(product.lelang_ditutup || new Date()).getTime()
      const timeLeft = closingTime - now

      if (timeLeft < 0) {
        clearInterval(timer)
        setCountdown("Auction Closed")
      } else {
        const days = Math.floor(timeLeft / (1000 * 60 * 60 * 24))
        const hours = Math.floor((timeLeft % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))
        const minutes = Math.floor((timeLeft % (1000 * 60 * 60)) / (1000 * 60))
        const seconds = Math.floor((timeLeft % (1000 * 60)) / 1000)

        setCountdown(
          `${days.toString().padStart(2, "0")} days ${hours.toString().padStart(2, "0")} Hours ${minutes.toString().padStart(2, "0")} Minutes ${seconds.toString().padStart(2, "0")} Seconds`,
        )
      }
    }, 1000)

    return () => clearInterval(timer)
  }, [product])

  const handlePercentageClick = (percentage: number) => {
    if (product && product.harga_saatini) {
      const currentPrice = Number.parseInt(product.harga_saatini)
      if (isNaN(currentPrice)) {
        console.error("Invalid current price")
        return
      }

      const increase = Math.ceil(currentPrice * (percentage / 100))
      const newBid = currentPrice + increase
      setBidAmount(newBid.toString())
    }
  }

  const handleBidSubmit = async () => {
    try {
      if (!bidAmount || isNaN(Number.parseInt(bidAmount))) {
        throw new Error("Bid amount is invalid.")
      }

      const response = await fetch("http://34.128.95.7:8000/lelang/bid/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${sessionStorage.getItem("accessToken") || ""}`,
        },
        body: JSON.stringify({
          barang: product.kode,
          pelelang: sessionStorage.getItem("username") || "anonymous",
          harga_bid: Number.parseInt(bidAmount),
        }),
      })

      if (!response.ok) {
        const errorText = await response.text()
        throw new Error(`Failed to submit bid: ${response.status} - ${errorText}`)
      }

      const data = await response.json()
      console.log("Bid submitted successfully:", data)
      setIsDialogOpen(false)

      fetchBidHistory()
    } catch (error) {
      console.error("Error submitting bid:", error)
    }
  }

  const fetchBidHistory = () => {
    fetch(`http://34.128.95.7:8000/lelang/riwayat/?barang_kode=${kode}`, {
      headers: {
        Authorization: `Bearer ${sessionStorage.getItem("accessToken")}`,
      },
    })
      .then((response) => response.json())
      .then((data) => {
        const mappedData = data.map((bid: any) => ({
          id: bid.id,
          pelelang: bid.pelelang,
          harga_bid: bid.harga_bid,
          waktu_bid: bid.waktu_bid,
        }))
        const sortedData = mappedData.sort(
          (a: Bid, b: Bid) => new Date(b.waktu_bid).getTime() - new Date(a.waktu_bid).getTime(),
        )
        setBidHistory(sortedData)
      })
      .catch((error) => console.error("Error fetching bid history:", error))
  }

  if (isLoading || !product) {
    return <div className="flex items-center justify-center min-h-screen">Loading...</div>
  }

  return (
    <>
      <HeaderPage />
      <div className="container mx-auto p-4 bg-gradient-to-r from-purple-100 to-pink-100 dark:from-purple-900 dark:to-pink-900">
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>{product.nama || "Unknown Product"}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <img
                  src={product.gambar ? `http://34.128.95.7:8000${product.gambar}` : "/placeholder.svg"}
                  alt={product.nama || "Product Image"}
                  className="w-full h-64 object-cover rounded-lg"
                />
              </div>
              <div>
                <p>
                  <strong>Category:</strong> {product.kategori || "N/A"}
                </p>
                <p>
                  <strong>Initial Price:</strong> ${(product.harga_buka || 0).toLocaleString()}
                </p>
                <p>
                  <strong>Current Price:</strong> $
                  {product.harga_saatini ? Number.parseInt(product.harga_saatini).toLocaleString() : "N/A"}
                </p>
                <p>
                  <strong>Seller:</strong> {product.penjual || "N/A"}
                </p>
                <p>
                  <strong>Release Date:</strong>{" "}
                  {product.lelang_dibuka ? format(new Date(product.lelang_dibuka), "yyyy-MM-dd HH:mm:ss") : "N/A"}
                </p>
                <p>
                  <strong>Closing Date:</strong>{" "}
                  {product.lelang_ditutup ? format(new Date(product.lelang_ditutup), "yyyy-MM-dd HH:mm:ss") : "N/A"}
                </p>
                <p>
                  <strong>Countdown:</strong> {countdown}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Bid History</CardTitle>
          </CardHeader>
          <CardContent>
            <ScrollArea className="h-64">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Bidder</TableHead>
                    <TableHead>Amount</TableHead>
                    <TableHead>Date</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {bidHistory.map((bid) => (
                    <TableRow key={bid.id}>
                      <TableCell>{bid.pelelang}</TableCell>
                      <TableCell>
                        {bid.harga_bid ? new Intl.NumberFormat("id-ID").format(Number(bid.harga_bid)) : "N/A"}
                      </TableCell>
                      <TableCell>{format(new Date(bid.waktu_bid), "yyyy-MM-dd HH:mm:ss")}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </ScrollArea>
          </CardContent>
        </Card>

        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button>Place a Bid</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Place Your Bid</DialogTitle>
              <DialogDescription>
                Enter your bid amount for {product.nama || "this product"}. The current price is $
                {(Number.parseInt(product.harga_saatini) || 0).toLocaleString()}.
              </DialogDescription>
            </DialogHeader>
            <div className="mt-4">
              <Input
                value={bidAmount}
                onChange={(e) => setBidAmount(e.target.value)}
                placeholder="Enter your bid"
                type="number"
                min={Number.parseInt(product.harga_saatini) || 0}
                step="1"
              />
            </div>
            <div className="mt-4 flex justify-between">
              <Button onClick={() => handlePercentageClick(5)}>+5%</Button>
              <Button onClick={() => handlePercentageClick(10)}>+10%</Button>
              <Button onClick={() => handlePercentageClick(25)}>+25%</Button>
              <Button onClick={() => handlePercentageClick(50)}>+50%</Button>
              <Button onClick={() => handlePercentageClick(100)}>+100%</Button>
            </div>
            <div className="mt-4 flex justify-end space-x-4">
              <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                Cancel
              </Button>
              <Button onClick={handleBidSubmit}>Submit Bid</Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </>
  )
}