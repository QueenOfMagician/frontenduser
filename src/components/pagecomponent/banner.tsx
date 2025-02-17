import { ChevronLeft, ChevronRight } from 'lucide-react'
import { useState, useEffect } from 'react'
import { Button } from '../ui/button'

export default function Banner(){
    const banners = [
        { id: 1, image: "promo", alt: "Summer Fruits Sale" },
        { id: 2, image: "promo", alt: "Fresh Vegetables" },
        { id: 3, image: "promo", alt: "Premium Meats" },
        { id: 4, image: "promo", alt: "Seafood Festival" },
      ]
    const [currentBanner, setCurrentBanner] = useState(0)
    useEffect(() => {
        const timer = setInterval(() => {
          setCurrentBanner((prevBanner) => (prevBanner + 1) % banners.length)
        }, 10000)
        return () => clearInterval(timer)
      }, [])

    return(
        <>
        <div className="relative h-[400px] overflow-hidden bg-gradient-to-r from-purple-100 to-pink-100 dark:from-purple-900 dark:to-pink-900">
        {banners.map((banner, index) => (
          <img
            key={banner.id}
            src={banner.image}
            alt={banner.alt}
            className={`absolute top-0 left-0 w-full h-full object-cover transition-opacity duration-500 ${
              index === currentBanner ? 'opacity-100' : 'opacity-0'
            }`}
          />
        ))}
        <Button 
          variant="ghost" 
          className="absolute top-1/2 left-4 transform -translate-y-1/2 bg-white/50"
          onClick={() => setCurrentBanner((prevBanner) => (prevBanner - 1 + banners.length) % banners.length)}
        >
          <ChevronLeft className="h-6 w-6" />
        </Button>
        <Button 
          variant="ghost" 
          className="absolute top-1/2 right-4 transform -translate-y-1/2 bg-white/50"
          onClick={() => setCurrentBanner((prevBanner) => (prevBanner + 1) % banners.length)}
        >
          <ChevronRight className="h-6 w-6" />
        </Button>
      </div>
        </>
    )
}