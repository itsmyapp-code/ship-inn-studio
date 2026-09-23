'use client'

import React, { useState } from 'react'
import Link from 'next/link'

interface MenuOption {
  slug: string
  title: string
  defaultOrder: number
  currentPdf?: string
  currentSubtitle?: string
}

const PRESET_MENUS: MenuOption[] = [
  { slug: 'breakfast-menu', title: 'Breakfast Menu', defaultOrder: 1, currentPdf: '/menus/Breakfast Menu - Sept 2026.pdf', currentSubtitle: 'Sept 2026' },
  { slug: 'lunch-menu', title: 'Lunch Menu', defaultOrder: 2, currentPdf: '/menus/Lunch Menu - Sept 2026.pdf', currentSubtitle: 'Sept 2026' },
  { slug: 'evening-menu', title: 'Evening Menu', defaultOrder: 3, currentPdf: '/menus/Evening Menu - Sept 2026.pdf', currentSubtitle: 'Sept 2026' },
  { slug: 'sunday-lunch-menu', title: 'Sunday Lunch Menu', defaultOrder: 4, currentPdf: '/menus/Sunday Lunch Menu - Sept 2026.pdf', currentSubtitle: 'Sept 2026' },
]

export default function AdminMenusPage() {
  const [selectedMenuSlug, setSelectedMenuSlug] = useState('lunch-menu')
  const [customTitle, setCustomTitle] = useState('')
  const [subtitle, setSubtitle] = useState('Sept 2026')
  const [order, setOrder] = useState(2)
  const [file, setFile] = useState<File | null>(null)
  const [isUploading, setIsUploading] = useState(false)
  const [result, setResult] = useState<{ success: boolean; message?: string; pdfPath?: string; error?: string } | null>(null)

  const handleMenuSelect = (slug: string) => {
    setSelectedMenuSlug(slug)
    setResult(null)
    const preset = PRESET_MENUS.find(m => m.slug === slug)
    if (preset) {
      setCustomTitle(preset.title)
      setOrder(preset.defaultOrder)
      setSubtitle(preset.currentSubtitle || 'Sept 2026')
    } else {
      setCustomTitle('')
      setOrder(5)
      setSubtitle('')
    }
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selected = e.target.files?.[0]
    if (selected) {
      if (!selected.name.toLowerCase().endsWith('.pdf')) {
        setResult({ success: false, error: 'Only .pdf files are accepted. Please select a valid PDF document.' })
        setFile(null)
        return
      }
      setFile(selected)
      setResult(null)
    }
  }

  const handleUpload = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!file) {
      setResult({ success: false, error: 'Please choose a .pdf file to upload.' })
      return
    }

    setIsUploading(true)
    setResult(null)

    try {
      const activeTitle = selectedMenuSlug === 'custom' ? (customTitle || 'Special Menu') : (PRESET_MENUS.find(m => m.slug === selectedMenuSlug)?.title || customTitle)
      const activeSlug = selectedMenuSlug === 'custom' 
        ? (customTitle.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '') || 'special-menu')
        : selectedMenuSlug

      const formData = new FormData()
      formData.append('file', file)
      formData.append('slug', activeSlug)
      formData.append('title', activeTitle)
      formData.append('subtitle', subtitle)
      formData.append('order', order.toString())

      const res = await fetch('/api/upload-menu', {
        method: 'POST',
        body: formData
      })

      const data = await res.json()
      if (data.success) {
        setResult({
          success: true,
          message: `Success! "${activeTitle}" has been updated with "${file.name}".`,
          pdfPath: data.pdfPath
        })
        setFile(null)
      } else {
        setResult({
          success: false,
          error: data.error || 'Failed to upload menu. Please try again.'
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

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8 pt-28">
      <div className="max-w-4xl mx-auto">
        
        {/* Header Navigation */}
        <div className="flex items-center justify-between pb-6 border-b border-gray-200 mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 font-serif">Menu Manager & PDF Uploader</h1>
            <p className="text-sm text-gray-600 mt-1">Upload and update downloadable PDF menus for The Ship Inn website</p>
          </div>
          <div className="flex space-x-3">
            <Link
              href="/outstatic"
              className="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 shadow-sm"
            >
              &larr; Outstatic CMS
            </Link>
            <Link
              href="/food-drink"
              target="_blank"
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-ship-blue-600 hover:bg-ship-blue-700 shadow-sm"
            >
              View Food & Drink Page &rarr;
            </Link>
          </div>
        </div>

        {/* Upload Form Card */}
        <div className="bg-white rounded-xl shadow-md border border-gray-200 overflow-hidden mb-10">
          <div className="bg-ship-blue-900 px-6 py-4 text-white">
            <h2 className="text-xl font-semibold">Upload New Menu PDF</h2>
            <p className="text-xs text-blue-200 mt-0.5">Select the menu, attach your PDF file, and save directly to Outstatic</p>
          </div>

          <form onSubmit={handleUpload} className="p-6 sm:p-8 space-y-6">
            
            {/* Format Notice */}
            <div className="bg-amber-50 border-l-4 border-amber-400 p-4 rounded-r-md">
              <div className="flex items-start">
                <div className="flex-shrink-0">
                  <svg className="h-5 w-5 text-amber-500" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                  </svg>
                </div>
                <div className="ml-3">
                  <p className="text-sm font-semibold text-amber-800">
                    File Requirement: Only .pdf files are accepted
                  </p>
                  <p className="text-xs text-amber-700 mt-0.5">
                    Word documents (.docx) or images (.jpg, .png) must be saved as PDF before uploading.
                  </p>
                </div>
              </div>
            </div>

            {/* Menu Picker */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Select Menu to Update
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {PRESET_MENUS.map(menu => (
                  <button
                    key={menu.slug}
                    type="button"
                    onClick={() => handleMenuSelect(menu.slug)}
                    className={`px-4 py-3 text-sm font-medium rounded-lg border text-center transition-all ${
                      selectedMenuSlug === menu.slug
                        ? 'border-ship-blue-600 bg-ship-blue-50 text-ship-blue-800 ring-2 ring-ship-blue-500'
                        : 'border-gray-200 bg-white text-gray-700 hover:border-gray-300 hover:bg-gray-50'
                    }`}
                  >
                    {menu.title}
                  </button>
                ))}
              </div>
            </div>

            {/* Subtitle / Season */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Season / Subtitle
                </label>
                <input
                  type="text"
                  value={subtitle}
                  onChange={(e) => setSubtitle(e.target.value)}
                  placeholder="e.g. Sept 2026 or Autumn 2026"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-ship-blue-500 focus:border-ship-blue-500 text-sm"
                />
                <span className="text-xs text-gray-500 mt-1 block">Displays beneath the menu title (e.g. &quot;Sept 2026 • PDF Menu&quot;)</span>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Display Order
                </label>
                <input
                  type="number"
                  value={order}
                  onChange={(e) => setOrder(Number(e.target.value))}
                  min={1}
                  max={20}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-ship-blue-500 focus:border-ship-blue-500 text-sm"
                />
                <span className="text-xs text-gray-500 mt-1 block">1 = First (Breakfast), 2 = Second (Lunch), etc.</span>
              </div>
            </div>

            {/* PDF File Picker */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Choose Menu PDF File
              </label>
              <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-dashed border-gray-300 rounded-lg hover:border-ship-blue-400 transition-colors bg-gray-50/50">
                <div className="space-y-2 text-center">
                  <svg className="mx-auto h-12 w-12 text-gray-400" stroke="currentColor" fill="none" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 13h6m-3-3v6m5 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                  <div className="flex text-sm text-gray-600 justify-center">
                    <label
                      htmlFor="menu-pdf-upload"
                      className="relative cursor-pointer bg-white rounded-md font-semibold text-ship-blue-600 hover:text-ship-blue-500 px-3 py-1.5 border border-gray-200 shadow-xs"
                    >
                      <span>Browse PDF file</span>
                      <input
                        id="menu-pdf-upload"
                        name="menu-pdf-upload"
                        type="file"
                        accept=".pdf,application/pdf"
                        className="sr-only"
                        onChange={handleFileChange}
                      />
                    </label>
                  </div>
                  <p className="text-xs text-gray-500">
                    {file ? (
                      <span className="font-semibold text-emerald-600">Selected: {file.name} ({(file.size / 1024).toFixed(1)} KB)</span>
                    ) : (
                      'PDF files up to 25MB'
                    )}
                  </p>
                </div>
              </div>
            </div>

            {/* Results / Feedback */}
            {result && (
              <div className={`p-4 rounded-lg text-sm ${result.success ? 'bg-emerald-50 text-emerald-800 border border-emerald-200' : 'bg-red-50 text-red-800 border border-red-200'}`}>
                {result.success ? (
                  <div>
                    <p className="font-semibold">{result.message}</p>
                    {result.pdfPath && (
                      <div className="mt-2 flex items-center space-x-3">
                        <a
                          href={result.pdfPath}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center text-xs font-semibold text-emerald-700 underline hover:text-emerald-900"
                        >
                          &rarr; Test Download Uploaded PDF
                        </a>
                      </div>
                    )}
                  </div>
                ) : (
                  <p className="font-semibold">{result.error}</p>
                )}
              </div>
            )}

            {/* Submit Button */}
            <div className="flex justify-end pt-4 border-t border-gray-100">
              <button
                type="submit"
                disabled={isUploading || !file}
                className={`inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-lg text-white shadow-sm ${
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
                    Uploading & Updating...
                  </>
                ) : (
                  'Upload & Publish Menu'
                )}
              </button>
            </div>

          </form>
        </div>

        {/* Quick Instructions & Outstatic Sync */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-bold text-gray-900 mb-3">How this works with Outstatic</h3>
          <ul className="list-disc pl-5 space-y-2 text-sm text-gray-600">
            <li>When you upload a PDF here, it automatically updates the menu document in <strong>Outstatic CMS</strong>.</li>
            <li>You can also visit <Link href="/outstatic" className="text-ship-blue-600 underline font-medium">Outstatic &rarr; Menus</Link> at any time to toggle published/draft status, edit notes, or reorder items.</li>
            <li>Changes are deployed live to the website in approximately 1–2 minutes.</li>
          </ul>
        </div>

      </div>
    </div>
  )
}
