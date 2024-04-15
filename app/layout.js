import { Inter } from 'next/font/google'
import './globals.css'

const inter = Inter({ subsets: ['latin'] })

export const metadata = {
  title: 'Rehearsal',
  description: 'Crear tus chart nunca fue más práctico',
}

export default function RootLayout({ children }) {
  return (
    <html lang="es">
      <body className={inter.className}>
        <header className="bg-neutral-950 text-white px-4 py-2">
          <h2 className="text-3xl font-bold">Rehearsal</h2>
        </header>
        {children}
      </body>
    </html>
  )
}
