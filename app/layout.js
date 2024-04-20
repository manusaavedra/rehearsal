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
    <html lang="es">
      <body className={inter.className}>
        <header className="bg-gray-50 shadow-sm flex items-center justify-between px-4 py-2">
          <div className="flex flex-col">
            <Link href="/" prefetch className="text-2xl font-bold">Rehearsal</Link>
            <span className="text-xs">by Casa de oración</span>
          </div>
          <nav>
            <ul>
              <li>
                <Link prefetch className="bg-blue-500 flex items-center gap-1 text-white font-semibold p-2 rounded-md " href={`/create`}>
                  <BsPlus size={24} />
                  Añadir
                </Link>
              </li>
            </ul>
          </nav>
        </header>
        <NextUIProviders>
          {children}
        </NextUIProviders>
      </body>
    </html>
  )
}
