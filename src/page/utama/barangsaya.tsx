"use client"

import { MoreHorizontal, Download, Edit, Trash2, Plus } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Link } from 'react-router-dom';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import Header from "@/components/pagecomponent/header-page";

// Type definitions
interface Product {
  id: string
  name: string
  bidder: string
  currentPrice: number
}

// Sample data
const products: Product[] = [
  {
    id: "1",
    name: "iPhone 14 Pro",
    bidder: "John Doe",
    currentPrice: 999.99,
  },
  {
    id: "2",
    name: "MacBook Air M2",
    bidder: "Jane Smith",
    currentPrice: 1299.99,
  },
  {
    id: "3",
    name: "iPad Pro 12.9",
    bidder: "Bob Wilson",
    currentPrice: 799.99,
  },
  {
    id: "4",
    name: "AirPods Pro",
    bidder: "Alice Brown",
    currentPrice: 249.99,
  },
]

export default function BarangSaya() {
  // Handle download
  const handleDownload = (productId: string) => {
    console.log("Downloading product info for ID:", productId)
    // Implement download logic here
  }

  // Handle delete
  const handleDelete = (productId: string) => {
    console.log("Deleting product with ID:", productId)
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
              <TableHead>Bidder</TableHead>
              <TableHead className="text-right">Current Price</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {products.map((product) => (
              <TableRow key={product.id}>
                <TableCell className="font-medium">{product.name}</TableCell>
                <TableCell>{product.bidder}</TableCell>
                <TableCell className="text-right">${product.currentPrice.toFixed(2)}</TableCell>
                <TableCell className="text-right">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" className="h-8 w-8 p-0">
                        <span className="sr-only">Open menu</span>
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem onClick={() => handleDownload(product.id)} className="cursor-pointer">
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
                        onClick={() => handleDelete(product.id)}
                        className="cursor-pointer text-destructive focus:text-destructive"
                      >
                        <Trash2 className="mr-2 h-4 w-4" />
                        Delete
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
