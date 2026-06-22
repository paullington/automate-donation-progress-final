'use client'

import { ChevronDown, Heart, Share2 } from 'lucide-react'
import { campaign } from '@/lib/campaign'

export function Hero() {
  return (
    <section id="home" className="relative flex min-h-[100svh] items-center">
      <div className="absolute inset-0">
        <img
          src="/hero-medical.png"
          alt="A nurse compassionately holding a patient's hand in a hospital"
          className="size-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-br from-primary/85 via-primary/70 to-teal/60" />
      </div>

      <div className="relative z-10 mx-auto w-full max-w-5xl px-4 py-28 text-center sm:px-6">
        <span className="inline-flex animate-pulse-ring items-center gap-2 rounded-full bg-urgent px-4 py-2 text-xs font-bold uppercase tracking-wider text-urgent-foreground">
          <Heart className="size-4" fill="currentColor" aria-hidden="true" />
          Urgent Medical Appeal
        </span>

        <h1 className="mt-6 font-heading text-5xl font-extrabold tracking-tight text-white text-balance sm:text-7xl">
          {campaign.title}
        </h1>
        <p className="mx-auto mt-4 max-w-3xl font-heading text-xl font-semibold text-white/95 text-balance sm:text-2xl">
          {campaign.heading}
        </p>
        <p className="mx-auto mt-4 max-w-2xl text-base leading-relaxed text-white/85 text-pretty sm:text-lg">
          {campaign.supporting}
        </p>

        <div className="mt-9 flex flex-col items-center justify-center gap-3 sm:flex-row">
          <a
            href="#donate"
            className="inline-flex w-full items-center justify-center gap-2 rounded-full bg-urgent px-8 py-4 text-base font-bold text-urgent-foreground shadow-lg transition-transform hover:scale-105 sm:w-auto"
          >
            <Heart className="size-5" fill="currentColor" aria-hidden="true" />
            Donate Now
          </a>
          <a
            href="#share"
            className="inline-flex w-full items-center justify-center gap-2 rounded-full border-2 border-white/70 bg-white/10 px-8 py-4 text-base font-bold text-white backdrop-blur-sm transition-colors hover:bg-white/20 sm:w-auto"
          >
            <Share2 className="size-5" aria-hidden="true" />
            Share Appeal
          </a>
        </div>
      </div>

      <a
        href="#about"
        aria-label="Scroll to learn more"
        className="absolute bottom-8 left-1/2 z-10 -translate-x-1/2 text-white/80 transition-colors hover:text-white"
      >
        <ChevronDown className="size-8 animate-scroll-bounce" aria-hidden="true" />
      </a>
    </section>
  )
}
