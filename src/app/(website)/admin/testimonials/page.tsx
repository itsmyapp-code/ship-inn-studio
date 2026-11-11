'use client'

import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import { Testimonial } from '@/lib/testimonials'

export default function AdminTestimonialsPage() {
  const [items, setItems] = useState<Testimonial[]>([])
  const [stats, setStats] = useState({
    total: 0,
    published: 0,
    pending: 0,
    archived: 0,
    averageRating: 5.0
  })
  const [activeTab, setActiveTab] = useState<'all' | 'pending' | 'published' | 'archived'>('pending')
  const [isLoading, setIsLoading] = useState(true)
  const [actionMessage, setActionMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null)

  // Passcode Authentication state
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false)
  const [isCheckingAuth, setIsCheckingAuth] = useState<boolean>(true)
  const [passcode, setPasscode] = useState('')
  const [authError, setAuthError] = useState<string | null>(null)
  const [isLoggingIn, setIsLoggingIn] = useState(false)

  // GitHub Token Configuration Modal
  const [isTokenModalOpen, setIsTokenModalOpen] = useState(false)
  const [tokenInput, setTokenInput] = useState('')
  const [isSavingToken, setIsSavingToken] = useState(false)
  const [tokenConfigured, setTokenConfigured] = useState<boolean>(false)

  // Add/Edit Review Modal state
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingItem, setEditingItem] = useState<Testimonial | null>(null)
  const [formName, setFormName] = useState('')
  const [formLocation, setFormLocation] = useState('')
  const [formRating, setFormRating] = useState(5)
  const [formStayDate, setFormStayDate] = useState('')
  const [formTitle, setFormTitle] = useState('')
  const [formContent, setFormContent] = useState('')
  const [formSource, setFormSource] = useState<'google' | 'tripadvisor' | 'direct_submission' | 'in_person'>('google')
  const [formStatus, setFormStatus] = useState<'published' | 'pending' | 'archived' | 'draft'>('published')
  const [formStayType, setFormStayType] = useState<string>('Stay')
  const [formPhotos, setFormPhotos] = useState<string[]>([])
  const [formVerified, setFormVerified] = useState(true)
  const [expandedAdminReviews, setExpandedAdminReviews] = useState<Record<string, boolean>>({})
  const [isSaving, setIsSaving] = useState(false)

  // Deleting state
  const [deletingId, setDeletingId] = useState<string | null>(null)

  // Check auth session on mount
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const res = await fetch('/api/admin-auth')
        const data = await res.json()
        setIsAuthenticated(Boolean(data.authenticated))
      } catch {
        setIsAuthenticated(false)
      } finally {
        setIsCheckingAuth(false)
      }
    }

    const checkToken = async () => {
      try {
        const res = await fetch('/api/admin-token')
        const data = await res.json()
        setTokenConfigured(Boolean(data.configured))
      } catch {
        setTokenConfigured(false)
      }
    }

    checkAuth()
    checkToken()
  }, [])

  const fetchItems = async () => {
    setIsLoading(true)
    try {
      const res = await fetch(`/api/testimonials?status=${activeTab}`)
      const data = await res.json()
      if (data.success) {
        setItems(data.items || [])
        if (data.stats) {
          setStats(data.stats)
        }
      }
    } catch (err) {
      console.error('Failed to load testimonials:', err)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    if (isAuthenticated) {
      fetchItems()
    }
  }, [activeTab, isAuthenticated])

  const handlePasscodeSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoggingIn(true)
    setAuthError(null)

    try {
      const res = await fetch('/api/admin-auth', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ passcode })
      })
      const data = await res.json()
      if (data.success) {
        setIsAuthenticated(true)
      } else {
        setAuthError(data.error || 'Incorrect passcode.')
      }
    } catch {
      setAuthError('Connection error. Please try again.')
    } finally {
      setIsLoggingIn(false)
    }
  }

  const handleLogout = async () => {
    await fetch('/api/admin-auth', { method: 'DELETE' })
    setIsAuthenticated(false)
  }

  const handleSaveToken = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSavingToken(true)
    try {
      const res = await fetch('/api/admin-token', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token: tokenInput })
      })
      const data = await res.json()
      if (data.success) {
        setTokenConfigured(true)
        setIsTokenModalOpen(false)
        setTokenInput('')
        setActionMessage({ type: 'success', text: data.message })
      } else {
        alert(data.error || 'Failed to save token.')
      }
    } catch (err) {
      alert('Error connecting token.')
    } finally {
      setIsSavingToken(false)
    }
  }

  const openAddModal = () => {
    setEditingItem(null)
    setFormName('')
    setFormLocation('')
    setFormRating(5)
    setFormStayDate('')
    setFormTitle('')
    setFormContent('')
    setFormStayType('Stay')
    setFormPhotos([])
    setFormSource('google')
    setFormStatus('published')
    setFormVerified(true)
    setIsModalOpen(true)
  }

  const openEditModal = (item: Testimonial) => {
    setEditingItem(item)
    setFormName(item.name || '')
    setFormLocation(item.location || '')
    setFormRating(item.rating || 5)
    setFormStayDate(item.stayOrVisitDate || item.visitDate || '')
    setFormTitle(item.title || '')
    setFormContent(item.reviewText || item.content || '')
    setFormStayType(item.stayType || 'Stay')
    setFormPhotos(item.photos ? [...item.photos] : [])
    setFormSource(item.source || 'direct_submission')
    setFormStatus(item.status || 'published')
    setFormVerified(Boolean(item.verifiedStay || item.verified))
    setIsModalOpen(true)
  }

  const handleSaveModal = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSaving(true)
    setActionMessage(null)

    try {
      if (editingItem) {
        const res = await fetch('/api/testimonials', {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            id: editingItem.id,
            name: formName,
            location: formLocation,
            rating: formRating,
            stayOrVisitDate: formStayDate,
            stayType: formStayType,
            title: formTitle,
            content: formContent,
            reviewText: formContent,
            status: formStatus,
            verifiedStay: formVerified,
            photos: formPhotos
          })
        })
        const data = await res.json()
        if (data.success) {
          setActionMessage({ type: 'success', text: `Review from "${formName}" updated successfully!` })
          setIsModalOpen(false)
          fetchItems()
        } else {
          throw new Error(data.error || 'Failed to update review.')
        }
      } else {
        const res = await fetch('/api/testimonials', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            name: formName,
            location: formLocation,
            rating: formRating,
            stayOrVisitDate: formStayDate,
            stayType: formStayType,
            title: formTitle,
            content: formContent,
            photos: formPhotos,
            source: formSource,
            status: formStatus,
            verifiedStay: formVerified
          })
        })
        const data = await res.json()
        if (data.success) {
          setActionMessage({
            type: 'success',
            text: `Review from "${formName}" has been added and saved live!`
          })
          setIsModalOpen(false)
          fetchItems()
        } else {
          throw new Error(data.error || 'Failed to add review.')
        }
      }
    } catch (err) {
      setActionMessage({ type: 'error', text: err instanceof Error ? err.message : 'Error saving review' })
    } finally {
      setIsSaving(false)
    }
  }

  const handleApprove = async (id: string, name: string) => {
    try {
      const res = await fetch('/api/testimonials', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, status: 'published' })
      })
      const data = await res.json()
      if (data.success) {
        setActionMessage({ type: 'success', text: `Review from "${name}" approved & published live!` })
        fetchItems()
      } else {
        throw new Error(data.error)
      }
    } catch (err) {
      setActionMessage({ type: 'error', text: err instanceof Error ? err.message : 'Failed to approve review' })
    }
  }

  const handleArchive = async (id: string, name: string) => {
    try {
      const res = await fetch('/api/testimonials', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, status: 'archived' })
      })
      const data = await res.json()
      if (data.success) {
        setActionMessage({ type: 'success', text: `Review from "${name}" archived.` })
        fetchItems()
      } else {
        throw new Error(data.error)
      }
    } catch (err) {
      setActionMessage({ type: 'error', text: err instanceof Error ? err.message : 'Failed to archive review' })
    }
  }

  const handleDelete = async (id: string, name: string) => {
    if (!confirm(`Are you sure you want to permanently delete the review from "${name}"?`)) {
      return
    }

    setDeletingId(id)
    try {
      const res = await fetch(`/api/testimonials?id=${id}`, { method: 'DELETE' })
      const data = await res.json()
      if (data.success) {
        setActionMessage({ type: 'success', text: `Review from "${name}" deleted.` })
        fetchItems()
      } else {
        throw new Error(data.error)
      }
    } catch (err) {
      setActionMessage({ type: 'error', text: err instanceof Error ? err.message : 'Failed to delete review' })
    } finally {
      setDeletingId(null)
    }
  }

  // 1. Passcode Screen if not logged in
  if (isCheckingAuth) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center">
        <p className="text-white text-sm">Checking admin session...</p>
      </div>
    )
  }

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center p-4">
        <div className="bg-white rounded-3xl p-8 max-w-md w-full shadow-2xl border border-slate-800 text-center">
          <div className="w-16 h-16 bg-amber-100 text-amber-700 rounded-2xl flex items-center justify-center text-3xl mx-auto mb-4">
            ⚓
          </div>
          <h2 className="text-2xl font-serif font-bold text-slate-900">The Ship Inn</h2>
          <p className="text-xs uppercase tracking-widest font-bold text-amber-700 mt-1">Admin Portal • Testimonials</p>
          <p className="text-slate-600 text-sm mt-3 mb-6">
            Please enter the pub admin passcode to manage reviews and guest testimonials.
          </p>

          <form onSubmit={handlePasscodeSubmit} className="space-y-4">
            <input
              type="password"
              value={passcode}
              onChange={(e) => setPasscode(e.target.value)}
              placeholder="Enter admin passcode"
              className="w-full px-4 py-3 border border-slate-300 rounded-xl text-center text-lg tracking-wider focus:outline-none focus:ring-2 focus:ring-amber-500"
              autoFocus
            />
            {authError && <p className="text-red-600 text-xs font-semibold">{authError}</p>}
            <button
              type="submit"
              disabled={isLoggingIn}
              className="w-full py-3 bg-slate-900 hover:bg-slate-800 text-white font-bold rounded-xl transition shadow text-sm"
            >
              {isLoggingIn ? 'Checking...' : 'Unlock Admin Portal →'}
            </button>
          </form>

          <div className="mt-6 pt-4 border-t border-slate-100 text-xs text-slate-400">
            Passcode: <code className="bg-slate-100 px-2 py-0.5 rounded text-slate-600 font-mono">theshipinnta248pb!</code>
          </div>
        </div>
      </div>
    )
  }

  // 2. Full Admin Dashboard
  return (
    <div className="min-h-screen bg-slate-50 font-sans">
      {/* Top Navigation Bar */}
      <div className="bg-slate-900 text-white border-b border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center space-x-3">
            <span className="text-amber-400 font-bold text-xl">⚓</span>
            <div>
              <span className="font-serif font-bold text-base text-white tracking-wide block">
                The Ship Inn Admin
              </span>
              <span className="text-xs text-amber-300 font-semibold">Testimonials &amp; Review Manager</span>
            </div>
          </div>
          <div className="flex flex-wrap items-center gap-2 text-xs">
            <Link
              href="/admin/menus"
              className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 transition"
            >
              PDF Menus
            </Link>
            <Link
              href="/admin/gallery"
              className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 transition"
            >
              Photo Gallery
            </Link>
            <span className="px-3 py-1.5 rounded-lg bg-amber-500 text-slate-950 font-bold shadow">
              Testimonials
            </span>
            <Link
              href="/outstatic"
              className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 transition"
            >
              Outstatic CMS
            </Link>
            <button
              onClick={() => setIsTokenModalOpen(true)}
              className={`px-3 py-1.5 rounded-lg font-semibold transition flex items-center gap-1.5 ${
                tokenConfigured
                  ? 'bg-emerald-950 text-emerald-300 border border-emerald-700 hover:bg-emerald-900'
                  : 'bg-amber-950 text-amber-300 border border-amber-700 hover:bg-amber-900'
              }`}
            >
              <span className={`w-2 h-2 rounded-full ${tokenConfigured ? 'bg-emerald-400' : 'bg-amber-400 animate-pulse'}`}></span>
              <span>{tokenConfigured ? 'GitHub Live Sync Active' : 'Setup GitHub Sync'}</span>
            </button>
            <Link
              href="/"
              target="_blank"
              className="px-3 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-500 text-white font-semibold transition"
            >
              View Site ↗
            </Link>
            <button
              onClick={handleLogout}
              className="px-2.5 py-1.5 rounded-lg bg-slate-800 hover:bg-red-950 text-slate-400 hover:text-red-300 transition"
              title="Lock Admin Portal"
            >
              🔒 Lock
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Page Title & Add Button */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-serif font-bold text-slate-900">Guest Reviews &amp; Testimonials</h1>
            <p className="text-slate-600 text-sm mt-1">
              Approve customer-submitted reviews, add Google/TripAdvisor reviews manually, or manage live testimonials.
            </p>
          </div>
          <button
            onClick={openAddModal}
            className="bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-sm px-6 py-3 rounded-2xl shadow-sm hover:shadow transition inline-flex items-center justify-center gap-2 shrink-0 cursor-pointer"
          >
            <span className="text-lg leading-none">+</span>
            <span>Add Review Manually</span>
          </button>
        </div>

        {/* Action Message Alert */}
        {actionMessage && (
          <div
            className={`p-4 rounded-2xl text-sm mb-6 flex items-center justify-between shadow-sm ${
              actionMessage.type === 'success'
                ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                : 'bg-red-50 text-red-800 border border-red-200'
            }`}
          >
            <span>{actionMessage.text}</span>
            <button
              onClick={() => setActionMessage(null)}
              className="text-xs font-bold uppercase tracking-wider underline ml-4 cursor-pointer"
            >
              Dismiss
            </button>
          </div>
        )}

        {/* Stats Dashboard */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block mb-1">
              Total Reviews
            </span>
            <span className="text-3xl font-serif font-bold text-slate-900">{stats.total}</span>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
            <span className="text-xs font-bold text-amber-600 uppercase tracking-wider block mb-1">
              Pending Approval
            </span>
            <span className="text-3xl font-serif font-bold text-amber-600">{stats.pending}</span>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
            <span className="text-xs font-bold text-emerald-600 uppercase tracking-wider block mb-1">
              Published Live
            </span>
            <span className="text-3xl font-serif font-bold text-emerald-600">{stats.published}</span>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block mb-1">
              Average Rating
            </span>
            <div className="flex items-baseline gap-1">
              <span className="text-3xl font-serif font-bold text-slate-900">{stats.averageRating}</span>
              <span className="text-amber-500 text-lg">★</span>
            </div>
          </div>
        </div>

        {/* Tab Filters */}
        <div className="flex items-center space-x-2 border-b border-slate-200 mb-6 overflow-x-auto pb-2">
          {(['pending', 'published', 'archived', 'all'] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-wider transition whitespace-nowrap cursor-pointer ${
                activeTab === tab
                  ? 'bg-slate-900 text-white shadow-sm'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              {tab === 'pending'
                ? `Pending Approval (${stats.pending})`
                : tab === 'published'
                ? `Published Live (${stats.published})`
                : tab === 'archived'
                ? `Archived (${stats.archived})`
                : `All Reviews (${stats.total})`}
            </button>
          ))}
        </div>

        {/* Review List */}
        {isLoading ? (
          <div className="text-center py-16 bg-white rounded-2xl border border-slate-200 shadow-sm">
            <p className="text-slate-500 text-sm">Loading reviews...</p>
          </div>
        ) : items.length === 0 ? (
          <div className="text-center py-16 bg-white rounded-2xl border border-slate-200 shadow-sm p-8">
            <div className="text-4xl mb-3">📜</div>
            <h3 className="text-lg font-serif font-bold text-slate-800">No {activeTab} reviews found</h3>
            <p className="text-slate-500 text-sm mt-1 max-w-md mx-auto">
              {activeTab === 'pending'
                ? 'There are currently no guest submissions waiting for approval.'
                : 'Click "+ Add Review Manually" above to transcribe reviews from Google, TripAdvisor, or your guestbook.'}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {items.map((item) => (
              <div
                key={item.id}
                className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm flex flex-col justify-between hover:border-slate-300 transition"
              >
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <span
                      className={`text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full ${
                        item.status === 'published'
                          ? 'bg-emerald-100 text-emerald-800'
                          : item.status === 'pending'
                          ? 'bg-amber-100 text-amber-900'
                          : 'bg-slate-100 text-slate-700'
                      }`}
                    >
                      {item.status}
                    </span>
                    {item.stayType && (
                      <span className="text-[10px] font-bold uppercase tracking-wider bg-slate-100 text-slate-700 px-2 py-0.5 rounded-full border border-slate-200">
                        {item.stayType}
                      </span>
                    )}
                    <span className="text-[10px] text-slate-400 font-medium">
                      via {item.source?.replace('_', ' ') || 'direct'}
                    </span>
                  </div>

                  <div className="flex items-center text-amber-400 mb-2">
                    {[1, 2, 3, 4, 5].map((s) => (
                      <span key={s} className="text-base">
                        {s <= item.rating ? '★' : '☆'}
                      </span>
                    ))}
                  </div>

                  {item.title && (
                    <h4 className="font-serif font-bold text-slate-900 text-base mb-1">
                      &ldquo;{item.title}&rdquo;
                    </h4>
                  )}
                  <div className="mb-4">
                    <p
                      className={`text-slate-600 text-xs sm:text-sm leading-relaxed ${
                        expandedAdminReviews[item.id] ? 'whitespace-pre-line' : 'line-clamp-4'
                      }`}
                    >
                      {item.content || item.reviewText}
                    </p>
                    {((item.content || item.reviewText || '').length > 180) && (
                      <button
                        type="button"
                        onClick={() =>
                          setExpandedAdminReviews((prev) => ({
                            ...prev,
                            [item.id]: !prev[item.id]
                          }))
                        }
                        className="text-[11px] font-bold text-amber-800 hover:text-amber-900 mt-1 cursor-pointer transition inline-flex items-center gap-1"
                      >
                        {expandedAdminReviews[item.id] ? 'Show less ↑' : 'Read full text ↓'}
                      </button>
                    )}
                  </div>

                  {/* Attached Photos in Admin Card */}
                  {item.photos && item.photos.length > 0 && (
                    <div className="flex items-center gap-2 mb-4 pb-2 border-b border-slate-100">
                      {item.photos.map((photo, pIdx) => (
                        <a
                          key={pIdx}
                          href={photo}
                          target="_blank"
                          rel="noreferrer"
                          className="relative w-16 h-12 rounded-lg overflow-hidden border border-slate-200 block group"
                        >
                          <img
                            src={photo}
                            alt="Attached guest photo"
                            className="w-full h-full object-cover group-hover:scale-105 transition"
                          />
                        </a>
                      ))}
                      <span className="text-[11px] text-slate-400">
                        {item.photos.length} photo{item.photos.length > 1 ? 's' : ''} attached
                      </span>
                    </div>
                  )}
                </div>

                <div className="pt-4 border-t border-slate-100">
                  <div className="text-xs text-slate-700 font-bold mb-3">
                    {item.name}
                    {item.location && <span className="font-normal text-slate-400"> • {item.location}</span>}
                    {item.stayOrVisitDate && (
                      <span className="font-normal text-slate-400"> ({item.stayOrVisitDate})</span>
                    )}
                  </div>

                  {/* Actions */}
                  <div className="flex items-center justify-between gap-2 text-xs">
                    <div className="flex items-center gap-1.5">
                      {item.status !== 'published' && (
                        <button
                          onClick={() => handleApprove(item.id, item.name)}
                          className="px-2.5 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-lg transition cursor-pointer"
                        >
                          Approve
                        </button>
                      )}
                      {item.status === 'published' && (
                        <button
                          onClick={() => handleArchive(item.id, item.name)}
                          className="px-2.5 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold rounded-lg transition cursor-pointer"
                        >
                          Archive
                        </button>
                      )}
                      <button
                        onClick={() => openEditModal(item)}
                        className="px-2.5 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold rounded-lg transition cursor-pointer"
                      >
                        Edit
                      </button>
                    </div>

                    <button
                      onClick={() => handleDelete(item.id, item.name)}
                      disabled={deletingId === item.id}
                      className="px-2 py-1.5 text-red-600 hover:text-red-800 hover:bg-red-50 rounded-lg transition cursor-pointer font-medium"
                    >
                      {deletingId === item.id ? 'Deleting...' : 'Delete'}
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* GitHub Token Modal for Master Setup */}
      {isTokenModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-lg w-full shadow-2xl">
            <h3 className="text-xl font-serif font-bold text-slate-900">Configure GitHub Live Sync</h3>
            <p className="text-slate-600 text-xs sm:text-sm mt-1 mb-4">
              Connect your GitHub Personal Access Token once so that all review updates and approvals commit straight to the website repository without relying on Vercel settings.
            </p>

            <form onSubmit={handleSaveToken} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  GitHub Personal Access Token (starts with ghp_)
                </label>
                <input
                  type="password"
                  value={tokenInput}
                  onChange={(e) => setTokenInput(e.target.value)}
                  placeholder="ghp_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx"
                  className="w-full px-3.5 py-2.5 border border-slate-300 rounded-xl text-sm font-mono focus:outline-none focus:ring-2 focus:ring-amber-500"
                  required
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setIsTokenModalOpen(false)}
                  className="px-4 py-2 border border-slate-300 rounded-xl text-xs font-semibold text-slate-700 hover:bg-slate-50 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSavingToken}
                  className="px-5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl shadow cursor-pointer"
                >
                  {isSavingToken ? 'Testing & Connecting...' : 'Connect & Save'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Add / Edit Review Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto font-sans">
          <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-xl w-full shadow-2xl my-8 font-sans">
            <h3 className="text-2xl font-serif font-bold text-slate-900 mb-1">
              {editingItem ? 'Edit Review' : 'Add Review Manually'}
            </h3>
            <p className="text-slate-500 text-xs mb-6">
              Transcribe reviews directly from Google, TripAdvisor, or guestbooks.
            </p>

            <form onSubmit={handleSaveModal} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Guest Name *</label>
                  <input
                    type="text"
                    required
                    value={formName}
                    onChange={(e) => setFormName(e.target.value)}
                    placeholder="e.g. John &amp; Mary Smith"
                    className="w-full px-3.5 py-2 border border-slate-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-amber-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Location (Optional)</label>
                  <input
                    type="text"
                    value={formLocation}
                    onChange={(e) => setFormLocation(e.target.value)}
                    placeholder="e.g. Bristol, London, Local"
                    className="w-full px-3.5 py-2 border border-slate-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-amber-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Star Rating</label>
                  <select
                    value={formRating}
                    onChange={(e) => setFormRating(Number(e.target.value))}
                    className="w-full px-3.5 py-2 border border-slate-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-amber-500 bg-white"
                  >
                    <option value={5}>5 Stars ★★★★★</option>
                    <option value={4}>4 Stars ★★★★☆</option>
                    <option value={3}>3 Stars ★★★☆☆</option>
                    <option value={2}>2 Stars ★★☆☆☆</option>
                    <option value={1}>1 Star ★☆☆☆☆</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Category</label>
                  <select
                    value={formStayType}
                    onChange={(e) => setFormStayType(e.target.value)}
                    className="w-full px-3.5 py-2 border border-slate-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-amber-500 bg-white"
                  >
                    <option value="Stay">Cabins / Stay</option>
                    <option value="Dine">Galley Dining</option>
                    <option value="Drink & Fire">Pub & Fireside</option>
                    <option value="Walking / Dog Break">Dog / Walking</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Source</label>
                  <select
                    value={formSource}
                    onChange={(e) => setFormSource(e.target.value as any)}
                    className="w-full px-3.5 py-2 border border-slate-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-amber-500 bg-white"
                  >
                    <option value="google">Google Review</option>
                    <option value="tripadvisor">TripAdvisor</option>
                    <option value="in_person">In Person / Guestbook</option>
                    <option value="direct_submission">Direct Submission</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Status</label>
                  <select
                    value={formStatus}
                    onChange={(e) => setFormStatus(e.target.value as any)}
                    className="w-full px-3.5 py-2 border border-slate-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-amber-500 bg-white"
                  >
                    <option value="published">Published (Live)</option>
                    <option value="pending">Pending</option>
                    <option value="archived">Archived (Hidden)</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Visit / Stay Date (Optional)</label>
                <input
                  type="text"
                  value={formStayDate}
                  onChange={(e) => setFormStayDate(e.target.value)}
                  placeholder="e.g. November 2026 or Autumn 2026"
                  className="w-full px-3.5 py-2 border border-slate-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-amber-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Review Headline / Title (Optional)</label>
                <input
                  type="text"
                  value={formTitle}
                  onChange={(e) => setFormTitle(e.target.value)}
                  placeholder="e.g. Outstanding Sunday roast and cosy harbour fire"
                  className="w-full px-3.5 py-2 border border-slate-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-amber-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Review Comments *</label>
                <textarea
                  required
                  rows={6}
                  value={formContent}
                  onChange={(e) => setFormContent(e.target.value)}
                  placeholder="Paste or type guest comments..."
                  className="w-full px-3.5 py-2.5 border border-slate-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-amber-500 leading-relaxed"
                />
              </div>

              {/* Attached Photos Management with Visual Previews and Delete Option */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="block text-xs font-bold text-slate-700">
                    Attached Guest Photos ({formPhotos.length})
                  </label>
                  {formPhotos.length > 0 && (
                    <span className="text-[11px] text-slate-400">
                      Click &ldquo;✕ Remove&rdquo; to delete a photo
                    </span>
                  )}
                </div>

                {formPhotos.length === 0 ? (
                  <div className="p-3.5 bg-slate-50 border border-dashed border-slate-200 rounded-xl text-center text-xs text-slate-400">
                    No guest photos attached to this review.
                  </div>
                ) : (
                  <div className="grid grid-cols-2 gap-3">
                    {formPhotos.map((photoUrl, idx) => (
                      <div
                        key={idx}
                        className="relative bg-slate-50 rounded-xl overflow-hidden border border-slate-200 p-2 shadow-2xs"
                      >
                        <div className="relative aspect-4/3 rounded-lg overflow-hidden bg-slate-200">
                          <img
                            src={photoUrl}
                            alt={`Review photo ${idx + 1}`}
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <div className="mt-2 flex items-center justify-between">
                          <span className="text-[11px] font-mono font-semibold text-slate-600">
                            Photo {idx + 1}
                          </span>
                          <button
                            type="button"
                            onClick={() => {
                              setFormPhotos(formPhotos.filter((_, i) => i !== idx))
                            }}
                            className="inline-flex items-center gap-1 px-2.5 py-1 bg-red-50 hover:bg-red-100 text-red-700 border border-red-200 rounded-lg text-xs font-bold transition cursor-pointer"
                            title="Delete this photo from the review"
                          >
                            <span>✕</span>
                            <span>Remove</span>
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div className="flex items-center gap-2 pt-1">
                <input
                  type="checkbox"
                  id="verifiedStay"
                  checked={formVerified}
                  onChange={(e) => setFormVerified(e.target.checked)}
                  className="rounded border-slate-300 text-amber-600 focus:ring-amber-500"
                />
                <label htmlFor="verifiedStay" className="text-xs text-slate-600 font-medium">
                  Mark as &ldquo;Verified Stay / Visit&rdquo;
                </label>
              </div>

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 border border-slate-300 rounded-xl text-xs font-semibold text-slate-700 hover:bg-slate-50 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSaving}
                  className="px-6 py-2 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs rounded-xl shadow cursor-pointer"
                >
                  {isSaving ? 'Saving...' : editingItem ? 'Update Review' : 'Save & Publish'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
