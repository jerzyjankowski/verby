import React from 'react'
import type { RouteObject } from 'react-router-dom'

type PageModule = { default: React.ComponentType }
type LayoutModule = { default: React.ComponentType<{ children: React.ReactNode }> }

function keyToSegments(key: string, suffixToRemove: string) {
  const pagesMarker = '/pages/'
  const idx = key.lastIndexOf(pagesMarker)
  const rel = idx >= 0 ? key.slice(idx + pagesMarker.length) : key
  const noSuffix = rel.endsWith(suffixToRemove) ? rel.slice(0, -suffixToRemove.length) : rel
  return noSuffix === '' ? [] : noSuffix.split('/')
}

function segmentToRoutePart(segment: string): string {
  // Next.js-like dynamic segments: [name] -> :name
  const m = segment.match(/^\[(.+)\]$/)
  return m ? `:${m[1]}` : segment
}

function segmentsToPath(segments: string[]) {
  if (segments.length === 0) return '/'
  return `/${segments.map(segmentToRoutePart).join('/')}`
}

export function buildFileSystemRoutes(): RouteObject[] {
  const pageModules = import.meta.glob('../pages/**/Page.tsx', { eager: true }) as Record<
    string,
    PageModule
  >
  const layoutModules = import.meta.glob('../pages/**/Layout.tsx', { eager: true }) as Record<
    string,
    LayoutModule
  >

  const layoutByPrefix = new Map<string, LayoutModule['default']>()

  for (const [key, mod] of Object.entries(layoutModules)) {
    const segs = keyToSegments(key, 'Layout.tsx')
    const prefix = segs.join('/')
    layoutByPrefix.set(prefix, mod.default)
  }

  const routes: RouteObject[] = []
  const seenPaths = new Set<string>()

  for (const [key, mod] of Object.entries(pageModules)) {
    const pageSegments = keyToSegments(key, 'Page.tsx')
    const path = segmentsToPath(pageSegments)

    if (seenPaths.has(path)) {
      throw new Error(`Duplicate page route for path "${path}" (file: ${key})`)
    }
    seenPaths.add(path)

    const Page = mod.default

    // Wrap page in any layouts found along its folder path.
    // Convention: Layout.tsx must render `{children}` (not `Outlet`).
    let wrappedElement: React.ReactNode = <Page />
    for (let prefixLen = pageSegments.length; prefixLen >= 0; prefixLen--) {
      const prefix = pageSegments.slice(0, prefixLen).join('/')
      const Layout = layoutByPrefix.get(prefix)
      if (Layout) {
        wrappedElement = <Layout>{wrappedElement}</Layout>
      }
    }

    routes.push({
      path,
      element: wrappedElement,
    })
  }

  // Keep deterministic ordering for easier debugging.
  routes.sort((a, b) => String(a.path).localeCompare(String(b.path)))

  return routes
}

