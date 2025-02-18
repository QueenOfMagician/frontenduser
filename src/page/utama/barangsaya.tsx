"use client"

import { MoreHorizontal, Download, Edit, Trash2, Plus } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Link } from "react-router-dom"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import Header from "@/components/pagecomponent/header-page"
import { useEffect, useState } from "react"

// Type definitions
interface Product {
  nama: string
  harga_saatini: number
  bidder: string
  bidder_tertinggi: string
}

export default function BarangSaya() {
  const [products, setProducts] = useState<Product[]>([])

  useEffect(() => {
    const accessToken = sessionStorage.getItem('accessToken');
  
    fetch("http://34.128.95.7:8000/lelang/barangsaya/", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${accessToken}`, // Kirim token di header
      },
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        return response.json();
      })
      .then((data) => setProducts(data))
      .catch((error) => console.error("Error fetching data:", error));
  }, []);
  

  // Handle download
  const handleDownload = (productName: string) => {
    console.log("Downloading product info for:", productName)
    // Implement download logic here
  }

  // Handle delete
  const handleDelete = (productName: string) => {
    console.log("Deleting product:", productName)
    // Implement delete logic here
  }

  return (
    <>
      <Header />
      <div className="container mx-auto py-10 px-10 ">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">Manajemen Barang Saya</h1>
          <Button>
            <Link to={`/tambahbarang`} className="flex items-center">
              <Plus className="mr-2 h-4 w-4" />
              Add Product
            </Link>
          </Button>
        </div>

        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Product Name</TableHead>
                <TableHead>Current Bidder</TableHead>
                <TableHead>Current Price</TableHead>
                <TableHead className="text-center">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {products.map((product) => (
                <TableRow key={product.nama}>
                  <TableCell className="font-medium">{product.nama}</TableCell>
                  <TableCell>{product.bidder_tertinggi}</TableCell>
                  <TableCell>Rp {product.harga_saatini.toLocaleString()}</TableCell>
                  <TableCell className="text-center">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="h-8 w-8 p-0">
                          <span className="sr-only">Open menu</span>
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => handleDownload(product.nama)} className="cursor-pointer">
                          <Download className="mr-2 h-4 w-4" />
                          Download
                        </DropdownMenuItem>
                        <DropdownMenuItem asChild>
                          <Link to={`/`} className="flex items-center">
                            <Edit className="mr-2 h-4 w-4" />
                            Edit
                          </Link>
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={() => handleDelete(product.nama)}
                          className="cursor-pointer text-destructive focus:text-destructive"
                        >
                          <Trash2 className="mr-2 h-4 w-4" />
                          Cancel Auction
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>
    </>
  )
}

