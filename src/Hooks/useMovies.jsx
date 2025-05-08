import { useEffect, useContext } from "react"
import { toast } from 'react-toastify';
import { contextData } from "../context";


export default function useMovies (name) {
    const context = useContext(contextData)

    useEffect(() => {
        let controler = new AbortController()
        async function Getter() {
            // toast.info('please wait...')
            try {
                const res = await fetch('http://www.omdbapi.com/?apikey=34476476&s=' + name, { signal: controler.signal })
                const data = await res.json()
                if (name === '') {
                    const res = await fetch('http://www.omdbapi.com/?apikey=34476476&s=harry+potter')
                    const data = await res.json()
                    context.setMovies(data.Search)
                    return null
                } else if (data.Response === "False") {
                    toast.error('there is no movie with this name...')
                    context.setMovies([])
                    return null
                }
                context.setMovies(data.Search)
            } catch (err) {
                if (err.name === 'AbortError') return
            }
        }
        Getter()
        return function () {
            controler.abort()
        }
    }, [name])
}