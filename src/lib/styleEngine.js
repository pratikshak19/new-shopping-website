export const MOODS = [
  { id: 'cute', label: 'Cute', emoji: '🌸' },
  { id: 'aesthetic', label: 'Aesthetic', emoji: '✨' },
  { id: 'minimal', label: 'Minimal', emoji: '🖤' },
  { id: 'party', label: 'Party', emoji: '🔥' },
  { id: 'casual', label: 'Casual', emoji: '👟' },
  { id: 'formal', label: 'Formal', emoji: '💼' },
  { id: 'traditional', label: 'Traditional', emoji: '🌿' },
]

export const SLOT_ORDER = ['top', 'bottom', 'shoes', 'bag', 'accessory']

export const SLOT_LABEL = {
  top: 'Top / Shirt',
  bottom: 'Jeans / Bottom',
  shoes: 'Shoes',
  bag: 'Bag',
  accessory: 'Accessories',
  stationery: 'Stationery',
  other: 'More',
}

const COLOR_RGB = {
  blush: [232, 176, 184],
  ivory: [240, 232, 220],
  sage: [140, 168, 148],
  rose: [200, 90, 120],
  emerald: [20, 120, 90],
  midnight: [20, 28, 48],
  lavender: [180, 160, 210],
  sand: [210, 190, 160],
  black: [28, 28, 32],
  navy: [24, 40, 80],
  charcoal: [60, 62, 70],
  olive: [90, 110, 70],
  white: [242, 242, 240],
  sky: [150, 190, 220],
  indigo: [50, 60, 130],
  stone: [170, 168, 160],
  grey: [140, 140, 144],
  gold: [198, 162, 70],
  silver: [190, 194, 200],
  tan: [176, 132, 88],
  cognac: [140, 78, 42],
  cherry: [160, 30, 50],
  nude: [220, 190, 170],
  coral: [230, 110, 100],
  peach: [240, 180, 150],
  mint: [160, 210, 180],
  brown: [110, 70, 40],
}

export function inferSlot(p) {
  const n = `${p.name} ${p.category}`.toLowerCase()
  if (/notebook|pen|stationery|sleeve/.test(n)) return 'stationery'
  if (/jean|chino|trouser|palazzo|short/.test(n)) return 'bottom'
  if (/sneaker|heel|flat|kolhapuri|runner|shoe|flip/.test(n)) return 'shoes'
  if (/tote|sling|bag/.test(n)) return 'bag'
  if (/earring|watch|sunglass|shade|clip|perfume|palette|skincare|jewellery/.test(n)) return 'accessory'
  if (/dress|kurta|saree|shirt|tee|hoodie|blazer|coord|co-ord|polo|cardigan|top/.test(n)) return 'top'
  return 'other'
}

export function inferMoods(p) {
  const n = `${p.name} ${p.description} ${(p.tags || []).join(' ')}`.toLowerCase()
  const moods = new Set()
  if (/floral|blush|pearl|pastel|cute|crop/.test(n)) moods.add('cute')
  if (/linen|cloud|amber|editorial|lookbook|aesthetic|co-ord/.test(n)) moods.add('aesthetic')
  if (/black|white|navy|minimal|oxford|selvedge|analog/.test(n)) moods.add('minimal')
  if (/festive|party|heel|saree|palette|noir|banarasi/.test(n)) moods.add('party')
  if (/tee|sneaker|casual|hoodie|campus|daily|denim|sling/.test(n)) moods.add('casual')
  if (/blazer|oxford|formal|office|block heel/.test(n)) moods.add('formal')
  if (/kurta|saree|kolhapuri|heritage|ethnic|traditional/.test(n)) moods.add('traditional')
  if (!moods.size) moods.add('casual')
  return [...moods]
}

