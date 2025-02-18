"use client"

import { useEffect, useState } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import Header from "@/components/pagecomponent/header-page"
import FooterPage from "@/components/pagecomponent/footer-page"

interface Order {
  kode: string
  nama: string
  harga_saatini: number
  bidder_tertinggi: string | null
  pernah_mengikuti: boolean
  lelang_ditutup: string
}

export default function PesananSaya() {
  return (
    <>
      <Header />
      <div className="p-10">
        <div className="container mx-auto py-8">
          <h1 className="text-3xl font-bold mb-6">Pesanan Saya</h1>
          <Tabs defaultValue="ongoing">
            <TabsList className="grid w-full grid-cols-2 mb-6">
              <TabsTrigger value="ongoing">Sedang Berlangsung</TabsTrigger>
              <TabsTrigger value="ended">Lelang Berakhir</TabsTrigger>
            </TabsList>
            <TabsContent value="ongoing">
              <OrderList status="ongoing" />
            </TabsContent>
            <TabsContent value="ended">
              <OrderList status="ended" />
            </TabsContent>
          </Tabs>
        </div>
      </div>
      <FooterPage />
    </>
  )
}

type OrderStatus = "ongoing" | "ended"

function OrderList({ status }: { status: OrderStatus }) {
  const [orders, setOrders] = useState<Order[]>([])

  useEffect(() => {
    async function fetchOrders() {
      try {
        const accessToken = sessionStorage.getItem('accessToken'); // Ambil token dari sessionStorage
  
        const response = await fetch("http://34.128.95.7:8000/lelang/pesanansaya/", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${accessToken}`, // Kirim token di header
          },
        });
  
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
  
        const data = await response.json();
        setOrders(data); // Set state orders
      } catch (error) {
        console.error("Error fetching orders:", error);
      }
    }
  
    fetchOrders();
  }, []);
  

  const filteredOrders = orders.filter((order) => {
    const isEnded = new Date(order.lelang_ditutup) < new Date()
    return status === "ended" ? isEnded : !isEnded
  })

  return (
    <div className="grid gap-4">
      {filteredOrders
        .filter((order) => order.pernah_mengikuti)
        .map((order) => (
          <Card key={order.kode}>
            <CardHeader>
              <CardTitle>{order.nama}</CardTitle>
              <CardDescription>ID Lelang: {order.kode}</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex justify-between items-center">
                <div>
                  <p className="text-sm text-muted-foreground">Tawaran Saat Ini</p>
                  <p className="text-lg font-semibold">Rp {order.harga_saatini.toLocaleString("id-ID")}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Berakhir Pada</p>
                  <p className="text-lg font-semibold">
                    {new Date(order.lelang_ditutup).toLocaleString("id-ID")}
                  </p>
                </div>
              </div>
              <div className="mt-4 flex justify-between items-center">
                <div>
                  <p className="text-sm text-muted-foreground">Pemenang</p>
                  <p className="text-lg font-semibold">{order.bidder_tertinggi || "Belum ada"}</p>
                </div>
                <StatusBadge status={status} />
              </div>
            </CardContent>
          </Card>
        ))}
    </div>
  )
}

function StatusBadge({ status }: { status: OrderStatus }) {
  switch (status) {
    case "ongoing":
      return <Badge className="bg-blue-500">Sedang Berlangsung</Badge>
    case "ended":
      return <Badge className="bg-green-500">Lelang Berakhir</Badge>
  }
}

