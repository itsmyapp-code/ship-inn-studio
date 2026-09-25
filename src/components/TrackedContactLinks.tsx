'use client'

import React from 'react'
import Link from 'next/link'
import {
  trackPhoneCall,
  trackEmailClick,
  trackDirectionsClick,
  trackFeatureClick,
  trackMenuClick,
  trackHeroCta,
  trackPromoClick,
  trackArticleClick,
} from '@/lib/analytics'

interface TrackedPhoneLinkProps extends React.AnchorHTMLAttributes<HTMLAnchorElement> {
  phone: string
  location: string
  children?: React.ReactNode
}

export function TrackedPhoneLink({
  phone,
  location,
  children,
  className,
  ...props
}: TrackedPhoneLinkProps) {
  const cleanPhone = phone.replace(/\s+/g, '')

  const handleClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    trackPhoneCall(location, phone)
    if (props.onClick) {
      props.onClick(e)
    }
  }

  return (
    <a
      href={`tel:${cleanPhone}`}
      className={className}
      onClick={handleClick}
      {...props}
    >
      {children || phone}
    </a>
  )
}

interface TrackedEmailLinkProps extends React.AnchorHTMLAttributes<HTMLAnchorElement> {
  email: string
  location: string
  children?: React.ReactNode
}

export function TrackedEmailLink({
  email,
  location,
  children,
  className,
  ...props
}: TrackedEmailLinkProps) {
  const handleClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    trackEmailClick(location, email)
    if (props.onClick) {
      props.onClick(e)
    }
  }

  return (
    <a
      href={`mailto:${email}`}
      className={className}
      onClick={handleClick}
      {...props}
    >
      {children || email}
    </a>
  )
}

interface TrackedDirectionsLinkProps extends React.AnchorHTMLAttributes<HTMLAnchorElement> {
  location?: string
  destinationUrl?: string
  children?: React.ReactNode
}

export function TrackedDirectionsLink({
  location = 'contact_page',
  destinationUrl = 'https://www.google.com/maps/dir/?api=1&destination=The+Ship+Inn+Porlock+Weir+TA24+8PB',
  children,
  className,
  ...props
}: TrackedDirectionsLinkProps) {
  const handleClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    trackDirectionsClick(location)
    if (props.onClick) {
      props.onClick(e)
    }
  }

  return (
    <a
      href={destinationUrl}
      target="_blank"
      rel="noopener noreferrer"
      className={className}
      onClick={handleClick}
      {...props}
    >
      {children}
    </a>
  )
}

interface TrackedFeatureCardProps {
  href: string
  featureKey: string
  title: string
  description: string
  buttonText: string
  icon: React.ReactNode
  iconGradient: string
  className?: string
}

export function TrackedFeatureCard({
  href,
  featureKey,
  title,
  description,
  buttonText,
  icon,
  iconGradient,
  className = '',
}: TrackedFeatureCardProps) {
  const handleClick = () => {
    trackFeatureClick(featureKey, href)
  }

  return (
    <Link
      href={href}
      onClick={handleClick}
      className={`group relative flex flex-col justify-between items-center text-center p-8 rounded-3xl bg-white border border-gray-100 hover:border-ship-blue-300 shadow-md hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 ${className}`}
    >
      <div className="w-full flex flex-col items-center">
        <div className={`w-20 h-20 rounded-2xl flex items-center justify-center mb-6 shadow-lg ${iconGradient} group-hover:scale-110 group-hover:rotate-2 transition-all duration-300`}>
          {icon}
        </div>
        <h3 className="text-2xl font-bold text-gray-900 mb-3 group-hover:text-ship-blue-600 transition-colors">
          {title}
        </h3>
        <p className="text-gray-600 text-base sm:text-lg mb-8 leading-relaxed">
          {description}
        </p>
      </div>

      <div className="inline-flex items-center gap-2 bg-slate-100 group-hover:bg-gradient-to-r group-hover:from-ship-blue-600 group-hover:to-blue-800 text-slate-800 group-hover:text-white font-sans font-bold text-sm sm:text-base px-6 py-3 rounded-full shadow-xs group-hover:shadow-lg transition-all duration-300">
        <span>{buttonText}</span>
        <svg className="w-4 h-4 transform group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M14 5l7 7m0 0l-7 7m7-7H3" />
        </svg>
      </div>
    </Link>
  )
}

interface TrackedMenuLinkProps extends React.AnchorHTMLAttributes<HTMLAnchorElement> {
  menuTitle: string
  menuUrl: string
  children: React.ReactNode
}

export function TrackedMenuLink({
  menuTitle,
  menuUrl,
  children,
  className,
  ...props
}: TrackedMenuLinkProps) {
  const handleClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    trackMenuClick(menuTitle, menuUrl)
    if (props.onClick) props.onClick(e)
  }

  return (
    <a
      href={menuUrl}
      target="_blank"
      rel="noopener noreferrer"
      className={className}
      onClick={handleClick}
      {...props}
    >
      {children}
    </a>
  )
}

interface TrackedHeroButtonProps extends React.AnchorHTMLAttributes<HTMLAnchorElement> {
  buttonName: string
  href: string
  children: React.ReactNode
}

export function TrackedHeroButton({
  buttonName,
  href,
  children,
  className,
  ...props
}: TrackedHeroButtonProps) {
  const handleClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    trackHeroCta(buttonName, href)
    if (props.onClick) props.onClick(e)
  }

  return (
    <Link href={href} className={className} onClick={handleClick} {...props}>
      {children}
    </Link>
  )
}

interface TrackedPromoLinkProps extends React.AnchorHTMLAttributes<HTMLAnchorElement> {
  promoName: string
  href: string
  children: React.ReactNode
}

export function TrackedPromoLink({
  promoName,
  href,
  children,
  className,
  ...props
}: TrackedPromoLinkProps) {
  const handleClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    trackPromoClick(promoName, href)
    if (props.onClick) props.onClick(e)
  }

  return (
    <a href={href} className={className} onClick={handleClick} {...props}>
      {children}
    </a>
  )
}

interface TrackedArticleLinkProps extends React.AnchorHTMLAttributes<HTMLAnchorElement> {
  type: 'event' | 'news'
  title: string
  slug: string
  href: string
  children: React.ReactNode
}

export function TrackedArticleLink({
  type,
  title,
  slug,
  href,
  children,
  className,
  ...props
}: TrackedArticleLinkProps) {
  const handleClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    trackArticleClick(type, title, slug)
    if (props.onClick) props.onClick(e)
  }

  return (
    <Link href={href} className={className} onClick={handleClick} {...props}>
      {children}
    </Link>
  )
}


