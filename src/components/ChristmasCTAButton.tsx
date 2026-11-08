'use client'

import React from 'react'
import Link from 'next/link'
import SmartImage from '@/components/SmartImage'

interface ChristmasCTAButtonProps {
  /** Destination link when clicked (defaults to /food-drink) */
  href?: string
  /** Placement on top of the Hero Carousel */
  position?: 'top-right' | 'bottom-right' | 'center'
  /** Border pulse style */
  glowStyle?: 'gold' | 'festive'
}

/**
 * Christmas CTA Button
 * Compact circular festive medallion CTA with a bright pulsing border
 * and 12 outward-radiating golden stars, sized cleanly for both mobile (84px)
 * and desktop (112px–128px) on top of the Homepage Hero Carousel.
 */
export default function ChristmasCTAButton({
  href = '/food-drink',
  position = 'top-right',
  glowStyle = 'gold',
}: ChristmasCTAButtonProps) {
  const positionClasses =
    position === 'top-right'
      ? 'absolute z-30 top-3 right-3 sm:top-6 sm:right-8'
      : position === 'bottom-right'
      ? 'absolute z-30 bottom-12 right-3 sm:bottom-10 sm:right-8'
      : 'relative z-30 inline-block mx-auto mb-5'

  return (
    <div className={positionClasses}>
      <Link
        href={href}
        aria-label="Christmas is Coming — View Festive Menus & Book Now"
        className="group relative block rounded-full focus:outline-none"
      >
        {/* 12 Outward-Radiating Golden Stars */}
        <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
          <span className="star-particle star-1">✦</span>
          <span className="star-particle star-2">★</span>
          <span className="star-particle star-3">✦</span>
          <span className="star-particle star-4">★</span>
          <span className="star-particle star-5">✦</span>
          <span className="star-particle star-6">★</span>
          <span className="star-particle star-7">✧</span>
          <span className="star-particle star-8">✦</span>
          <span className="star-particle star-9">★</span>
          <span className="star-particle star-10">✦</span>
          <span className="star-particle star-11">✧</span>
          <span className="star-particle star-12">★</span>
        </div>

        {/* Expanding bright outer pulse ring */}
        <span
          className={`christmas-cta-ring absolute -inset-1.5 rounded-full border-2 pointer-events-none ${
            glowStyle === 'festive' ? 'border-red-400' : 'border-yellow-300'
          }`}
        />

        {/* Circular Medallion Badge (84px on mobile, 112px-128px on desktop) */}
        <div
          className={`relative w-[84px] h-[84px] sm:w-28 sm:h-28 md:w-32 md:h-32 rounded-full border-2 sm:border-[3px] border-yellow-300 overflow-hidden transition-transform duration-300 group-hover:scale-110 group-hover:rotate-3 bg-slate-950 ${
            glowStyle === 'festive' ? 'christmas-cta-pulse-festive' : 'christmas-cta-pulse-gold'
          }`}
        >
          <SmartImage
            src="/images/christmas-cta-button.webp"
            alt="The Ship Inn Porlock Weir — Christmas Is Coming! View Festive Menus & Book Now"
            className="w-full h-full object-cover rounded-full scale-[1.02]"
          />
        </div>
      </Link>

      <style jsx>{`
        @keyframes christmasPulseGold {
          0%, 100% {
            transform: scale(1);
            box-shadow:
              0 0 0 0 rgba(253, 224, 71, 0.95),
              0 0 18px 5px rgba(245, 158, 11, 0.9),
              0 0 36px 12px rgba(251, 191, 36, 0.5);
            border-color: #fde047;
          }
          50% {
            transform: scale(1.05);
            box-shadow:
              0 0 0 10px rgba(253, 224, 71, 0),
              0 0 28px 10px rgba(254, 240, 138, 1),
              0 0 52px 20px rgba(245, 158, 11, 0.8);
            border-color: #ffffff;
          }
        }

        @keyframes christmasPulseFestive {
          0%, 100% {
            transform: scale(1);
            box-shadow:
              0 0 0 0 rgba(239, 68, 68, 0.9),
              0 0 20px 6px rgba(251, 191, 36, 0.9),
              0 0 40px 14px rgba(220, 38, 38, 0.6);
            border-color: #fde047;
          }
          50% {
            transform: scale(1.05);
            box-shadow:
              0 0 0 12px rgba(239, 68, 68, 0),
              0 0 30px 12px rgba(253, 224, 71, 1),
              0 0 58px 22px rgba(239, 68, 68, 0.85);
            border-color: #fef08a;
          }
        }

        @keyframes outerRingPing {
          0% {
            transform: scale(0.95);
            opacity: 0.95;
          }
          75%, 100% {
            transform: scale(1.24);
            opacity: 0;
          }
        }

        @keyframes shootStar {
          0% {
            transform: rotate(var(--angle)) translateY(calc(var(--start-dist) * -1)) scale(0.3) rotate(0deg);
            opacity: 0;
          }
          20% {
            opacity: 1;
          }
          70% {
            opacity: 0.95;
          }
          100% {
            transform: rotate(var(--angle)) translateY(calc(var(--end-dist) * -1)) scale(1.15) rotate(90deg);
            opacity: 0;
          }
        }

        .christmas-cta-pulse-gold {
          animation: christmasPulseGold 2.1s ease-in-out infinite;
        }
        .christmas-cta-pulse-festive {
          animation: christmasPulseFestive 2.1s ease-in-out infinite;
        }
        .christmas-cta-ring {
          animation: outerRingPing 2.1s cubic-bezier(0, 0, 0.2, 1) infinite;
        }

        .star-particle {
          position: absolute;
          color: #fef08a;
          text-shadow: 0 0 8px #f59e0b, 0 0 14px #fde047, 0 0 4px #ffffff;
          font-size: 12px;
          line-height: 1;
          user-select: none;
          --start-dist: 34px;
          --end-dist: 60px;
          animation: shootStar var(--dur, 2.2s) ease-out infinite;
          animation-delay: var(--delay, 0s);
        }

        @media (min-width: 640px) {
          .star-particle {
            font-size: 15px;
            --start-dist: 48px;
            --end-dist: 82px;
          }
        }

        .star-1  { --angle: 0deg;   --dur: 2.0s; --delay: 0.0s; }
        .star-2  { --angle: 30deg;  --dur: 2.4s; --delay: 0.3s; color: #ffffff; }
        .star-3  { --angle: 60deg;  --dur: 1.9s; --delay: 0.7s; }
        .star-4  { --angle: 90deg;  --dur: 2.3s; --delay: 0.15s; color: #fcd34d; }
        .star-5  { --angle: 120deg; --dur: 2.1s; --delay: 0.55s; }
        .star-6  { --angle: 150deg; --dur: 2.5s; --delay: 0.9s; color: #ffffff; }
        .star-7  { --angle: 180deg; --dur: 2.0s; --delay: 0.25s; }
        .star-8  { --angle: 210deg; --dur: 2.2s; --delay: 0.65s; color: #fcd34d; }
        .star-9  { --angle: 240deg; --dur: 1.8s; --delay: 0.4s; }
        .star-10 { --angle: 270deg; --dur: 2.4s; --delay: 0.8s; color: #ffffff; }
        .star-11 { --angle: 300deg; --dur: 2.1s; --delay: 0.1s; }
        .star-12 { --angle: 330deg; --dur: 2.3s; --delay: 0.5s; color: #fcd34d; }
      `}</style>
    </div>
  )
}
