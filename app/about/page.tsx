import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function AboutPage() {
  return (
    <div className="container max-w-4xl mx-auto py-16 px-4">
      <h1 className="text-4xl font-bold text-[#39FF14] mb-8">About 8KBEATZ</h1>

      <div className="space-y-8">
        <section>
          <h2 className="text-2xl font-semibold mb-4">Our Mission</h2>
          <p className="text-gray-400">
            At 8KBEATZ, we&apos;re dedicated to providing high-quality beats and samples to producers worldwide. Our platform empowers creators with professional-grade sound resources to bring their musical visions to life.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-4">What We Offer</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="p-6 bg-black/50 rounded-lg">
              <h3 className="text-xl font-semibold mb-2">Free Beats</h3>
              <p className="text-gray-400 mb-4">
                High-quality beats available for free download, perfect for your next project.
              </p>
              <Button asChild variant="outline" className="border-[#39FF14] text-[#39FF14]">
                <Link href="/free-beats">Browse Beats</Link>
              </Button>
            </div>
            <div className="p-6 bg-black/50 rounded-lg">
              <h3 className="text-xl font-semibold mb-2">Sample Packs</h3>
              <p className="text-gray-400 mb-4">
                Professional sample packs to enhance your production toolkit.
              </p>
              <Button asChild variant="outline" className="border-[#39FF14] text-[#39FF14]">
                <Link href="/free-samples">Browse Samples</Link>
              </Button>
            </div>
          </div>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-4">Contact Us at 8kbeatz81@gmail.com</h2>
          <p className="text-gray-400 mb-4">
            Have questions or feedback? We&apos;d love to hear from you.
          </p>
          <Button asChild className="bg-[#39FF14] text-black hover:bg-[#39FF14]/90">
            <Link href="/contact">Get in Touch</Link>
          </Button>
        </section>
      </div>
    </div>
  );
}
