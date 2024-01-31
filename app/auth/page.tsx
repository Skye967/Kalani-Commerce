"use client" 

import { Auth } from '@supabase/auth-ui-react'
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import { ThemeSupa } from '@supabase/auth-ui-shared'
import Link from 'next/link'

type Props = {}

function AuthPage({ }: Props) {
    const supabase = createClientComponentClient()
    

  return (
      <>
          <div id='AuthPage' className='w-full min-h-screen bg-white'>
              <div className='w-full flex items-center justify-center p-5 border-b-gray-300'>
                  <Link href="/" className='min-w-[170px]'>
                      <img width="170" src='/images/logo.svg'/>
                  </Link>
              </div>

              <div className='w-full flex items-center justify-center p-5 border-b-gray-300'>
                  Login / Register
              </div>

              <div className='max-w-[400px] mx-auto px-2'>
                  <Auth
                      onlyThirdPartyProviders
                      appearance={{ theme: ThemeSupa }}
                      providers={['google']}
                      redirectTo={`${window.location.origin}/auth/callback`}
                      supabaseClient={supabase}
                  />
              </div>
          </div>
      </>
  )
}

export default AuthPage