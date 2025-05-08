import { useContext, useEffect, useRef, useState } from "react"
import { contextData } from "../context"

// hooks
import useMovies from "../Hooks/useMovies";
import useKey from "../Hooks/useKey";

export default function Header() {
    const context = useContext(contextData)
    return (
        <div className='header'>
            <Logo />
            <Search />
            <FoundedItems count={context.movies.length} />
        </div>
    )

}

function Logo() {
    return <span className="logo">🍿 usePopcorn</span>
}

function Search() {
    const inputRef = useRef()
    const [name, setName] = useState('')
    useMovies(name)
    
    
    useKey('Enter', () => {
        inputRef.current.value = ''
        inputRef.current.focus()
    })  

    useEffect(() => inputRef.current.focus(), [])
    
    return <input type="text" ref={inputRef} value={name} 
    onChange={e => setName(e.target.value)} className="searchBox" placeholder="Search movies..." />
}

function FoundedItems({ count }) {
    return <span className="foundedItems">Found {count} results</span>
}