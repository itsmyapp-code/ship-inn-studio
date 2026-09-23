'use client'

import React, { useState, useEffect, useRef } from 'react'
import Link from 'next/link'

interface GalleryItem {
  slug: string
  title: string
  category: string
  description?: string
  coverImage: string
  status: string
  publishedAt?: string
}

const PRESET_CATEGORIES = [
  { id: 'Food & Drink', label: 'Food & Drink', icon: '🍽️' },
  { id: 'Interior', label: 'Interior & Bar', icon: '🪵' },
  { id: 'Exterior', label: 'Exterior & Garden', icon: '🏡' },
  { id: 'Rooms', label: 'Rooms & Cabins', icon: '🛏️' },
  { id: 'Surroundings', label: 'Surroundings & Exmoor', icon: '🌿' },
]

export default function AdminGalleryPage() {
  // Mode: single or batch
  const [uploadMode, setUploadMode] = useState<'single' | 'batch'>('single')

  // Single Upload State
  const [title, setTitle] = useState('')
  const [category, setCategory] = useState('Interior')
  const [customCategory, setCustomCategory] = useState('')
  const [description, setDescription] = useState('')
  const [file, setFile] = useState<File | null>(null)
  const [previewUrl, setPreviewUrl] = useState<string | null>(null)

  // Batch Upload State
  const [batchFiles, setBatchFiles] = useState<File[]>([])
  const [batchCategory, setBatchCategory] = useState('Interior')
  const [batchProgress, setBatchProgress] = useState<{ current: number; total: number; successCount: number } | null>(null)

  // Status & List State
  const [isUploading, setIsUploading] = useState(false)
  const [result, setResult] = useState<{ success: boolean; message?: string; imagePath?: string; error?: string } | null>(null)
  const [items, setItems] = useState<GalleryItem[]>([])
  const [isLoadingItems, setIsLoadingItems] = useState(true)
  const [selectedFilter, setSelectedFilter] = useState('All')
  const [deletingSlug, setDeletingSlug] = useState<string | null>(null)

  const singleFileInputRef = useRef<HTMLInputElement>(null)
  const batchFileInputRef = useRef<HTMLInputElement>(null)

  // Load existing gallery items
  const fetchItems = async () => {
    setIsLoadingItems(true)
    try {
      const res = await fetch('/api/upload-gallery')
      const data = await res.json()
      if (data.success && data.items) {
        setItems(data.items)
      }
    } catch (err) {
      console.error('Failed to fetch gallery items:', err)
    } finally {
      setIsLoadingItems(false)
    }
  }

  useEffect(() => {
    fetchItems()
  }, [])

  // Handle single file pick
  const handleSingleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selected = e.target.files?.[0]
    if (selected) {
      setFile(selected)
      setResult(null)
      const url = URL.createObjectURL(selected)
      setPreviewUrl(url)

      // Suggest title from filename if title is empty
      if (!title) {
        const cleanName = selected.name
          .replace(/\.[^/.]+$/, '')
          .replace(/[-_]+/g, ' ')
          .replace(/\b\w/g, c => c.toUpperCase())
        setTitle(cleanName)
      }
    }
  }

  // Handle batch file pick
  const handleBatchFilesChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const newFiles = Array.from(e.target.files)
      setBatchFiles(prev => [...prev, ...newFiles])
      setResult(null)
    }
  }

  const removeBatchFile = (index: number) => {
    setBatchFiles(prev => prev.filter((_, i) => i !== index))
  }

  const activeCategory = category === 'custom' ? (customCategory || 'Other') : category

  // Single upload handler
  const handleSingleUpload = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!file) {
      setResult({ success: false, error: 'Please choose an image file to upload.' })
      return
    }

    setIsUploading(true)
    setResult(null)

    try {
      const formData = new FormData()
      formData.append('file', file)
      formData.append('title', title || 'Gallery Image')
      formData.append('category', activeCategory)
      formData.append('description', description)
      formData.append('status', 'published')

      const res = await fetch('/api/upload-gallery', {
        method: 'POST',
        body: formData
      })

      const data = await res.json()
      if (data.success) {
        setResult({
          success: true,
          message: `Success! "${title || file.name}" was uploaded and added to the ${activeCategory} gallery.`,
          imagePath: data.imagePath
        })
        setFile(null)
        setPreviewUrl(null)
        setTitle('')
        setDescription('')
        if (singleFileInputRef.current) singleFileInputRef.current.value = ''
        fetchItems()
      } else {
        setResult({
          success: false,
          error: data.error || 'Failed to upload image. Please try again.'
        })
      }
    } catch (err) {
      setResult({
        success: false,
        error: err instanceof Error ? err.message : 'Network error during upload.'
      })
    } finally {
      setIsUploading(false)
    }
  }

  // Batch upload handler
  const handleBatchUpload = async (e: React.FormEvent) => {
    e.preventDefault()
    if (batchFiles.length === 0) {
      setResult({ success: false, error: 'Please select at least one image file.' })
      return
    }

    setIsUploading(true)
    setResult(null)
    setBatchProgress({ current: 0, total: batchFiles.length, successCount: 0 })

    let successCount = 0
    for (let i = 0; i < batchFiles.length; i++) {
      const currentFile = batchFiles[i]
      setBatchProgress({ current: i + 1, total: batchFiles.length, successCount })

      try {
        const autoTitle = currentFile.name
          .replace(/\.[^/.]+$/, '')
          .replace(/[-_]+/g, ' ')
          .replace(/\b\w/g, c => c.toUpperCase())

        const formData = new FormData()
        formData.append('file', currentFile)
        formData.append('title', autoTitle)
        formData.append('category', batchCategory)
        formData.append('description', '')
        formData.append('status', 'published')

        const res = await fetch('/api/upload-gallery', {
          method: 'POST',
          body: formData
        })
        const data = await res.json()
        if (data.success) {
          successCount++
        }
      } catch (err) {
        console.error('Batch item upload error:', err)
      }
    }

    setResult({
      success: true,
      message: `Batch complete! Successfully uploaded ${successCount} of ${batchFiles.length} images to "${batchCategory}".`
    })

    setBatchFiles([])
    if (batchFileInputRef.current) batchFileInputRef.current.value = ''
    setIsUploading(false)
    setBatchProgress(null)
    fetchItems()
  }

  // Delete image handler
  const handleDeleteItem = async (slug: string, itemTitle: string) => {
    if (!window.confirm(`Are you sure you want to delete "${itemTitle}" from the gallery?`)) {
      return
    }

    setDeletingSlug(slug)
    try {
      const res = await fetch(`/api/upload-gallery?slug=${encodeURIComponent(slug)}`, {
        method: 'DELETE'
      })
      const data = await res.json()
      if (data.success) {
        setItems(prev => prev.filter(item => item.slug !== slug))
      } else {
        alert(data.error || 'Failed to delete gallery item.')
      }
    } catch (err) {
      alert('Error deleting gallery item.')
    } finally {
      setDeletingSlug(null)
    }
  }

  // Filter existing gallery items
  const uniqueCategories = ['All', ...Array.from(new Set(items.map(i => i.category || 'Other')))]
  const filteredItems = selectedFilter === 'All'
    ? items
    : items.filter(i => (i.category || 'Other').toLowerCase() === selectedFilter.toLowerCase())

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8 pt-28">
      <div className="max-w-6xl mx-auto space-y-8">

        {/* Top Header & Cross-Navigation Bar */}
        <div className="bg-white rounded-xl shadow-xs border border-gray-200 p-6">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <div className="flex items-center space-x-2">
                <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-ship-blue-100 text-ship-blue-800">
                  Website Admin
                </span>
                <span className="text-xs text-gray-500">The Ship Inn Porlock Weir</span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 font-serif mt-1">
                Gallery Manager & Photo Uploader
              </h1>
              <p className="text-sm text-gray-600 mt-0.5">
                Upload new photos to the website gallery and synchronize them directly with Outstatic CMS
              </p>
            </div>

            {/* Quick Admin Navigation */}
            <div className="flex flex-wrap items-center gap-2">
              <Link
                href="/admin/menus"
                className="inline-flex items-center px-3.5 py-2 border border-gray-300 text-xs font-semibold rounded-lg text-gray-700 bg-white hover:bg-gray-50 shadow-xs transition-colors"
              >
                📋 Menu Manager
              </Link>
              <Link
                href="/outstatic"
                className="inline-flex items-center px-3.5 py-2 border border-gray-300 text-xs font-semibold rounded-lg text-gray-700 bg-white hover:bg-gray-50 shadow-xs transition-colors"
              >
                ⚡ Outstatic CMS
              </Link>
              <Link
                href="/gallery"
                target="_blank"
                className="inline-flex items-center px-3.5 py-2 border border-transparent text-xs font-semibold rounded-lg text-white bg-ship-blue-600 hover:bg-ship-blue-700 shadow-xs transition-colors"
              >
                👁️ View Live Gallery &rarr;
              </Link>
            </div>
          </div>
        </div>

        {/* Mode Selector Tabs */}
        <div className="flex border-b border-gray-200">
          <button
            type="button"
            onClick={() => setUploadMode('single')}
            className={`py-3 px-6 text-sm font-semibold border-b-2 transition-all ${
              uploadMode === 'single'
                ? 'border-ship-blue-600 text-ship-blue-700 bg-white rounded-t-lg border-t border-l border-r border-gray-200 -mb-px'
                : 'border-transparent text-gray-500 hover:text-gray-700'
            }`}
          >
            📸 Single Photo Upload (Detailed)
          </button>
          <button
            type="button"
            onClick={() => setUploadMode('batch')}
            className={`py-3 px-6 text-sm font-semibold border-b-2 transition-all ${
              uploadMode === 'batch'
                ? 'border-ship-blue-600 text-ship-blue-700 bg-white rounded-t-lg border-t border-l border-r border-gray-200 -mb-px'
                : 'border-transparent text-gray-500 hover:text-gray-700'
            }`}
          >
            📂 Batch Upload (Multiple Photos)
          </button>
        </div>

        {/* Single Photo Upload Form Card */}
        {uploadMode === 'single' && (
          <div className="bg-white rounded-xl shadow-md border border-gray-200 overflow-hidden">
            <div className="bg-ship-blue-900 px-6 py-4 text-white flex justify-between items-center">
              <div>
                <h2 className="text-lg font-semibold">Upload Single Gallery Photo</h2>
                <p className="text-xs text-blue-200 mt-0.5">Attach image, set category, and publish directly</p>
              </div>
            </div>

            <form onSubmit={handleSingleUpload} className="p-6 sm:p-8 space-y-6">

              {/* Category Selection */}
              <div>
                <label className="block text-sm font-semibold text-gray-800 mb-2">
                  1. Select Gallery Category <span className="text-red-500">*</span>
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2.5">
                  {PRESET_CATEGORIES.map(cat => (
                    <button
                      key={cat.id}
                      type="button"
                      onClick={() => setCategory(cat.id)}
                      className={`px-3 py-2.5 text-xs font-medium rounded-lg border text-center transition-all flex flex-col items-center justify-center gap-1 ${
                        category === cat.id
                          ? 'border-ship-blue-600 bg-ship-blue-50 text-ship-blue-900 ring-2 ring-ship-blue-500 shadow-xs'
                          : 'border-gray-200 bg-white text-gray-700 hover:border-gray-300 hover:bg-gray-50'
                      }`}
                    >
                      <span className="text-base">{cat.icon}</span>
                      <span>{cat.label}</span>
                    </button>
                  ))}
                  <button
                    type="button"
                    onClick={() => setCategory('custom')}
                    className={`px-3 py-2.5 text-xs font-medium rounded-lg border text-center transition-all flex flex-col items-center justify-center gap-1 ${
                      category === 'custom'
                        ? 'border-ship-blue-600 bg-ship-blue-50 text-ship-blue-900 ring-2 ring-ship-blue-500 shadow-xs'
                        : 'border-gray-200 bg-white text-gray-700 hover:border-gray-300 hover:bg-gray-50'
                    }`}
                  >
                    <span className="text-base">✏️</span>
                    <span>Custom</span>
                  </button>
                </div>

                {category === 'custom' && (
                  <div className="mt-3">
                    <input
                      type="text"
                      value={customCategory}
                      onChange={(e) => setCustomCategory(e.target.value)}
                      placeholder="Enter custom category name (e.g. Events, Harbour Views)"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-ship-blue-500 focus:border-ship-blue-500"
                    />
                  </div>
                )}
              </div>

              {/* Image File Picker & Live Preview */}
              <div>
                <label className="block text-sm font-semibold text-gray-800 mb-2">
                  2. Choose Image File <span className="text-red-500">*</span>
                </label>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-start">
                  {/* Drop area */}
                  <div className="flex justify-center px-6 pt-5 pb-6 border-2 border-dashed border-gray-300 rounded-xl hover:border-ship-blue-400 transition-colors bg-gray-50/50">
                    <div className="space-y-2 text-center">
                      <svg className="mx-auto h-12 w-12 text-gray-400" stroke="currentColor" fill="none" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                      <div className="flex text-sm text-gray-600 justify-center">
                        <label
                          htmlFor="single-image-upload"
                          className="relative cursor-pointer bg-white rounded-md font-semibold text-ship-blue-600 hover:text-ship-blue-500 px-3.5 py-1.5 border border-gray-200 shadow-xs"
                        >
                          <span>Browse Image</span>
                          <input
                            ref={singleFileInputRef}
                            id="single-image-upload"
                            name="single-image-upload"
                            type="file"
                            accept="image/webp,image/jpeg,image/png,image/avif,image/gif"
                            className="sr-only"
                            onChange={handleSingleFileChange}
                          />
                        </label>
                      </div>
                      <p className="text-xs text-gray-500">
                        Supports WebP, JPG, PNG, AVIF (Max 20MB)
                      </p>
                    </div>
                  </div>

                  {/* Thumbnail Preview */}
                  <div className="bg-gray-100 rounded-xl p-4 border border-gray-200 flex flex-col items-center justify-center min-h-[160px]">
                    {previewUrl ? (
                      <div className="relative w-full text-center">
                        <img
                          src={previewUrl}
                          alt="Preview"
                          className="max-h-48 mx-auto rounded-lg shadow-xs object-contain"
                        />
                        <p className="text-xs font-medium text-gray-600 mt-2">
                          {file?.name} ({(file ? file.size / (1024 * 1024) : 0).toFixed(2)} MB)
                        </p>
                      </div>
                    ) : (
                      <div className="text-center text-gray-400">
                        <p className="text-sm">Image preview will appear here</p>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Title & Caption */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-semibold text-gray-800 mb-1">
                    3. Photo Title / Alt Text <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="e.g. Roaring Fireplace in the Bar Area"
                    required
                    className="w-full px-3.5 py-2 border border-gray-300 rounded-lg shadow-xs focus:ring-ship-blue-500 focus:border-ship-blue-500 text-sm"
                  />
                  <span className="text-xs text-gray-500 mt-1 block">Used for the photo caption and accessibility / Google SEO</span>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-800 mb-1">
                    4. Description / Caption (Optional)
                  </label>
                  <input
                    type="text"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="e.g. Cozy seating with wood burning fire on chilly days"
                    className="w-full px-3.5 py-2 border border-gray-300 rounded-lg shadow-xs focus:ring-ship-blue-500 focus:border-ship-blue-500 text-sm"
                  />
                  <span className="text-xs text-gray-500 mt-1 block">Shown inside the lightbox popup when a visitor clicks the photo</span>
                </div>
              </div>

              {/* Feedback Alert */}
              {result && (
                <div className={`p-4 rounded-xl text-sm ${result.success ? 'bg-emerald-50 text-emerald-800 border border-emerald-200' : 'bg-red-50 text-red-800 border border-red-200'}`}>
                  <p className="font-semibold">{result.message || result.error}</p>
                  {result.imagePath && (
                    <div className="mt-2 flex items-center space-x-3">
                      <a
                        href={result.imagePath}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-xs font-semibold text-emerald-700 underline hover:text-emerald-900"
                      >
                        &rarr; View Uploaded Image File
                      </a>
                    </div>
                  )}
                </div>
              )}

              {/* Submit Button */}
              <div className="flex justify-end pt-4 border-t border-gray-100">
                <button
                  type="submit"
                  disabled={isUploading || !file}
                  className={`inline-flex items-center px-6 py-3 border border-transparent text-sm font-semibold rounded-lg text-white shadow-xs ${
                    isUploading || !file
                      ? 'bg-gray-400 cursor-not-allowed'
                      : 'bg-ship-blue-600 hover:bg-ship-blue-700 focus:outline-hidden focus:ring-2 focus:ring-offset-2 focus:ring-ship-blue-500'
                  }`}
                >
                  {isUploading ? (
                    <>
                      <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                      </svg>
                      Uploading & Syncing Outstatic...
                    </>
                  ) : (
                    'Upload & Publish Image'
                  )}
                </button>
              </div>

            </form>
          </div>
        )}

        {/* Batch Photo Upload Form Card */}
        {uploadMode === 'batch' && (
          <div className="bg-white rounded-xl shadow-md border border-gray-200 overflow-hidden">
            <div className="bg-ship-blue-900 px-6 py-4 text-white">
              <h2 className="text-lg font-semibold">Batch Upload Multiple Photos</h2>
              <p className="text-xs text-blue-200 mt-0.5">Select multiple images at once to add them to a single category</p>
            </div>

            <form onSubmit={handleBatchUpload} className="p-6 sm:p-8 space-y-6">
              
              {/* Category */}
              <div>
                <label className="block text-sm font-semibold text-gray-800 mb-2">
                  Category for All Selected Photos
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-5 gap-2.5">
                  {PRESET_CATEGORIES.map(cat => (
                    <button
                      key={cat.id}
                      type="button"
                      onClick={() => setBatchCategory(cat.id)}
                      className={`px-3 py-2.5 text-xs font-medium rounded-lg border text-center transition-all flex flex-col items-center justify-center gap-1 ${
                        batchCategory === cat.id
                          ? 'border-ship-blue-600 bg-ship-blue-50 text-ship-blue-900 ring-2 ring-ship-blue-500 shadow-xs'
                          : 'border-gray-200 bg-white text-gray-700 hover:border-gray-300 hover:bg-gray-50'
                      }`}
                    >
                      <span className="text-base">{cat.icon}</span>
                      <span>{cat.label}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Multi-file picker */}
              <div>
                <label className="block text-sm font-semibold text-gray-800 mb-2">
                  Choose Multiple Images
                </label>
                <div className="flex justify-center px-6 pt-5 pb-6 border-2 border-dashed border-gray-300 rounded-xl hover:border-ship-blue-400 transition-colors bg-gray-50/50">
                  <div className="space-y-2 text-center">
                    <svg className="mx-auto h-12 w-12 text-gray-400" stroke="currentColor" fill="none" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                    <div className="flex text-sm text-gray-600 justify-center">
                      <label
                        htmlFor="batch-image-upload"
                        className="relative cursor-pointer bg-white rounded-md font-semibold text-ship-blue-600 hover:text-ship-blue-500 px-4 py-2 border border-gray-200 shadow-xs"
                      >
                        <span>Select Multiple Images</span>
                        <input
                          ref={batchFileInputRef}
                          id="batch-image-upload"
                          name="batch-image-upload"
                          type="file"
                          multiple
                          accept="image/webp,image/jpeg,image/png,image/avif"
                          className="sr-only"
                          onChange={handleBatchFilesChange}
                        />
                      </label>
                    </div>
                    <p className="text-xs text-gray-500">
                      Hold Ctrl or Shift to choose multiple photos
                    </p>
                  </div>
                </div>
              </div>

              {/* Selected Files List */}
              {batchFiles.length > 0 && (
                <div>
                  <h4 className="text-xs font-semibold text-gray-700 uppercase tracking-wider mb-2">
                    Selected Photos ({batchFiles.length})
                  </h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 max-h-60 overflow-y-auto p-1">
                    {batchFiles.map((f, index) => (
                      <div key={index} className="flex items-center justify-between p-2.5 bg-gray-50 rounded-lg border border-gray-200 text-xs">
                        <div className="truncate mr-2">
                          <p className="font-medium text-gray-800 truncate">{f.name}</p>
                          <p className="text-gray-500">{(f.size / (1024 * 1024)).toFixed(2)} MB</p>
                        </div>
                        <button
                          type="button"
                          onClick={() => removeBatchFile(index)}
                          className="text-red-500 hover:text-red-700 font-semibold p-1"
                        >
                          ✕
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Batch progress */}
              {batchProgress && (
                <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                  <div className="flex justify-between text-xs font-semibold text-blue-900 mb-1">
                    <span>Uploading photo {batchProgress.current} of {batchProgress.total}...</span>
                    <span>{Math.round((batchProgress.current / batchProgress.total) * 100)}%</span>
                  </div>
                  <div className="w-full bg-blue-200 rounded-full h-2">
                    <div
                      className="bg-ship-blue-600 h-2 rounded-full transition-all duration-300"
                      style={{ width: `${(batchProgress.current / batchProgress.total) * 100}%` }}
                    ></div>
                  </div>
                </div>
              )}

              {/* Result alert */}
              {result && (
                <div className={`p-4 rounded-xl text-sm ${result.success ? 'bg-emerald-50 text-emerald-800 border border-emerald-200' : 'bg-red-50 text-red-800 border border-red-200'}`}>
                  <p className="font-semibold">{result.message || result.error}</p>
                </div>
              )}

              {/* Submit */}
              <div className="flex justify-end pt-4 border-t border-gray-100">
                <button
                  type="submit"
                  disabled={isUploading || batchFiles.length === 0}
                  className={`inline-flex items-center px-6 py-3 border border-transparent text-sm font-semibold rounded-lg text-white shadow-xs ${
                    isUploading || batchFiles.length === 0
                      ? 'bg-gray-400 cursor-not-allowed'
                      : 'bg-ship-blue-600 hover:bg-ship-blue-700 focus:outline-hidden'
                  }`}
                >
                  {isUploading ? 'Uploading Batch...' : `Upload ${batchFiles.length} Photos`}
                </button>
              </div>

            </form>
          </div>
        )}

        {/* Existing Gallery Images Manager & Browser */}
        <div className="bg-white rounded-xl shadow-xs border border-gray-200 p-6 sm:p-8">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between pb-6 border-b border-gray-200 gap-4">
            <div>
              <h2 className="text-xl font-bold text-gray-900 font-serif">Current Gallery Photos ({items.length})</h2>
              <p className="text-xs text-gray-500 mt-0.5">Manage live photos, delete, or jump to Outstatic CMS</p>
            </div>
            <button
              type="button"
              onClick={fetchItems}
              disabled={isLoadingItems}
              className="inline-flex items-center px-3 py-1.5 border border-gray-300 text-xs font-medium rounded-lg text-gray-700 bg-white hover:bg-gray-50 shadow-xs"
            >
              🔄 Refresh List
            </button>
          </div>

          {/* Filter tabs */}
          <div className="flex flex-wrap gap-2 pt-6 pb-4">
            {uniqueCategories.map(cat => (
              <button
                key={cat}
                type="button"
                onClick={() => setSelectedFilter(cat)}
                className={`px-3 py-1.5 rounded-full text-xs font-semibold transition-colors ${
                  selectedFilter.toLowerCase() === cat.toLowerCase()
                    ? 'bg-ship-blue-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {cat} ({cat === 'All' ? items.length : items.filter(i => (i.category || 'Other').toLowerCase() === cat.toLowerCase()).length})
              </button>
            ))}
          </div>

          {/* Items Grid */}
          {isLoadingItems ? (
            <div className="py-12 text-center text-gray-500">
              <svg className="animate-spin h-8 w-8 text-ship-blue-600 mx-auto mb-2" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
              </svg>
              Loading gallery collection...
            </div>
          ) : filteredItems.length === 0 ? (
            <div className="py-12 text-center text-gray-400">
              No photos found in this category.
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mt-4">
              {filteredItems.map(item => (
                <div key={item.slug} className="group bg-gray-50 border border-gray-200 rounded-xl overflow-hidden flex flex-col shadow-xs hover:shadow-md transition-shadow">
                  <div className="relative h-44 bg-gray-200 overflow-hidden">
                    {item.coverImage ? (
                      <img
                        src={item.coverImage.replace(/^\/+/, '/')}
                        alt={item.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        loading="lazy"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-gray-400 text-xs">
                        No image source
                      </div>
                    )}
                    <div className="absolute top-2 left-2">
                      <span className="bg-black/60 backdrop-blur-xs text-white text-[10px] font-semibold px-2 py-0.5 rounded-md">
                        {item.category}
                      </span>
                    </div>
                  </div>

                  <div className="p-3.5 flex-1 flex flex-col justify-between">
                    <div>
                      <h4 className="font-semibold text-gray-900 text-xs line-clamp-1" title={item.title}>
                        {item.title}
                      </h4>
                      {item.description && (
                        <p className="text-[11px] text-gray-500 line-clamp-2 mt-1">
                          {item.description}
                        </p>
                      )}
                    </div>

                    <div className="flex items-center justify-between pt-3 mt-3 border-t border-gray-200 text-xs">
                      <Link
                        href={`/outstatic/gallery/${item.slug}`}
                        className="text-ship-blue-600 hover:text-ship-blue-800 font-medium text-[11px]"
                      >
                        ✏️ Edit in Outstatic
                      </Link>
                      <button
                        type="button"
                        onClick={() => handleDeleteItem(item.slug, item.title)}
                        disabled={deletingSlug === item.slug}
                        className="text-red-500 hover:text-red-700 font-medium text-[11px]"
                      >
                        {deletingSlug === item.slug ? 'Deleting...' : '🗑️ Delete'}
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

        </div>

      </div>
    </div>
  )
}
