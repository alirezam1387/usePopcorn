import { createContext, useState } from "react";

const contextData = createContext()

function BodyContext({children}) {
    const [imdb, setImdb] = useState(0)
    const [movies, setMovies] = useState([])
    const [Usermovies, setUserMovies] = useState(JSON.parse(localStorage.getItem('moveis')) || [])
    return (
        <contextData.Provider value={{imdb, setImdb, movies, setMovies, Usermovies, setUserMovies}}>
            {children}
        </contextData.Provider>
    )
}

export {contextData, BodyContext}