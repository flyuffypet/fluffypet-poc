import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Search, Plus, Users, MessageCircle, Heart } from "lucide-react"
import Link from "next/link"

export function CommunityHeader() {
  return (
    <div className="bg-white border-b">
      <div className="max-w-6xl mx-auto px-4 py-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold mb-2">Pet Care Community</h1>
            <p className="text-gray-600">Connect with pet owners, professionals, and animal lovers worldwide</p>
          </div>

          <div className="flex items-center gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input placeholder="Search posts..." className="pl-10 w-64" />
            </div>
            <Button asChild>
              <Link href="/community/new-post">
                <Plus className="w-4 h-4 mr-2" />
                New Post
              </Link>
            </Button>
          </div>
        </div>

        {/* Stats */}
        <div className="flex items-center gap-6 mt-6 text-sm text-gray-600">
          <div className="flex items-center gap-1">
            <Users className="w-4 h-4" />
            <span>12.5K members</span>
          </div>
          <div className="flex items-center gap-1">
            <MessageCircle className="w-4 h-4" />
            <span>3.2K posts</span>
          </div>
          <div className="flex items-center gap-1">
            <Heart className="w-4 h-4" />
            <span>25K interactions</span>
          </div>
        </div>
      </div>
    </div>
  )
}
