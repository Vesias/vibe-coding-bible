import React from 'react'
import Link from 'next/link'

export default function HomePage() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-slate-900 via-blue-900 to-indigo-900">
      <div className="container mx-auto px-4 py-16">
        <div className="text-center">
          <div className="text-6xl mb-8">📜</div>
          <h1 className="text-4xl font-bold text-white mb-6 sm:text-6xl lg:text-7xl">
            Die Vibe Coding Bibel
          </h1>
          <p className="text-xl text-blue-200 mb-8 max-w-3xl mx-auto">
            Master AI-Assisted Development with the 10 Sacred Commandments
          </p>
          <div className="flex gap-4 justify-center">
            <Link href="/workshops" className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors">
              Begin Sacred Journey
            </Link>
            <Link href="/dashboard" className="border border-blue-400 text-blue-400 px-6 py-3 rounded-lg hover:bg-blue-400 hover:text-white transition-colors">
              Dashboard
            </Link>
          </div>
        </div>
      </div>
    </main>
  )
}