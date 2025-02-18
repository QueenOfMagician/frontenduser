import type React from "react"
import type { FC } from "react"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { CheckCircle, DollarSign, ShoppingBag, Award, Edit } from "lucide-react"
import Header from "@/components/pagecomponent/header-page"
import FooterPage from "@/components/pagecomponent/footer-page"

interface ProfileData {
  name: string
  email: string
  balance: number
  auctionsParticipated: number
  auctionsWon: number
}

const ProfilePage: FC = () => {
  const [profileData] = useState<ProfileData>({
    name: "John Doe",
    email: "johndoe@example.com",
    balance: 10000,
    auctionsParticipated: 50,
    auctionsWon: 15,
  })

  const [profileImage, setProfileImage] = useState<string>("/placeholder.svg")

  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onloadend = () => {
        setProfileImage(reader.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  return (
    <>
      <Header />
      <div className="min-h-screen bg-gradient-to-b from-purple-100 to-pink-100 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-8">
            <div className="relative w-32 h-32 mx-auto mb-4 group">
              <img
                src={profileImage || "/placeholder.svg"}
                alt="Profile Picture"
                className="w-32 h-32 rounded-full border-4 border-white shadow-lg object-cover"
              />
              <div className="absolute inset-0 bg-black bg-opacity-50 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                <label htmlFor="profile-image-upload" className="cursor-pointer">
                  <Edit className="w-8 h-8 text-white" />
                </label>
                <input
                  id="profile-image-upload"
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handleImageChange}
                />
              </div>
            </div>
            <h1 className="text-3xl font-bold text-gray-900 flex items-center justify-center">
              {profileData.name}
              <Badge variant="secondary" className="ml-2">
                <CheckCircle className="w-4 h-4 mr-1" />
                Verified
              </Badge>
            </h1>
            <p className="text-gray-600 mt-1">{profileData.email}</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
            <Card>
              <CardContent className="flex items-center p-6">
                <DollarSign className="w-8 h-8 text-purple-600 mr-4" />
                <div>
                  <p className="text-sm text-gray-500">Balance</p>
                  <p className="text-2xl font-bold">${profileData.balance.toLocaleString()}</p>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="flex items-center p-6">
                <ShoppingBag className="w-8 h-8 text-purple-600 mr-4" />
                <div>
                  <p className="text-sm text-gray-500">Auctions Participated</p>
                  <p className="text-2xl font-bold">{profileData.auctionsParticipated}</p>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="flex items-center p-6">
                <Award className="w-8 h-8 text-purple-600 mr-4" />
                <div>
                  <p className="text-sm text-gray-500">Auctions Won</p>
                  <p className="text-2xl font-bold">{profileData.auctionsWon}</p>
                </div>
              </CardContent>
            </Card>
          </div>

          <Tabs defaultValue="email" className="mb-8">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="email">Edit Email</TabsTrigger>
              <TabsTrigger value="password">Edit Password</TabsTrigger>
            </TabsList>
            <TabsContent value="email">
              <Card>
                <CardContent className="pt-6">
                  <form className="space-y-4" onSubmit={(e) => e.preventDefault()}>
                    <Input type="email" placeholder="New Email" />
                    <Button type="submit">Update Email</Button>
                  </form>
                </CardContent>
              </Card>
            </TabsContent>
            <TabsContent value="password">
              <Card>
                <CardContent className="pt-6">
                  <form className="space-y-4" onSubmit={(e) => e.preventDefault()}>
                    <Input type="password" placeholder="New Password" />
                    <Input type="password" placeholder="Confirm New Password" />
                    <Button type="submit">Update Password</Button>
                  </form>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>

          <div className="text-center">
            <Button variant="destructive">Delete Account</Button>
          </div>
        </div>
      </div>
      <FooterPage />
    </>
  )
}

export default ProfilePage

