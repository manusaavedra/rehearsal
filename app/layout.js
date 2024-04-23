import { Inter } from 'next/font/google'
import './globals.css'
import Link from 'next/link'
import { BsPlus } from "react-icons/bs"
import NextUIProviders from '@/components/NextUIProvider'

const inter = Inter({ subsets: ['latin'] })

export const metadata = {
  title: 'Rehearsal',
  description: 'Crear tus chart nunca fue más práctico',
}

export default function RootLayout({ children }) {
  return (
    <html suppressHydrationWarning={true} lang="es">
      <body className={inter.className}>
        <header className="bg-gray-50 shadow-sm flex items-center justify-between px-4 py-2">
          <div className="flex flex-col">
            <Link href="/" prefetch className="text-2xl font-bold">Rehearsal</Link>
            <span className="text-xs">by Casa de oración</span>
          </div>
        </header>
        <NextUIProviders>
          {children}
        </NextUIProviders>
      </body>
    </html>
  )
}
