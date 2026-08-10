import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'FRP Vercel Manager',
  description: 'Manage your FRP tunnels on Vercel',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className="bg-black text-white antialiased">{children}</body>
    </html>
  )
}
