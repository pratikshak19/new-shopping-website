import { useState } from 'react'

export default function ProductImage({ src, alt, className }) {
  const [ok, setOk] = useState(true)
  if (!ok) {
    return (
      <div className={`ph ${className || ''}`} aria-label={alt}>
        {alt}
      </div>
    )
  }
  return <img src={src} alt={alt} className={className} onError={() => setOk(false)} />
}
