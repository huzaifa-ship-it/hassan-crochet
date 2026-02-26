"use client"

import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ArrowRight } from "lucide-react"
import { cn } from "@/lib/utils"

interface BrandStoryProps {
  className?: string
}

export function BrandStory({ className }: BrandStoryProps) {
  return (
    <section className={cn("py-12 md:py-16 lg:py-24 bg-background", className)}>
      <div className="container mx-auto px-4 md:px-6">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          {/* Content Column */}
          <div className="space-y-6 order-2 lg:order-1 animate-in fade-in slide-in-from-bottom-4 duration-1000">
            {/* Badge */}
            <Badge className="w-fit bg-primary/10 text-primary hover:bg-primary/20 border-primary/20">
              Our Story
            </Badge>

            {/* Heading */}
            <div className="space-y-4">
              <h2 className="font-['Lora'] text-3xl md:text-4xl lg:text-5xl font-bold tracking-tight">
                Handcrafted with Love Since 2020
              </h2>
              <p className="text-muted-foreground text-base md:text-lg leading-relaxed">
                Since 2020, Hassan Crochet has been creating unique, customizable crochet pieces that
                bring warmth and personality to your home. Each product is lovingly handcrafted with
                attention to detail and quality materials.
              </p>
              <p className="text-muted-foreground text-base md:text-lg leading-relaxed">
                From cozy tray tables to decorative accessories, every piece tells a story of
                craftsmanship and care. We believe in creating products that become cherished
                parts of your home.
              </p>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-3 gap-4 pt-4">
              <div className="text-center p-4 rounded-xl bg-muted/30 hover:bg-muted/50 transition-colors animate-in fade-in slide-in-from-bottom-4 duration-1000 delay-100">
                <div className="text-2xl md:text-3xl font-bold text-primary">5K+</div>
                <div className="text-xs md:text-sm text-muted-foreground mt-1">Happy Customers</div>
              </div>
              <div className="text-center p-4 rounded-xl bg-muted/30 hover:bg-muted/50 transition-colors animate-in fade-in slide-in-from-bottom-4 duration-1000 delay-200">
                <div className="text-2xl md:text-3xl font-bold text-primary">50+</div>
                <div className="text-xs md:text-sm text-muted-foreground mt-1">Unique Designs</div>
              </div>
              <div className="text-center p-4 rounded-xl bg-muted/30 hover:bg-muted/50 transition-colors animate-in fade-in slide-in-from-bottom-4 duration-1000 delay-300">
                <div className="text-2xl md:text-3xl font-bold text-primary">100%</div>
                <div className="text-xs md:text-sm text-muted-foreground mt-1">Handmade</div>
              </div>
            </div>

            {/* CTA Button */}
            <div className="pt-4 animate-in fade-in slide-in-from-bottom-4 duration-1000 delay-500">
              <Button size="lg" className="group" asChild>
                <Link href="/products">
                  Explore Our Collection
                  <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                </Link>
              </Button>
            </div>
          </div>

          {/* Image Column */}
          <div className="order-1 lg:order-2 animate-in fade-in slide-in-from-right-4 duration-1000">
            <div className="relative aspect-[4/5] rounded-2xl overflow-hidden shadow-2xl">
              <Image
                src="https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&q=80"
                alt="Handmade crochet craft"
                fill
                className="object-cover"
                priority
              />
              {/* Overlay Gradient */}
              <div className="absolute inset-0 bg-gradient-to-t from-primary/20 to-transparent" />
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
