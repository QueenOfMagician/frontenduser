import { Search, User, ShoppingBag, Bell, Store } from 'lucide-react'
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu"
import { Link, useNavigate, useSearchParams } from "react-router-dom"
import { useState } from "react"

export default function Header() {
  const navigate = useNavigate()
  const [searchParams, setSearchParams] = useSearchParams()
  const [searchQuery, setSearchQuery] = useState(searchParams.get("q") || "")

  const handleLogout = () => {
    // Remove all session storage items
    sessionStorage.removeItem("accessToken")
    sessionStorage.removeItem("refreshToken")
    sessionStorage.removeItem("accessTokenExpiry")
    sessionStorage.removeItem("userId")
    sessionStorage.removeItem("username")
    sessionStorage.removeItem("penerima")

    alert("Logged out successfully!")
    navigate("/akun/signin")
  }

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    if (searchQuery.trim()) {
      setSearchParams({ q: searchQuery })
      navigate(`/?q=${encodeURIComponent(searchQuery)}`)
    } else {
      setSearchParams({})
      navigate("/")
    }
  }

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between px-4">
        <Link to="/" className="flex items-center space-x-3 transition-transform hover:scale-105">
          <img src="/placeholder.svg?height=40&width=40" alt="SA Logo" width={40} height={40} className="rounded-lg" />
          <span className="text-xl font-bold bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
            SAuction
          </span>
        </Link>

        <div className="flex items-center space-x-4">
          <form onSubmit={handleSearch} className="relative hidden md:block">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Cari produk..."
              className="w-[300px] pl-9 rounded-full bg-muted"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </form>

          <div className="flex items-center space-x-2">
            <Button variant="ghost" size="icon" className="relative hidden md:flex">
              <Bell className="h-5 w-5" />
              <span className="absolute -right-1 -top-1 h-4 w-4 rounded-full bg-primary text-[10px] font-bold text-primary-foreground flex items-center justify-center">
                3
              </span>
            </Button>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" className="relative flex items-center gap-2 rounded-full">
                  <User className="h-4 w-4" />
                  <span className="hidden md:inline-block">{sessionStorage.getItem("username") || "Akun"}</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <DropdownMenuLabel>Hai {sessionStorage.getItem("username")}</DropdownMenuLabel>
                <DropdownMenuLabel className="flex items-center justify-between">
                  <span>Balance:</span>
                  <span className="font-mono">
                    10000 <span className="text-primary">SOL</span>
                  </span>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <Link to="/profil">
                  <DropdownMenuItem>
                    <User className="mr-2 h-4 w-4" />
                    Profil
                  </DropdownMenuItem>
                </Link>
                <Link to="/pesanansaya">
                  <DropdownMenuItem>
                    <ShoppingBag className="mr-2 h-4 w-4" />
                    Pesanan Saya
                  </DropdownMenuItem>
                </Link>
                <Link to="/barangsaya">
                  <DropdownMenuItem>
                    <Store className="mr-2 h-4 w-4" />
                    Barang Saya
                  </DropdownMenuItem>
                </Link>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleLogout} className="text-destructive focus:text-destructive">
                  Keluar
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </div>

      {/* Mobile Search */}
      <div className="container py-4 md:hidden">
        <form onSubmit={handleSearch} className="relative">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Cari produk..."
            className="w-full pl-9 rounded-full bg-muted"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </form>
      </div>
    </header>
  )
}
