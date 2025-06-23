'use client'

import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  Crown, 
  BookOpen, 
  Users, 
  Sparkles, 
  Menu, 
  X,
  Home,
  Layout,
  Scroll,
  Zap
} from 'lucide-react'
import { Button } from '../ui/button'
import { Badge } from '../ui/badge'

interface NavigationItem {
  name: string
  href: string
  icon: React.ElementType
  description?: string
  badge?: string
}

const navigationItems: NavigationItem[] = [
  {
    name: 'Sacred Home',
    href: '/',
    icon: Home,
    description: 'Return to the divine realm'
  },
  {
    name: 'Sacred Workshops',
    href: '/workshops',
    icon: BookOpen,
    description: 'Master the 10 commandments',
    badge: '10'
  },
  {
    name: 'Prophet Dashboard',
    href: '/dashboard',
    icon: Layout,
    description: 'Track your divine progress'
  },
  {
    name: 'Prophets Community',
    href: '/community',
    icon: Users,
    description: 'Connect with fellow seekers'
  },
  {
    name: 'Collaboration',
    href: '/collaboration',
    icon: Sparkles,
    description: 'Mystical pair programming'
  }
]

export const DivineNavigation: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const pathname = usePathname()

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20)
    }

    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const isActive = (href: string) => pathname === href

  return (
    <>
      {/* Main Navigation */}
      <motion.nav
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
          scrolled 
            ? 'divine-gradient backdrop-blur-md border-b border-sacred-gold/20 sacred-glow' 
            : 'bg-transparent'
        }`}
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 md:h-20">
            {/* Sacred Logo */}
            <Link href="/" className="flex items-center space-x-3 group">
              <motion.div
                whileHover={{ rotate: 360, scale: 1.1 }}
                transition={{ duration: 0.8 }}
                className="text-3xl filter drop-shadow-lg"
              >
                📜
              </motion.div>
              <div className="hidden sm:block">
                <div className="sacred-text font-sacred text-xl font-bold">
                  Vibe Coding
                </div>
                <div className="text-xs divine-text">
                  Sacred Bible
                </div>
              </div>
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center space-x-1">
              {navigationItems.map((item) => (
                <motion.div
                  key={item.href}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Link
                    href={item.href}
                    className={`
                      relative px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300 group
                      ${isActive(item.href)
                        ? 'sacred-text sacred-glow'
                        : 'text-divine-white/80 hover:text-divine-white hover:bg-divine-white/10'
                      }
                    `}
                  >
                    <div className="flex items-center space-x-2">
                      <item.icon className="w-4 h-4" />
                      <span>{item.name}</span>
                      {item.badge && (
                        <Badge className="ml-1 sacred-gradient text-xs px-1.5 py-0.5">
                          {item.badge}
                        </Badge>
                      )}
                    </div>
                    
                    {/* Active indicator */}
                    {isActive(item.href) && (
                      <motion.div
                        className="absolute bottom-0 left-0 right-0 h-0.5 sacred-gradient"
                        layoutId="activeTab"
                        initial={false}
                        transition={{ type: "spring", stiffness: 500, damping: 30 }}
                      />
                    )}
                  </Link>
                </motion.div>
              ))}
            </div>

            {/* Sacred CTA */}
            <div className="hidden md:flex items-center space-x-4">
              <Button 
                variant="outline" 
                size="sm"
                className="border-sacred-purple-light/50 text-sacred-purple-light hover:bg-sacred-purple-light hover:text-divine-midnight transition-all duration-300"
              >
                <Crown className="w-4 h-4 mr-2" />
                Ascend
              </Button>
            </div>

            {/* Mobile menu button */}
            <motion.button
              whileTap={{ scale: 0.95 }}
              onClick={() => setIsOpen(!isOpen)}
              className="md:hidden p-2 text-divine-white hover:text-sacred-gold-light transition-colors"
            >
              {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </motion.button>
          </div>
        </div>
      </motion.nav>

      {/* Mobile Navigation Overlay */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-40 md:hidden"
          >
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 divine-gradient backdrop-blur-md"
              onClick={() => setIsOpen(false)}
            />

            {/* Menu Content */}
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ delay: 0.1 }}
              className="relative mt-16 mx-4"
            >
              <div className="sacred-card p-6">
                <div className="space-y-4">
                  {navigationItems.map((item, index) => (
                    <motion.div
                      key={item.href}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 }}
                    >
                      <Link
                        href={item.href}
                        onClick={() => setIsOpen(false)}
                        className={`
                          flex items-center space-x-3 p-3 rounded-lg transition-all duration-300
                          ${isActive(item.href)
                            ? 'sacred-gradient text-divine-midnight'
                            : 'text-divine-white hover:bg-divine-white/10'
                          }
                        `}
                      >
                        <item.icon className="w-5 h-5" />
                        <div className="flex-1">
                          <div className="font-medium">{item.name}</div>
                          {item.description && (
                            <div className="text-xs opacity-70">{item.description}</div>
                          )}
                        </div>
                        {item.badge && (
                          <Badge className="sacred-gradient text-xs">
                            {item.badge}
                          </Badge>
                        )}
                      </Link>
                    </motion.div>
                  ))}
                </div>

                {/* Mobile CTA */}
                <div className="mt-6 pt-6 border-t border-sacred-gold/20">
                  <Button 
                    className="w-full sacred-gradient text-divine-midnight font-semibold"
                    onClick={() => setIsOpen(false)}
                  >
                    <Crown className="w-4 h-4 mr-2" />
                    Begin Your Ascension
                  </Button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Sacred Floating Action */}
      <motion.div
        className="fixed bottom-8 right-8 z-40"
        initial={{ scale: 0, rotate: -180 }}
        animate={{ scale: 1, rotate: 0 }}
        transition={{ delay: 1, type: "spring", stiffness: 260, damping: 20 }}
      >
        <Link href="/workshops">
          <motion.div
            whileHover={{ scale: 1.1, rotate: 5 }}
            whileTap={{ scale: 0.9 }}
            className="sacred-card w-14 h-14 flex items-center justify-center cursor-pointer sacred-glow"
          >
            <Scroll className="w-6 h-6 sacred-text" />
          </motion.div>
        </Link>
      </motion.div>
    </>
  )
}

export default DivineNavigation