export function inferEco(p) {
  const n = `${p.name} ${(p.highlights || []).join(' ')} ${p.description}`.toLowerCase()
  let score = 6.2
  if (/organic|handloom|handcrafted|linen|veg-tan|cotton silk/.test(n)) score += 2.1
  if (/cotton|leather|stoneware|ceramic/.test(n)) score += 0.8
  if (/fragrance free|cruelty/.test(n)) score += 0.6
  if (p.category === 'electronics') score -= 1.8
  if (/plastic|poly/.test(n)) score -= 0.8
  return Math.max(3.2, Math.min(9.6, Math.round(score * 10) / 10))
}

export function inferStudent(p) {
  if (p.price <= 1600 && ['women', 'men', 'footwear', 'accessories', 'kids', 'home'].includes(p.category)) {
    const n = p.name.toLowerCase()
    if (/campus|college|daily|notebook|pen|tote|sling|tee|kurti|polo|chino|flat|sneaker|hoodie|clip/.test(n)) return true
    if (p.price <= 899) return true
  }
  return Boolean(p.student)
}

export function isOnePiece(p) {
  return /saree|dress|co-ord|coord|kurta set|play set/i.test(p.name)
}

export function styleProduct(p) {
  return {
    ...p,
    slot: p.slot || inferSlot(p),
    moods: p.moods?.length ? p.moods : inferMoods(p),
    ecoScore: typeof p.ecoScore === 'number' ? p.ecoScore : inferEco(p),
    student: p.student ?? inferStudent(p),
  }
}

export function parseStylePrompt(text) {
  const t = String(text || '').toLowerCase()
  const money = t.match(/₹\s*([0-9][0-9,]*)/) || t.match(/rs\.?\s*([0-9][0-9,]*)/) || t.match(/under\s*([0-9][0-9,]*)/) || t.match(/([0-9][0-9,]*)\s*(rs|rupees|ke andar|budget)/)
  const budget = money ? Number(String(money[1]).replace(/,/g, '')) : 1500
  let mood = MOODS.find((m) => t.includes(m.id) || t.includes(m.label.toLowerCase()))?.id || ''
  if (!mood && /party|club|date/.test(t)) mood = 'party'
  if (!mood && /office|interview|formal/.test(t)) mood = 'formal'
  if (!mood && /festive|puja|wedding|ethnic|traditional/.test(t)) mood = 'traditional'
  if (!mood && /cute|pretty/.test(t)) mood = 'cute'
  if (!mood && /minimal|simple|plain/.test(t)) mood = 'minimal'
  if (!mood && /aesthetic|soft|pastel/.test(t)) mood = 'aesthetic'
  const gender = /men|boy|male|him/.test(t) && !/women|girl|female/.test(t) ? 'men' : /kids|child/.test(t) ? 'kids' : 'women'
  const college = /college|campus|class|university|student/.test(t)
  const eco = /eco|sustainable|green/.test(t)
  return { budget: budget || 1500, mood: mood || (college ? 'casual' : ''), gender, college, eco, raw: text }
}

function live(list) {
  return (list || []).filter((p) => p && p.status !== 'hidden')
}

function scoreItem(p, { mood, college, eco, gender }) {
  let s = (p.rating || 0) * 8 + Math.min(p.reviews || 0, 400) / 40
  if (mood && (p.moods || []).includes(mood)) s += 18
  if (college && p.student) s += 14
  if (eco) s += (p.ecoScore || 0) * 1.4
  if (gender === 'men' && p.category === 'men') s += 10
  if (gender === 'women' && p.category === 'women') s += 8
  if (gender === 'kids' && p.category === 'kids') s += 12
  if (p.price < 800) s += 4
  return s
}

