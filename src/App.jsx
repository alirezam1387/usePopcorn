
// componetns
import Header from './Components/Header.jsx'
import MovieBox from './Components/MoviesList.jsx'

// context
import { contextData } from './context.jsx'

// toast
import { ToastContainer } from 'react-toastify';

// helmet
import { Helmet } from "react-helmet";


function App() {
    return (
        <>
            <Helmet>
                <title>usepopcorn</title>
                <meta name="description" content="a website for choose your movie watchlist" />
                <meta http-equiv="Content-Security-Policy" content="upgrade-insecure-requests"/>
            </Helmet>
            <ToastContainer
                position="top-right"
                autoClose={1500}
                hideProgressBar={false}
                newestOnTop={false}
                closeOnClick={false}
                rtl={false}
                pauseOnFocusLoss={false}
                draggable={false}
                pauseOnHover
                theme="light"
            />
            <Header />
            <MovieBox />
        </>
    )
}

export default App
