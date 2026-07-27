import { ImageResponse } from 'next/og'

// Apple touch icons must be a raster format, so the brand mark from icon.svg
// is redrawn here at 180x180 — the size iOS uses for home-screen bookmarks.
export const size = { width: 180, height: 180 }
export const contentType = 'image/png'

export default function AppleIcon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          background: '#000000',
          padding: 28,
        }}
      >
        <div
          style={{
            width: '100%',
            height: '100%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            background: '#FFE600',
            color: '#000000',
            fontFamily: 'monospace',
            fontSize: 101,
            fontWeight: 700,
          }}
        >
          S
        </div>
      </div>
    ),
    size
  )
}