export function buildLook(products, opts = {}) {
  const budget = Math.max(299, Number(opts.budget) || 1500)
  const pool = live(products).filter((p) => !['electronics'].includes(p.category) || p.slot === 'accessory')
  const ranked = (slot) =>
    pool
      .filter((p) => p.slot === slot)
      .filter((p) => (opts.gender === 'men' ? !['women', 'kids'].includes(p.category) || p.category === 'footwear' || p.category === 'accessories' : true))
      .filter((p) => (opts.gender === 'women' ? p.category !== 'men' && p.category !== 'kids' : true))
      .sort((a, b) => scoreItem(b, opts) - scoreItem(a, opts) || a.price - b.price)

  const items = []
  let spent = 0
  const skipBottom = false
  for (const slot of SLOT_ORDER) {
    if (slot === 'bottom' && items.some(isOnePiece)) continue
    if (skipBottom && slot === 'bottom') continue
    const pick = ranked(slot).find((p) => p.price + spent <= budget && !items.some((x) => x.id === p.id))
    if (pick) {
      items.push(pick)
      spent += pick.price
    }
  }
  if (!items.length) {
    const cheap = pool.filter((p) => p.price <= budget).sort((a, b) => scoreItem(b, opts) - scoreItem(a, opts))[0]
    if (cheap) {
      items.push(cheap)
      spent = cheap.price
    }
  }
  return {
    items,
    total: spent,
    leftover: Math.max(0, budget - spent),
    budget,
    title: opts.college ? 'College complete look' : opts.mood ? `${MOODS.find((m) => m.id === opts.mood)?.label || 'Styled'} look` : 'Complete look',
  }
}

export function completeTheLook(product, products, budget) {
  if (!product) return []
  const need = SLOT_ORDER.filter((s) => s !== product.slot)
  if (isOnePiece(product)) {
    return need.filter((s) => s !== 'bottom')
      .map((slot) =>
        live(products)
          .filter((p) => p.slot === slot && p.id !== product.id)
          .filter((p) => !budget || p.price <= budget)
          .sort((a, b) => scoreItem(b, { mood: product.moods?.[0] }) - scoreItem(a, { mood: product.moods?.[0] }))[0]
      )
      .filter(Boolean)
      .slice(0, 4)
  }
  return need
    .map((slot) =>
      live(products)
        .filter((p) => p.slot === slot && p.id !== product.id)
        .sort((a, b) => scoreItem(b, { mood: product.moods?.[0] }) - scoreItem(a, { mood: product.moods?.[0] }))[0]
    )
    .filter(Boolean)
    .slice(0, 4)
}

export function whyRecommend(product, ctx = {}) {
  if (!product) return []
  const why = []
  if (product.student || ctx.college || ctx.studentMode) why.push('College friendly')
  if (ctx.budget && product.price <= ctx.budget) why.push('Fits your budget')
  if (ctx.mood && (product.moods || []).includes(ctx.mood)) why.push('Matches your selected style')
  if ((product.rating || 0) >= 4.4) why.push('Strong customer ratings')
  if ((product.ecoScore || 0) >= 8) why.push('Eco-friendly pick')
  if ((product.tags || []).includes('bestseller')) why.push('Bestseller on Trendora')
  if (!why.length) why.push('Balanced pick from the catalogue')
  return why.slice(0, 4)
}

export function smartCartSuggestion(cartProducts, catalog, budget) {
  const have = new Set((cartProducts || []).map((p) => p.slot).filter(Boolean))
  const fashion = (cartProducts || []).filter((p) => ['women', 'men', 'footwear', 'accessories'].includes(p.category))
  if (!fashion.length) return null
  const missing = SLOT_ORDER.filter((s) => !have.has(s))
  if (!missing.length) return { done: true, text: 'Your look looks complete. You can checkout when ready.' }
  const spent = (cartProducts || []).reduce((s, p) => s + (p.price || 0), 0)
  const room = budget ? Math.max(0, budget - spent) : 20000
  for (const slot of missing) {
    const pick = live(catalog)
      .filter((p) => p.slot === slot && p.price <= room)
      .sort((a, b) => a.price - b.price || (b.rating || 0) - (a.rating || 0))[0]
    if (pick) {
      return {
        done: false,
        product: pick,
        text: `Your look is almost complete. Add matching ${SLOT_LABEL[slot] || slot} for ₹${pick.price.toLocaleString('en-IN')}?`,
      }
    }
  }
  return { done: false, text: 'Your look is almost ready. No matching piece fits the remaining budget.' }
}

