import Link from "next/link";
import { Music, Package, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import AdRotator from "@/components/ads-rotator";

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen">
      <section className="flex-1 py-20 md:py-32">
        <div className="container px-4 md:px-6">
          <div className="flex flex-col items-center text-center space-y-8">
            <h1 className="text-4xl font-bold tracking-tighter sm:text-5xl md:text-6xl lg:text-7xl text-[#39FF14]">
              Elevate Your Sound
            </h1>
            <p className="max-w-[700px] text-gray-400 md:text-xl">
              Discover premium beats and sample packs to fuel your next hit.
              Unleash your creativity with 8KBEATZ.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Button
                size="lg"
                className="bg-[#39FF14] text-black hover:bg-[#39FF14]/90"
                asChild
              >
                <Link href="/free-beats">Explore Beats</Link>
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="border-[#39FF14] text-[#39FF14] hover:bg-[#39FF14]/10"
                asChild
              >
                <Link href="/free-samples">Browse Samples</Link>
              </Button>
            </div>
            <AdRotator
              position="footer"
              // interval={5000}
              className="max-w-[600px] mx-auto p-4"
            />
          </div>
        </div>
      </section>

      <section className="py-20 bg-black/50">
        <div className="container px-4 md:px-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="flex flex-col items-center text-center space-y-4">
              <Music className="h-12 w-12 text-[#39FF14]" />
              <h3 className="text-xl font-bold">Premium Beats</h3>
              <p className="text-gray-400">
                High-quality beats for your next hit song
              </p>
            </div>
            <div className="flex flex-col items-center text-center space-y-4">
              <Package className="h-12 w-12 text-[#39FF14]" />
              <h3 className="text-xl font-bold">Sample Packs</h3>
              <p className="text-gray-400">
                Professional sound kits and samples
              </p>
            </div>
            <div className="flex flex-col items-center text-center space-y-4">
              <Users className="h-12 w-12 text-[#39FF14]" />
              <h3 className="text-xl font-bold">Community</h3>
              <p className="text-gray-400">
                Join our growing producer community
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
