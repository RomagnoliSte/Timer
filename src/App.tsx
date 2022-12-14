import { ThemeProvider } from 'styled-components'
import { BrowserRouter} from 'react-router-dom'
import { Router } from '../Router'

import { GlobalStyle } from './@types/global'
import { DefaultTheme } from './styles/themes/default'

export function App() {
  return (
    <ThemeProvider theme={DefaultTheme}>
      <BrowserRouter>
        <Router/>       
      </BrowserRouter>
      <GlobalStyle />
    </ThemeProvider>
  )
}
