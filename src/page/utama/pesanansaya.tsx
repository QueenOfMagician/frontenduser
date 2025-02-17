import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import Header from "@/components/pagecomponent/header-page"
import FooterPage from "@/components/pagecomponent/footer-page"

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
  // This would typically come from an API or database
  const orders = [
    { id: 1, title: "Lukisan Antik", currentBid: 5000000, endTime: "2025-02-20T15:00:00Z", winner: "Anda" },
    { id: 2, title: "Jam Tangan Vintage", currentBid: 2000000, endTime: "2025-02-21T10:00:00Z", winner: "User123" },
    { id: 3, title: "Patung Marmer", currentBid: 10000000, endTime: "2025-02-22T18:00:00Z", winner: "Anda" },
  ]

  return (
    <div className="p-10">
    <div className="grid gap-4">
      {orders.map((order) => (
        <Card key={order.id}>
          <CardHeader>
            <CardTitle>{order.title}</CardTitle>
            <CardDescription>ID Lelang: {order.id}</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex justify-between items-center">
              <div>
                <p className="text-sm text-muted-foreground">Tawaran Saat Ini</p>
                <p className="text-lg font-semibold">Rp {order.currentBid.toLocaleString("id-ID")}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Berakhir Pada</p>
                <p className="text-lg font-semibold">{new Date(order.endTime).toLocaleString("id-ID")}</p>
              </div>
            </div>
            <div className="mt-4 flex justify-between items-center">
              <div>
                <p className="text-sm text-muted-foreground">Pemenang</p>
                <p className="text-lg font-semibold">{order.winner}</p>
              </div>
              <StatusBadge status={status} />
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
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
