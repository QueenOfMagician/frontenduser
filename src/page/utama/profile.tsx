"use client"

import type React from "react"
import { useState } from "react"
import { Camera, Edit, LogOut, Shield, Gavel, Trophy } from "lucide-react"

interface Profile {
  id: string
  username: string
  avatar_url: string
  balance: number
  is_verified: boolean
  total_auctions: number
  won_auctions: number
}

const dummyUser = {
  email: "user@example.com",
}

const dummyProfile: Profile = {
  id: "12345",
  username: "JohnDoe",
  avatar_url: "/placeholder.svg",
  balance: 5000,
  is_verified: true,
  total_auctions: 12,
  won_auctions: 5,
}

const Profile: React.FC = () => {
  const [profile, setProfile] = useState<Profile>(dummyProfile)
  const [editing, setEditing] = useState(false)
  const [newUsername, setNewUsername] = useState("")
  const [newBalance, setNewBalance] = useState(0)
  const [newPassword, setNewPassword] = useState("")

  const handleLogout = () => {
    alert("Logout successful")
    window.location.href = "/login"
  }

  const handleProfileUpdate = () => {
    const updatedProfile = {
      ...profile,
      username: newUsername || profile.username,
      balance: profile.balance + newBalance,
    }

    setProfile(updatedProfile)
    setEditing(false)
    setNewUsername("")
    setNewBalance(0)
    alert("Profile updated successfully!")
  }

  const handleAvatarUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    const fileUrl = URL.createObjectURL(file)
    setProfile({ ...profile, avatar_url: fileUrl })
    alert("Profile picture updated!")
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Profile</h1>
      <div className="bg-white shadow-md rounded-lg p-6">
        <div className="flex items-center mb-4">
          <img src={profile.avatar_url} alt="Profile" className="w-20 h-20 rounded-full mr-4" />
          <div>
            <h2 className="text-xl font-semibold">{profile.username}</h2>
            <p className="text-gray-600">{dummyUser.email}</p>
            {profile.is_verified && (
              <span className="inline-flex items-center bg-blue-100 text-blue-800 text-xs font-medium px-2.5 py-0.5 rounded-full">
                <Shield className="w-3 h-3 mr-1" />
                Verified
              </span>
            )}
          </div>
        </div>

        <div className="mb-4">
          <h3 className="text-lg font-semibold mb-2">Auction Statistics</h3>
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-gray-100 p-3 rounded">
              <div className="flex items-center">
                <Gavel className="w-5 h-5 mr-2 text-gray-600" />
                <span className="font-medium">Total Auctions</span>
              </div>
              <p className="text-2xl font-bold">{profile.total_auctions}</p>
            </div>
            <div className="bg-gray-100 p-3 rounded">
              <div className="flex items-center">
                <Trophy className="w-5 h-5 mr-2 text-gray-600" />
                <span className="font-medium">Won Auctions</span>
              </div>
              <p className="text-2xl font-bold">{profile.won_auctions}</p>
            </div>
          </div>
        </div>

        <div className="mb-4">
          <h3 className="text-lg font-semibold mb-2">Account Balance</h3>
          <p className="text-2xl font-bold">${profile.balance.toFixed(2)}</p>
        </div>

        {editing ? (
          <div className="space-y-4">
            <div>
              <label htmlFor="newUsername" className="block text-sm font-medium text-gray-700">
                New Username
              </label>
              <input
                type="text"
                id="newUsername"
                value={newUsername}
                onChange={(e) => setNewUsername(e.target.value)}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
              />
            </div>
            <div>
              <label htmlFor="newBalance" className="block text-sm font-medium text-gray-700">
                Add Balance
              </label>
              <input
                type="number"
                id="newBalance"
                value={newBalance}
                onChange={(e) => setNewBalance(Number(e.target.value))}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
              />
            </div>
            <button
              onClick={handleProfileUpdate}
              className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded"
            >
              Save Changes
            </button>
            <button
              onClick={() => setEditing(false)}
              className="ml-2 bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-4 rounded"
            >
              Cancel
            </button>
          </div>
        ) : (
          <button
            onClick={() => setEditing(true)}
            className="bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded flex items-center"
          >
            <Edit className="w-4 h-4 mr-2" />
            Edit Profile
          </button>
        )}

        <div className="mt-4">
          <h3 className="text-lg font-semibold mb-2">Change Password</h3>
          <input
            type="password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            placeholder="New Password"
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
          />
          <button
            onClick={() => alert("Password updated!")}
            className="mt-2 bg-yellow-500 hover:bg-yellow-600 text-white font-bold py-2 px-4 rounded"
          >
            Change Password
          </button>
        </div>

        <div className="mt-4">
          <h3 className="text-lg font-semibold mb-2">Update Profile Picture</h3>
          <label className="flex items-center space-x-2 cursor-pointer">
            <Camera className="w-6 h-6 text-gray-600" />
            <span className="text-gray-600">Choose a new photo</span>
            <input type="file" accept="image/*" onChange={handleAvatarUpload} className="hidden" />
          </label>
        </div>

        <button
          onClick={handleLogout}
          className="mt-6 bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-4 rounded flex items-center"
        >
          <LogOut className="w-4 h-4 mr-2" />
          Logout
        </button>
      </div>
    </div>
  )
}

export default Profile
