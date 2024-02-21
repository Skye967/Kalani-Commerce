import type { Metadata } from 'next'
import './globals.css'
import { ToastContainer } from "react-toastify"
import 'react-toastify/dist/ReactToastify.css'
import UserProvider from './context/user'
import CartProvider from './context/cart'

export const metadata: Metadata = {
  title: 'Kalani E-commerce',
  description: 'Demonstrating Next.js, Typescript, Supabase, and Prisma in a E-commerce web application',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>
        <ToastContainer />
        <UserProvider>
          <CartProvider>
          {children}
          </CartProvider>
        </UserProvider>
      </body>
    </html>
  );
}
