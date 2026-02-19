import { useEffect } from 'react'
import { onAuthStateChanged } from 'firebase/auth'
import { doc, getDoc } from 'firebase/firestore'
import { auth, db } from '../firebase'
import { useAppDispatch } from '../store'
import {
  setAuthUser,
  setAuthUnit,
  setAuthNoUnit,
  setAuthUnauthenticated,
  setAuthLoading,
  type AuthUser,
} from '../store/authSlice'

export function useAuthListener() {
  const dispatch = useAppDispatch()

  useEffect(() => {
    dispatch(setAuthLoading())

    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (!firebaseUser || !firebaseUser.email) {
        dispatch(setAuthUnauthenticated())
        return
      }

      const authUser: AuthUser = {
        uid: firebaseUser.uid,
        email: firebaseUser.email,
        displayName: firebaseUser.displayName,
        photoURL: firebaseUser.photoURL,
      }
      dispatch(setAuthUser(authUser))

      try {
        const email = firebaseUser.email.toLowerCase()
        const userUnitDoc = await getDoc(doc(db, 'userUnits', email))

        if (userUnitDoc.exists()) {
          const data = userUnitDoc.data() as { unitId: string; unitName: string }
          const memberDoc = await getDoc(doc(db, 'units', data.unitId, 'members', email))
          if (!memberDoc.exists() || (memberDoc.data().status ?? 'active') === 'disabled') {
            dispatch(setAuthNoUnit())
            return
          }
          const role = (memberDoc.data().role as string) ?? 'member'
          dispatch(setAuthUnit({ unitId: data.unitId, unitName: data.unitName, role }))
        } else {
          dispatch(setAuthNoUnit())
        }
      } catch (error) {
        console.error('Error checking unit membership:', error)
        dispatch(setAuthNoUnit())
      }
    })

    return unsubscribe
  }, [dispatch])
}
