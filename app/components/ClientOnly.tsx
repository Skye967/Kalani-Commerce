"use client"

import { ReactNode, useEffect, useState } from 'react'

type Props = {
    children: React.ReactNode
}

function ClientOnly({ children }: Props) {
    
    const [isClient, setIsClient] = useState(false)

    useEffect(() => setIsClient(true))

  return (
      <>
          {isClient ? <div>{children}</div> : null}
      </>
  )
}

export default ClientOnly