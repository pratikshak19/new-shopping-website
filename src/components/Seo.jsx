import { useEffect } from 'react'
import { useLocation } from 'react-router-dom'

const TITLES = {
  '/': 'Trendify | Shop the trend',
  '/shop': 'Shop | Trendify',
  '/style': 'Style Assistant | Trendify',
  '/quiz': 'Style Quiz | Trendify',
  '/festivals': 'Festival Radar | Trendify',
  '/own': 'Closet mixer | Trendify',
  '/kits': 'Lifestyle kits | Trendify',
  '/cart': 'Bag | Trendify',
  '/checkout': 'Checkout | Trendify',
  '/wishlist': 'Wishlist | Trendify',
  '/login': 'Sign in | Trendify',
  '/staff': 'Admin desk | Trendify',
  '/register': 'Create account | Trendify',
  '/orders': 'Orders | Trendify',
  '/profile': 'Profile | Trendify',
  '/offers': 'Offers | Trendify',
  '/studio': 'Studio | Trendify',
  '/insider': 'Insider | Trendify',
  '/help': 'Help | Trendify',
  '/admin': 'Admin desk | Trendify',
  '/admin/add': 'Add new item | Trendify',
  '/documents': 'Documents | Trendify',
}

export default function Seo() {
  const { pathname } = useLocation()
  useEffect(() => {
    const hit = Object.keys(TITLES).find((k) => (k === '/' ? pathname === '/' : pathname.startsWith(k)))
    document.title = TITLES[hit] || 'Trendify'
    const desc = document.querySelector('meta[name="description"]')
    if (desc) {
      desc.setAttribute(
        'content',
        'Trendify — Myntra + Meesho style shopping. Fashion, electronics, beauty. Simulated checkout for a college project.'
      )
    }
  }, [pathname])
  return null
}
