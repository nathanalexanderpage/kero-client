import { createApp } from 'redux';
import rootReducer from './reducer/RootReducer'

export default (initialState) => {
  return createApp(
    rootReducer,
    initialState,
    window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__()
  )
}
