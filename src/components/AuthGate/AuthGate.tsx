import type { ReactNode } from 'react'
import { useAppSelector } from '../../store'
import SignInScreen from './SignInScreen'
import NoUnitScreen from './NoUnitScreen'
import LoadingScreen from './LoadingScreen'

interface Props {
  children: ReactNode
}

export default function AuthGate({ children }: Props) {
  const { status } = useAppSelector((s) => s.auth)

  switch (status) {
    case 'loading':
      return <LoadingScreen />
    case 'unauthenticated':
      return <SignInScreen />
    case 'no_unit':
      return <NoUnitScreen />
    case 'ready':
      return <>{children}</>
  }
}
