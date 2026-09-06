import { useEffect } from 'react'
import { useLocation } from 'react-router-dom'

const TITLES = {
  '/': 'Trendora | Shop the trend',
  '/shop': 'Shop | Trendora',
  '/style': 'Style Assistant | Trendora',
  '/quiz': 'Style Quiz | Trendora',
  '/festivals': 'Festival Radar | Trendora',
  '/own': 'Closet mixer | Trendora',
  '/kits': 'Lifestyle kits | Trendora',
  '/cart': 'Bag | Trendora',
  '/checkout': 'Checkout | Trendora',
  '/wishlist': 'Wishlist | Trendora',
  '/login': 'Sign in | Trendora',
  '/staff': 'Admin desk | Trendora',
  '/register': 'Create account | Trendora',
  '/orders': 'Orders | Trendora',
  '/profile': 'Profile | Trendora',
  '/offers': 'Offers | Trendora',
  '/studio': 'Studio | Trendora',
  '/insider': 'Insider | Trendora',
  '/help': 'Help | Trendora',
  '/admin': 'Admin desk | Trendora',
  '/admin/add': 'Add new item | Trendora',
  '/documents': 'Documents | Trendora',
}

export default function Seo() {
  const { pathname } = useLocation()
  useEffect(() => {
    const hit = Object.keys(TITLES).find((k) => (k === '/' ? pathname === '/' : pathname.startsWith(k)))
    document.title = TITLES[hit] || 'Trendora'
    const desc = document.querySelector('meta[name="description"]')
    if (desc) {
      desc.setAttribute(
        'content',
        'Trendora — Myntra + Meesho style shopping. Fashion, electronics, beauty. Simulated checkout for a college project.'
      )
    }
  }, [pathname])
  return null
}
