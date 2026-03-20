import { useLayoutEffect, useRef, useState, type CSSProperties } from 'react'

type ClampTextProps = {
  text: string
  className: string
  lines?: number
}

const multilineClampStyle: CSSProperties = {
  display: '-webkit-box',
  WebkitLineClamp: 3,
  WebkitBoxOrient: 'vertical',
}

// ClampText applies multi-line truncation with a deterministic JS fallback:
// it measures rendered height, binary-searches the longest fitting substring,
// and appends an ellipsis so truncation stays reliable on mobile WebKit.
export default function ClampText({ text, className, lines = 3 }: ClampTextProps) {
  const textRef = useRef<HTMLParagraphElement | null>(null)
  const [displayText, setDisplayText] = useState(text)

  useLayoutEffect(() => {
    const node = textRef.current
    if (!node) {
      return
    }

    const applyClampStyles = () => {
      node.style.setProperty('display', '-webkit-box')
      node.style.setProperty('-webkit-line-clamp', `${lines}`)
      node.style.setProperty('-webkit-box-orient', 'vertical')
      node.style.setProperty('overflow', 'hidden')
    }

    const removeClampStyles = () => {
      node.style.setProperty('display', 'block')
      node.style.setProperty('-webkit-line-clamp', 'unset')
      node.style.setProperty('-webkit-box-orient', 'unset')
      node.style.setProperty('overflow', 'hidden')
    }

    const getLineHeight = () => {
      const computedStyle = window.getComputedStyle(node)
      const parsedLineHeight = Number.parseFloat(computedStyle.lineHeight)
      const fontSize = Number.parseFloat(computedStyle.fontSize)
      const resolvedLineHeight = Number.isNaN(parsedLineHeight) ? fontSize * 1.2 : parsedLineHeight
      if (!resolvedLineHeight || Number.isNaN(resolvedLineHeight)) {
        return null
      }

      return resolvedLineHeight
    }

    const clamp = () => {
      const lineHeight = getLineHeight()
      if (!lineHeight) {
        return
      }

      const maxHeight = lineHeight * lines
      removeClampStyles()
      node.textContent = text

      if (node.scrollHeight <= maxHeight + 1) {
        setDisplayText(text)
        applyClampStyles()
        return
      }

      let low = 0
      let high = text.length
      let best = '…'

      while (low <= high) {
        const mid = Math.floor((low + high) / 2)
        const candidate = `${text.slice(0, mid).trimEnd()}…`
        node.textContent = candidate

        if (node.scrollHeight <= maxHeight + 1) {
          best = candidate
          low = mid + 1
        } else {
          high = mid - 1
        }
      }

      setDisplayText(best)
      applyClampStyles()
    }

    clamp()

    const observer = new ResizeObserver(() => clamp())
    observer.observe(node)

    return () => observer.disconnect()
  }, [lines, text])

  return (
    <p className={`${className} break-words`} style={multilineClampStyle} ref={textRef}>
      {displayText}
    </p>
  )
}
