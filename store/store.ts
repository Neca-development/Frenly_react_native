import { configureStore } from '@reduxjs/toolkit'
import { setupListeners } from '@reduxjs/toolkit/query'

import { authApi } from './auth/auth.api'
import authSlice from './auth/auth.slice'

export const store = configureStore({
  reducer: {
    auth: authSlice,
    [authApi.reducerPath]: authApi.reducer,
  },
  middleware: getDefaultMiddleware => getDefaultMiddleware().concat(authApi.middleware),
})

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch
setupListeners(store.dispatch)
