"use client"

import type React from "react"
import { useState } from "react"
import { CalendarIcon, ImageIcon, Loader2 } from "lucide-react"
import { format } from "date-fns"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Textarea } from "@/components/ui/textarea"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import HeaderPage from "@/components/pagecomponent/header-page"
import FooterPage from "@/components/pagecomponent/footer-page"

// Form validation schema
const formSchema = z.object({
  nama: z.string().min(1, "Nama harus diisi"),
  deskripsi: z.string().min(1, "Deskripsi harus diisi"),
  kategori: z.string().min(1, "Kategori harus diisi"),
  harga_buka: z.number().min(0, "Harga buka harus lebih dari 0"),
  gambar: z.instanceof(File).optional(),
  lelang_dibuka: z.date({
    required_error: "Tanggal lelang dibuka harus diisi",
  }),
  lelang_ditutup: z.date({
    required_error: "Tanggal lelang ditutup harus diisi",
  }),
  penjual: z.string().min(1, "Nama penjual harus diisi"),
})

type FormValues = z.infer<typeof formSchema>

export default function AddItemForm() {
  const [imagePreview, setImagePreview] = useState<string | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      nama: "",
      deskripsi: "",
      kategori: "",
      harga_buka: 0,
      penjual: "",
    },
  })

  async function onSubmit(data: FormValues) {
    setIsSubmitting(true)
    try {
      const formData = new FormData()
      Object.entries(data).forEach(([key, value]) => {
        if (value instanceof Date) {
          formData.append(key, value.toISOString())
        } else if (value instanceof File) {
          formData.append(key, value)
        } else {
          formData.append(key, String(value))
        }
      })

      // Replace with your API endpoint
      const response = await fetch("http://34.128.95.7:8000/lelang/tambahbarang/", {
        method: "POST",
        body: formData,
      })

      if (!response.ok) {
        throw new Error("Gagal menambahkan barang")
      }

      // Reset form and image preview on success
      form.reset()
      setImagePreview(null)
      alert("Barang berhasil ditambahkan!")
    } catch (error) {
      console.error("Error:", error)
      alert("Terjadi kesalahan saat menambahkan barang")
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      form.setValue("gambar", file)
      const reader = new FileReader()
      reader.onloadend = () => {
        setImagePreview(reader.result as string)
      }
      reader.readAsDataURL(file)
    } else {
      setImagePreview(null)
      form.setValue("gambar", undefined)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-r from-purple-100 to-pink-100 dark:from-purple-900 dark:to-pink-900">
      <HeaderPage />
      <main className="container py-8 md:py-12">
        <Card className="w-full max-w-2xl mx-auto">
          <CardHeader>
            <CardTitle>Tambah Barang Lelang</CardTitle>
            <CardDescription>Masukkan informasi barang yang akan dilelang</CardDescription>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <FormField
                  control={form.control}
                  name="nama"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Nama Barang</FormLabel>
                      <FormControl>
                        <Input placeholder="Masukkan nama barang" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="deskripsi"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Deskripsi</FormLabel>
                      <FormControl>
                        <Textarea placeholder="Masukkan deskripsi barang" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="kategori"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Kategori</FormLabel>
                      <FormControl>
                        <Input placeholder="Masukkan kategori" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="harga_buka"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Harga Buka</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          placeholder="Masukkan harga buka"
                          {...field}
                          onChange={(e) => field.onChange(Number(e.target.value))}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="lelang_dibuka"
                  render={({ field }) => (
                    <FormItem className="flex flex-col">
                      <FormLabel>Tanggal Lelang Dibuka</FormLabel>
                      <Popover>
                        <PopoverTrigger asChild>
                          <FormControl>
                            <Button
                              variant={"outline"}
                              className={cn(
                                "w-full pl-3 text-left font-normal",
                                !field.value && "text-muted-foreground",
                              )}
                            >
                              {field.value ? format(field.value, "PPP") : <span>Pilih tanggal</span>}
                              <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                            </Button>
                          </FormControl>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0" align="start">
                          <Calendar
                            mode="single"
                            selected={field.value}
                            onSelect={field.onChange}
                            disabled={(date) => date < new Date() || date > new Date("2100-01-01")}
                            initialFocus
                          />
                        </PopoverContent>
                      </Popover>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="lelang_ditutup"
                  render={({ field }) => (
                    <FormItem className="flex flex-col">
                      <FormLabel>Tanggal Lelang Ditutup</FormLabel>
                      <Popover>
                        <PopoverTrigger asChild>
                          <FormControl>
                            <Button
                              variant={"outline"}
                              className={cn(
                                "w-full pl-3 text-left font-normal",
                                !field.value && "text-muted-foreground",
                              )}
                            >
                              {field.value ? format(field.value, "PPP") : <span>Pilih tanggal</span>}
                              <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                            </Button>
                          </FormControl>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0" align="start">
                          <Calendar
                            mode="single"
                            selected={field.value}
                            onSelect={field.onChange}
                            disabled={(date) => date < new Date() || date > new Date("2100-01-01")}
                            initialFocus
                          />
                        </PopoverContent>
                      </Popover>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="penjual"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Nama Penjual</FormLabel>
                      <FormControl>
                        <Input placeholder="Masukkan nama penjual" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  rules={{ required: "Gambar harus diunggah" }}
                  name="gambar"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Gambar Barang</FormLabel>
                      <FormControl>
                        <div className="space-y-4">
                          <Input
                            type="file"
                            accept="image/*"
                            onChange={handleImageChange}
                            ref={field.ref}
                            name={field.name}
                          />
                          {imagePreview && (
                            <div className="relative aspect-video w-full max-w-sm">
                              <img
                                src={imagePreview || "/placeholder.svg"}
                                alt="Preview"
                                className="rounded-lg object-cover"
                              />
                            </div>
                          )}
                          {!imagePreview && (
                            <div className="flex aspect-video w-full max-w-sm items-center justify-center rounded-lg border border-dashed">
                              <ImageIcon className="h-8 w-8 text-muted-foreground" />
                            </div>
                          )}
                        </div>
                      </FormControl>
                      <FormDescription>Upload gambar barang yang akan dilelang</FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <Button type="submit" disabled={isSubmitting} className="w-full">
                  {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  {isSubmitting ? "Menambahkan..." : "Tambah Barang"}
                </Button>
              </form>
            </Form>
          </CardContent>
        </Card>
      </main>
      <FooterPage />
    </div>
  )
}

