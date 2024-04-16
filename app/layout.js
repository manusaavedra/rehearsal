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
      <NextUIProviders>
        <body className={inter.className}>
          <header className="bg-neutral-800 flex items-center justify-between text-white px-4 py-2">
            <h2 className="text-3xl font-bold">Rehearsal</h2>
            <nav>
              <ul>
                <li>
                  <Link className="bg-white flex items-center gap-2 text-black font-semibold p-2 rounded-md " href={`/create`}>
                    <BsPlus size={24} />
                    Añadir
                  </Link>
                </li>
              </ul>
            </nav>
          </header>
          {children}
        </body>
      </NextUIProviders>
    </html>
  )
}