function dist(a, b) {
  return Math.sqrt((a[0] - b[0]) ** 2 + (a[1] - b[1]) ** 2 + (a[2] - b[2]) ** 2)
}

export function nearestColorName(rgb) {
  let best = 'sand'
  let d = Infinity
  Object.entries(COLOR_RGB).forEach(([name, val]) => {
    const n = dist(rgb, val)
    if (n < d) {
      d = n
      best = name
    }
  })
  return best
}

export function averageColorFromImage(img) {
  const canvas = document.createElement('canvas')
  const w = 40
  const h = 40
  canvas.width = w
  canvas.height = h
  const ctx = canvas.getContext('2d', { willReadFrequently: true })
  ctx.drawImage(img, 0, 0, w, h)
  const data = ctx.getImageData(0, 0, w, h).data
  let r = 0
  let g = 0
  let b = 0
  let n = 0
  for (let i = 0; i < data.length; i += 4) {
    r += data[i]
    g += data[i + 1]
    b += data[i + 2]
    n += 1
  }
  return [Math.round(r / n), Math.round(g / n), Math.round(b / n)]
}

export function similarByColor(rgb, products, limit = 8) {
  const name = nearestColorName(rgb)
  return live(products)
    .map((p) => {
      const colors = (p.colors || []).join(' ').toLowerCase()
      const hit = colors.includes(name) || p.name.toLowerCase().includes(name)
      const first = (p.colors || ['sand'])[0].toLowerCase().split(/[/\s-]/)[0]
      const mapped = COLOR_RGB[first] || COLOR_RGB.sand
      return { p, hit, d: dist(rgb, mapped) }
    })
    .sort((a, b) => Number(b.hit) - Number(a.hit) || a.d - b.d)
    .map((x) => x.p)
    .slice(0, limit)
}

export function studentRail(products) {
  return live(products)
    .filter((p) => p.student || p.slot === 'stationery' || p.price <= 999)
    .sort((a, b) => a.price - b.price)
}

export const FESTIVALS = [
  { id: 'freshers', name: 'Freshers week', date: '2026-09-05', mood: 'casual', college: true, budget: 1299, blurb: 'First impression on campus.' },
  { id: 'ganesh', name: 'Ganesh Chaturthi', date: '2026-09-14', mood: 'traditional', college: false, budget: 1999, blurb: 'Ethnic, light, all-day wear.' },
  { id: 'navratri', name: 'Navratri nights', date: '2026-10-11', mood: 'party', college: false, budget: 2499, blurb: 'Dance-ready colour and ease.' },
  { id: 'diwali', name: 'Diwali', date: '2026-11-08', mood: 'traditional', college: false, budget: 2999, blurb: 'Festive without a heavy set.' },
  { id: 'christmas', name: 'Christmas party', date: '2026-12-25', mood: 'party', college: false, budget: 2499, blurb: 'Evening looks under a cap.' },
  { id: 'republic', name: 'Republic Day', date: '2027-01-26', mood: 'formal', college: true, budget: 1999, blurb: 'Smart campus / function mix.' },
  { id: 'holi', name: 'Holi', date: '2027-03-03', mood: 'casual', college: true, budget: 999, blurb: 'Cotton you can actually play in.' },
]

export function upcomingFestivals(from = new Date()) {
  const start = new Date(from)
  start.setHours(0, 0, 0, 0)
  return FESTIVALS.map((f) => {
    const d = new Date(`${f.date}T00:00:00`)
    const days = Math.ceil((d - start) / 86400000)
    return { ...f, days }
  })
    .filter((f) => f.days >= -1)
    .sort((a, b) => a.days - b.days)
}

