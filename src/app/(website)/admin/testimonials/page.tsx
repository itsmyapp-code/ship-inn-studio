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

  // Add/Edit Modal state
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingItem, setEditingItem] = useState<Testimonial | null>(null)
  const [formName, setFormName] = useState('')
  const [formLocation, setFormLocation] = useState('')
  const [formRating, setFormRating] = useState(5)
  const [formStayDate, setFormStayDate] = useState('')
  const [formTitle, setFormTitle] = useState('')
  const [formContent, setFormContent] = useState('')
  const [formSource, setFormSource] = useState<'google' | 'tripadvisor' | 'direct_submission' | 'in_person'>('google')
  const [formStatus, setFormStatus] = useState<'published' | 'pending' | 'archived'>('published')
  const [formVerified, setFormVerified] = useState(true)
  const [isSaving, setIsSaving] = useState(false)

  // Deleting state
  const [deletingId, setDeletingId] = useState<string | null>(null)
  const [authorized, setAuthorized] = useState<boolean | null>(null)

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
        if (typeof data.authorized === 'boolean') {
          setAuthorized(data.authorized)
        }
      }
    } catch (err) {
      console.error('Failed to load testimonials:', err)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchItems()
  }, [activeTab])

  const openAddModal = () => {
    setEditingItem(null)
    setFormName('')
    setFormLocation('')
    setFormRating(5)
    setFormStayDate('')
    setFormTitle('')
    setFormContent('')
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
    setFormStayDate(item.stayOrVisitDate || '')
    setFormTitle(item.title || '')
    setFormContent(item.content || '')
    setFormSource(item.source || 'direct_submission')
    setFormStatus(item.status || 'published')
    setFormVerified(Boolean(item.verifiedStay))
    setIsModalOpen(true)
  }

  const handleSaveModal = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSaving(true)
    setActionMessage(null)

    try {
      if (editingItem) {
        // PATCH
        const res = await fetch('/api/testimonials', {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            id: editingItem.id,
            name: formName,
            location: formLocation,
            rating: formRating,
            stayOrVisitDate: formStayDate,
            title: formTitle,
            content: formContent,
            source: formSource,
            status: formStatus,
            verifiedStay: formVerified
          })
        })
        const data = await res.json()
        if (!res.ok || !data.success) throw new Error(data.error || 'Failed to update review')
        setActionMessage({ type: 'success', text: `Review from "${formName}" updated successfully.` })
      } else {
        // POST
        const res = await fetch('/api/testimonials', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            name: formName,
            location: formLocation,
            rating: formRating,
            stayOrVisitDate: formStayDate,
            title: formTitle,
            content: formContent,
            source: formSource,
            status: formStatus,
            verifiedStay: formVerified
          })
        })
        const data = await res.json()
        if (!res.ok || !data.success) throw new Error(data.error || 'Failed to add review')
        setActionMessage({ type: 'success', text: `Review from "${formName}" added successfully.` })
      }

      setIsModalOpen(false)
      fetchItems()
    } catch (err) {
      setActionMessage({ type: 'error', text: err instanceof Error ? err.message : 'Error saving review' })
    } finally {
      setIsSaving(false)
    }
  }

  // Quick Action: Approve & Publish
  const handleApprove = async (id: string, name: string) => {
    try {
      const res = await fetch('/api/testimonials', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, status: 'published' })
      })
      const data = await res.json()
      if (data.success) {
        setActionMessage({ type: 'success', text: `Review from "${name}" approved & published live to the website!` })
        fetchItems()
      } else {
        throw new Error(data.error)
      }
    } catch (err) {
      setActionMessage({ type: 'error', text: err instanceof Error ? err.message : 'Failed to approve review' })
    }
  }

  // Quick Action: Unpublish / Archive
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

  // Delete Action
  const handleDelete = async (id: string, name: string) => {
    if (!confirm(`Are you sure you want to permanently delete the review from "${name}"?`)) {
      return
    }

    setDeletingId(id)
    try {
      const res = await fetch(`/api/testimonials?id=${id}`, { method: 'DELETE' })
      const data = await res.json()
      if (data.success) {
        setActionMessage({ type: 'success', text: `Review from "${name}" has been permanently deleted.` })
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

  return (
    <div className="min-h-screen bg-slate-50">
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
          <div className="flex items-center gap-2 text-xs">
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
            <Link
              href="/"
              target="_blank"
              className="px-3 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-500 text-white font-semibold transition"
            >
              View Site ↗
            </Link>
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
            className="bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-sm px-6 py-3 rounded-2xl shadow-sm hover:shadow transition inline-flex items-center justify-center gap-2 shrink-0"
          >
            <span className="text-lg leading-none">+</span>
            <span>Add Review Manually</span>
          </button>
        </div>

        {/* Authorization Banner if not signed into Outstatic / no GitHub PAT */}
        {authorized === false && (
          <div className="bg-amber-50 border-l-4 border-amber-500 p-4 rounded-r-2xl mb-6 shadow-sm">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
              <div className="flex items-start gap-3">
                <span className="text-2xl leading-none">⚠️</span>
                <div>
                  <p className="text-sm font-bold text-amber-900">Sign-in Required to Save Live Changes</p>
                  <p className="text-xs text-amber-800 mt-0.5">
                    To approve, add, or delete reviews on the live website, please sign in once to Outstatic CMS. Your session will authorize GitHub updates.
                  </p>
                </div>
              </div>
              <Link
                href="/outstatic"
                target="_blank"
                className="shrink-0 inline-flex items-center gap-1.5 px-4 py-2 bg-amber-600 hover:bg-amber-700 text-white text-xs font-bold rounded-xl shadow-xs transition"
              >
                ⚡ Sign in to Outstatic
              </Link>
            </div>
          </div>
        )}

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
              className="text-xs font-bold uppercase tracking-wider underline ml-4"
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

          <div
            onClick={() => setActiveTab('pending')}
            className={`p-5 rounded-2xl border shadow-sm cursor-pointer transition ${
              stats.pending > 0
                ? 'bg-amber-50 border-amber-300 hover:border-amber-400'
                : 'bg-white border-slate-200'
            }`}
          >
            <div className="flex items-center justify-between mb-1">
              <span className="text-xs font-bold text-amber-800 uppercase tracking-wider block">
                Pending Approval
              </span>
              {stats.pending > 0 && (
                <span className="w-2.5 h-2.5 rounded-full bg-amber-500 animate-pulse" />
              )}
            </div>
            <span className="text-3xl font-serif font-bold text-amber-900">{stats.pending}</span>
          </div>

          <div
            onClick={() => setActiveTab('published')}
            className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm cursor-pointer hover:border-slate-300 transition"
          >
            <span className="text-xs font-bold text-emerald-700 uppercase tracking-wider block mb-1">
              Published Live
            </span>
            <span className="text-3xl font-serif font-bold text-emerald-800">{stats.published}</span>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block mb-1">
              Average Rating
            </span>
            <div className="flex items-center gap-1.5">
              <span className="text-3xl font-serif font-bold text-slate-900">{stats.averageRating}</span>
              <span className="text-amber-400 text-xl">★</span>
            </div>
          </div>
        </div>

        {/* Filter Tabs */}
        <div className="flex items-center gap-2 border-b border-slate-200 pb-3 mb-6 overflow-x-auto">
          {[
            { id: 'pending', label: 'Pending Approval', count: stats.pending },
            { id: 'published', label: 'Published Live', count: stats.published },
            { id: 'archived', label: 'Archived', count: stats.archived },
            { id: 'all', label: 'All Reviews', count: stats.total }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition flex items-center gap-2 shrink-0 ${
                activeTab === tab.id
                  ? 'bg-ship-blue-600 text-white shadow-sm'
                  : 'text-slate-600 hover:bg-slate-200/60'
              }`}
            >
              <span>{tab.label}</span>
              <span
                className={`text-[11px] px-2 py-0.5 rounded-full ${
                  activeTab === tab.id ? 'bg-white/20 text-white' : 'bg-slate-200 text-slate-700'
                }`}
              >
                {tab.count}
              </span>
            </button>
          ))}
        </div>

        {/* Reviews List */}
        {isLoading ? (
          <div className="text-center py-16 bg-white rounded-2xl border border-slate-200">
            <div className="inline-block animate-spin w-8 h-8 border-4 border-ship-blue-600 border-t-transparent rounded-full mb-3" />
            <p className="text-slate-500 text-sm">Loading testimonials...</p>
          </div>
        ) : items.length === 0 ? (
          <div className="text-center py-16 bg-white rounded-2xl border border-slate-200 p-6">
            <span className="text-4xl block mb-2">📜</span>
            <h3 className="text-lg font-bold text-slate-800">No {activeTab} reviews found</h3>
            <p className="text-slate-500 text-sm max-w-md mx-auto mt-1 mb-6">
              {activeTab === 'pending'
                ? 'All customer submissions have been reviewed and published!'
                : 'Add a new review from Google, TripAdvisor, or customer feedback.'}
            </p>
            <button
              onClick={openAddModal}
              className="bg-ship-blue-600 text-white font-bold text-xs px-5 py-2.5 rounded-xl shadow transition"
            >
              Add Review Manually
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            {items.map((item) => (
              <div
                key={item.id}
                className={`bg-white rounded-2xl p-5 sm:p-6 border shadow-sm transition flex flex-col md:flex-row md:items-center justify-between gap-4 ${
                  item.status === 'pending'
                    ? 'border-amber-300 bg-amber-50/20'
                    : item.status === 'archived'
                    ? 'border-slate-200 opacity-70'
                    : 'border-slate-200 hover:border-slate-300'
                }`}
              >
                {/* Review Details */}
                <div className="space-y-2 flex-grow max-w-3xl">
                  <div className="flex flex-wrap items-center gap-2">
                    {/* Status Badge */}
                    <span
                      className={`text-[10px] font-extrabold uppercase tracking-wider px-2 py-0.5 rounded-full ${
                        item.status === 'published'
                          ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                          : item.status === 'pending'
                          ? 'bg-amber-100 text-amber-900 border border-amber-300 animate-pulse'
                          : 'bg-slate-100 text-slate-600 border border-slate-300'
                      }`}
                    >
                      {item.status.toUpperCase()}
                    </span>

                    {/* Source */}
                    <span className="text-[11px] font-semibold text-slate-500 bg-slate-100 px-2 py-0.5 rounded">
                      Source: {item.source}
                    </span>

                    {/* Verified */}
                    {item.verifiedStay && (
                      <span className="text-[10px] font-bold text-blue-700 bg-blue-50 px-2 py-0.5 rounded">
                        ✓ Verified Stay / Dine
                      </span>
                    )}

                    {/* Stars */}
                    <div className="flex items-center text-amber-400 ml-1">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <span key={star} className={star <= item.rating ? 'text-amber-400' : 'text-slate-200'}>
                          ★
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Title & Content */}
                  {item.title && (
                    <h4 className="font-serif font-bold text-slate-900 text-base sm:text-lg">
                      &ldquo;{item.title}&rdquo;
                    </h4>
                  )}
                  <p className="text-slate-700 text-sm leading-relaxed italic">
                    &ldquo;{item.content}&rdquo;
                  </p>

                  {/* Author meta */}
                  <div className="text-xs text-slate-500 flex flex-wrap items-center gap-2 pt-1">
                    <span className="font-bold text-slate-900">{item.name}</span>
                    {item.location && <span>• {item.location}</span>}
                    {item.stayOrVisitDate && <span>• Visit: {item.stayOrVisitDate}</span>}
                    <span>• Submitted: {new Date(item.createdAt).toLocaleDateString()}</span>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex items-center gap-2 shrink-0 md:self-center">
                  {item.status === 'pending' && (
                    <button
                      onClick={() => handleApprove(item.id, item.name)}
                      className="bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs px-4 py-2 rounded-xl shadow-sm transition flex items-center gap-1.5"
                    >
                      <span>✓ Approve &amp; Publish</span>
                    </button>
                  )}

                  {item.status === 'published' && (
                    <button
                      onClick={() => handleArchive(item.id, item.name)}
                      className="bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-xs px-3 py-2 rounded-xl transition"
                    >
                      Archive / Hide
                    </button>
                  )}

                  {item.status === 'archived' && (
                    <button
                      onClick={() => handleApprove(item.id, item.name)}
                      className="bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs px-3 py-2 rounded-xl transition"
                    >
                      Re-Publish
                    </button>
                  )}

                  <button
                    onClick={() => openEditModal(item)}
                    className="bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-xs px-3 py-2 rounded-xl transition"
                  >
                    Edit
                  </button>

                  <button
                    disabled={deletingId === item.id}
                    onClick={() => handleDelete(item.id, item.name)}
                    className="text-red-600 hover:bg-red-50 p-2 rounded-xl text-xs font-semibold transition"
                    title="Delete review"
                  >
                    🗑️
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Add / Edit Review Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl border border-slate-100 relative">
            <button
              onClick={() => setIsModalOpen(false)}
              className="absolute top-5 right-5 text-slate-400 hover:text-slate-700 text-xl p-1"
            >
              ✕
            </button>

            <h3 className="text-2xl font-serif font-bold text-slate-900 mb-1">
              {editingItem ? 'Edit Review' : 'Add Review Manually'}
            </h3>
            <p className="text-slate-500 text-xs mb-5">
              Copy/paste reviews from Google, TripAdvisor, guestbooks, or customer notes.
            </p>

            <form onSubmit={handleSaveModal} className="space-y-4">
              {/* Rating & Source */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                    Rating (1-5 Stars)
                  </label>
                  <select
                    value={formRating}
                    onChange={(e) => setFormRating(Number(e.target.value))}
                    className="w-full text-sm px-3 py-2 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-ship-blue-500"
                  >
                    <option value={5}>★★★★★ (5 Stars)</option>
                    <option value={4}>★★★★☆ (4 Stars)</option>
                    <option value={3}>★★★☆☆ (3 Stars)</option>
                    <option value={2}>★★☆☆☆ (2 Stars)</option>
                    <option value={1}>★☆☆☆☆ (1 Star)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                    Review Source
                  </label>
                  <select
                    value={formSource}
                    onChange={(e) => setFormSource(e.target.value as any)}
                    className="w-full text-sm px-3 py-2 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-ship-blue-500"
                  >
                    <option value="google">Google Review</option>
                    <option value="tripadvisor">TripAdvisor</option>
                    <option value="in_person">Guestbook / In Person</option>
                    <option value="direct_submission">Direct Website</option>
                  </select>
                </div>
              </div>

              {/* Name & Location */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                    Guest Name *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. John &amp; Mary"
                    value={formName}
                    onChange={(e) => setFormName(e.target.value)}
                    className="w-full text-sm px-3 py-2 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-ship-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                    Location
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Bristol, London"
                    value={formLocation}
                    onChange={(e) => setFormLocation(e.target.value)}
                    className="w-full text-sm px-3 py-2 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-ship-blue-500"
                  />
                </div>
              </div>

              {/* Visit Date & Title */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                    Visit / Stay Date
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. November 2026"
                    value={formStayDate}
                    onChange={(e) => setFormStayDate(e.target.value)}
                    className="w-full text-sm px-3 py-2 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-ship-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                    Status
                  </label>
                  <select
                    value={formStatus}
                    onChange={(e) => setFormStatus(e.target.value as any)}
                    className="w-full text-sm px-3 py-2 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-ship-blue-500"
                  >
                    <option value="published">Published (Visible on site)</option>
                    <option value="pending">Pending (Hidden)</option>
                    <option value="archived">Archived (Hidden)</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Headline (optional)
                </label>
                <input
                  type="text"
                  placeholder="e.g. Great coastal pub with wonderful views"
                  value={formTitle}
                  onChange={(e) => setFormTitle(e.target.value)}
                  className="w-full text-sm px-3 py-2 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-ship-blue-500"
                />
              </div>

              {/* Content */}
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Review Text *
                </label>
                <textarea
                  required
                  rows={4}
                  placeholder="Paste or write the review comments..."
                  value={formContent}
                  onChange={(e) => setFormContent(e.target.value)}
                  className="w-full text-sm px-3 py-2 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-ship-blue-500"
                />
              </div>

              {/* Verified stay */}
              <label className="flex items-center gap-2 cursor-pointer text-xs text-slate-600">
                <input
                  type="checkbox"
                  checked={formVerified}
                  onChange={(e) => setFormVerified(e.target.checked)}
                  className="rounded text-ship-blue-600"
                />
                <span>Verified Stay / Dine Guest</span>
              </label>

              {/* Submit */}
              <div className="pt-3 flex justify-end gap-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 rounded-xl text-slate-600 hover:bg-slate-100 text-xs font-semibold transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSaving}
                  className="bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold px-6 py-2.5 rounded-xl text-xs shadow-md transition disabled:opacity-50"
                >
                  {isSaving ? 'Saving...' : editingItem ? 'Save Changes' : 'Publish Review'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}

