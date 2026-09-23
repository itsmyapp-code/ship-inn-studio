'use client'

import React from 'react'
import { trackPhoneCall, trackEmailClick, trackDirectionsClick } from '@/lib/analytics'

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
