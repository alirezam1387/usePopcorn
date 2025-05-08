import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
// css
import 'bootstrap/dist/css/bootstrap.min.css';
import './index.css'

// componetns
import App from './App.jsx';

// context
import { BodyContext } from './context.jsx'



createRoot(document.getElementById('root')).render(
    <BodyContext>
        <App />
    </BodyContext>
,)
