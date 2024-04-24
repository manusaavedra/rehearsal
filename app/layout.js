import { Inter } from 'next/font/google'
import './globals.css'
import Link from 'next/link'
import { BsPlus } from "react-icons/bs"
import NextUIProviders from '@/components/NextUIProvider'
import Header from '@/components/Header'

const inter = Inter({ subsets: ['latin'] })

export const metadata = {
  title: 'Rehearsal',
  description: 'Crear tus chart nunca fue más práctico',
}

export default function RootLayout({ children }) {
  return (
    <html suppressHydrationWarning={true} lang="es">
      <body className={inter.className}>
        <Header />
        <NextUIProviders>
          {children}
        </NextUIProviders>
      </body>
    </html>
  )
}