export function completeAround(owned, products, opts = {}) {
  if (!owned) return { items: [], extras: [], total: 0, leftover: opts.budget || 0, budget: opts.budget || 1500, owned: null, title: 'Finish your closet' }
  const budget = Math.max(owned.price, Number(opts.budget) || 1500)
  const extras = completeTheLook(owned, products, Math.max(0, budget - owned.price)).filter((p) => p.id !== owned.id)
  let spent = 0
  const picked = []
  extras.forEach((p) => {
    if (spent + p.price <= budget - owned.price) {
      picked.push(p)
      spent += p.price
    }
  })
  return {
    owned,
    extras: picked,
    items: [owned, ...picked],
    total: spent,
    leftover: Math.max(0, budget - owned.price - spent),
    budget,
    title: 'Finish what you already own',
  }
}

export function crowdScore(ids = []) {
  const s = String(ids.join('|'))
  let h = 0
  for (let i = 0; i < s.length; i += 1) h = (h * 31 + s.charCodeAt(i)) % 1000
  return 68 + (h % 27)
}

export const LIFESTYLE_KITS = [
  {
    id: 'campus',
    name: 'Campus starter kit',
    blurb: 'Outfit + bag + notes + daily kicks. Not a clothing-only cart.',
    budget: 2499,
    rules: [
      { slot: 'top', max: 700 },
      { slot: 'bag', max: 500 },
      { slot: 'stationery', max: 300 },
      { slot: 'shoes', max: 600 },
    ],
  },
  {
    id: 'tech',
    name: 'Study / commute tech',
    blurb: 'Earbuds, a speaker or watch — gadgets with a campus budget.',
    budget: 7999,
    rules: [
      { category: 'electronics', max: 4000 },
      { category: 'electronics', max: 2500 },
      { slot: 'bag', max: 1500 },
    ],
  },
  {
    id: 'beauty',
    name: 'Glow kit',
    blurb: 'Skincare, colour and a scent. Beauty is a department, not an afterthought.',
    budget: 3999,
    rules: [
      { category: 'beauty', max: 2000 },
      { category: 'beauty', max: 1600 },
      { slot: 'accessory', max: 900 },
    ],
  },
  {
    id: 'home',
    name: 'Room refresh',
    blurb: 'Lamp, cushions, mugs — hostel or first flat energy.',
    budget: 4999,
    rules: [
      { category: 'home', max: 2500 },
      { category: 'home', max: 1800 },
      { category: 'home', max: 1400 },
    ],
  },
  {
    id: 'gift',
    name: 'Thoughtful gift basket',
    blurb: 'One fashion extra, one beauty, one home — mixed mall gifting.',
    budget: 3499,
    rules: [
      { category: 'beauty', max: 1600 },
      { category: 'home', max: 1400 },
      { slot: 'accessory', max: 900 },
    ],
  },
  {
    id: 'kids',
    name: 'Kids play drop',
    blurb: 'A set plus a hoodie. Full store, including kids.',
    budget: 2499,
    rules: [
      { category: 'kids', max: 1400 },
      { category: 'kids', max: 1100 },
    ],
  },
]

export function buildKit(products, kit) {
  const used = new Set()
  const items = []
  let spent = 0
  const pool = live(products)
  ;(kit.rules || []).forEach((rule) => {
    const pick = pool
      .filter((p) => !used.has(p.id))
      .filter((p) => (rule.slot ? p.slot === rule.slot : true))
      .filter((p) => (rule.category ? p.category === rule.category : true))
      .filter((p) => p.price <= (rule.max || kit.budget))
      .filter((p) => spent + p.price <= kit.budget)
      .sort((a, b) => (b.rating || 0) - (a.rating || 0) || a.price - b.price)[0]
    if (pick) {
      used.add(pick.id)
      items.push(pick)
      spent += pick.price
    }
  })
  return {
    ...kit,
    items,
    total: spent,
    leftover: Math.max(0, kit.budget - spent),
    score: crowdScore(items.map((p) => p.id)),
  }
}
