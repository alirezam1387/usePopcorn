// icons
import { CiCalendarDate } from "react-icons/ci";
import { FaRegStar, FaRegArrowAltCircleLeft } from "react-icons/fa";
import { MdOutlineLocalMovies } from "react-icons/md";
import { MdAccessTime } from "react-icons/md";
import { FaStar } from "react-icons/fa";
import { IoClose } from "react-icons/io5";

// context
import { contextData } from '../context'

import { Row, Col } from 'react-bootstrap'
import { useContext, useEffect, useState, useRef } from "react";

// toast
import { toast } from "react-toastify";

// helmet
import { Helmet } from "react-helmet";

// hooks
import useKey from "../Hooks/useKey";

export default function MovieBox() {
    const context = useContext(contextData)
    useKey('Escape', () => context.setImdb(0))

    return (
        <Row className="movie-box"> 
            <Col><MoviesList /></Col>
            {context.imdb != 0 ? <Col><MovieDetailBox /></Col> : <Col><UserMovies /></Col>}
        </Row>
    )
}

function MoviesList() {
    const context = useContext(contextData)
    useEffect(() => {
        async function movieGetter() {
            const res = await fetch('http://www.omdbapi.com/?apikey=34476476&s=harry+potter')
            const data = await res.json()
            context.setMovies(data.Search)
        }
        movieGetter()
    }, [])
    return (
        <div className="movie-list">
            {context.movies && context.movies.length > 1 && context.movies.map(item => {
                return <Movie key={item.imdbID} {...item} />
            })}

            {context.err !== '' && <h2>{context.err}</h2>}
        </div>
    )
}

function Movie({ Title, Year, Poster, imdbID, Active = false, imdbRating, ActiveStars, Runtime, id }) {
    const context = useContext(contextData)
    const OpenDetail = (id) => {
        context.setImdb(id)
        toast.info('please wait...')
    }

    function DeleteItem() {
        let items = JSON.parse(localStorage.getItem('moveis'))
        items = items.filter(i => i.id != id)
        localStorage.setItem('moveis', JSON.stringify(items))
        context.setUserMovies(items)
    }
    return (
        <div className={Active ? "movie deactive" : 'movie'} onClick={() => Active === false && OpenDetail(imdbID)}>
            <img src={Poster} alt={Title} />
            <div className="detail">
                <p>{Title}</p>
                {!Active && <div className="date">
                    <CiCalendarDate />
                    <p>{Year}</p>
                </div>}
                {Active === true && <div className="items">
                    <div className="sectionItem-bar">
                        <PinSectionItem icon={<MdOutlineLocalMovies />} count={imdbRating} />
                        <PinSectionItem icon={<FaRegStar />} count={ActiveStars} />
                        <PinSectionItem icon={<MdAccessTime />} count={Runtime} />
                    </div>

                    <IoClose onClick={DeleteItem} className="close-icon" />

                </div>}

            </div>

        </div>
    )
}

function UserMovies() {
    const context = useContext(contextData)
    const [stars, setStars] = useState(0)
    const [watchTime, setWatchTime] = useState(0)
    useEffect(() => {
        let time = 0
        let star = 0
        let lastIndex = 0;
        context.Usermovies.map(i => {
            star += i.ActiveStars
            lastIndex = i.Runtime.indexOf(' min')
            time += Number(i.Runtime.slice(0, lastIndex))
        })
        setStars(Math.round(star / context.Usermovies.length))
        setWatchTime(Math.round(time / context.Usermovies.length))
    }, [context.Usermovies.length])
    return (
        <div className="movie-list">
            <div className="pin-box active">
                <p>movies you are going to watch</p>
                <div className="items">
                    <PinSectionItem icon={<MdOutlineLocalMovies />} count={context.Usermovies.length} />
                    <PinSectionItem icon={<FaRegStar />} count={stars > 0 ? stars : 0} />
                    <PinSectionItem icon={<MdAccessTime />} count={watchTime > 0 ? watchTime + ' min' : 0 + ' min'} />
                </div>
            </div>
            {context.Usermovies.map(item => <Movie Active {...item} key={item.id} />)}

        </div>
    )
}

function PinSectionItem({ icon, count }) {
    return (
        <div className="sectionItem">
            {icon}
            <span>{count}</span>
        </div>
    )
}

function MovieDetailBox() {
    const context = useContext(contextData)
    const [movie, setMovie] = useState([])
    const [loading, setLoading] = useState(false)
    const [ActiveStars, setActiveStars] = useState(-1)
    const [HoverStars, setHoverStars] = useState(ActiveStars)
    function addItem() {
        let items = JSON.parse(localStorage.getItem('moveis')) || []
        if (items.length === 0) {
            items = [...items, {
                id: items.length + 1, Runtime: movie.RunTime, imdbRating: movie.imdbRating,
                Poster: movie.Poster, Title: movie.Title, ActiveStars: ActiveStars + 1, Runtime: movie.Runtime
            }]
        } else {
            items = [...items, {
                id: items[items.length - 1].id + 1, Runtime: movie.RunTime, imdbRating: movie.imdbRating,
                Poster: movie.Poster, Title: movie.Title, ActiveStars: ActiveStars + 1, Runtime: movie.Runtime
            }]
        }

        localStorage.setItem('moveis', JSON.stringify(items))
        context.setUserMovies(items)
        setActiveStars('added')
    }

    useEffect(() => {
        setActiveStars(-1)
        setHoverStars(-1)
        async function MovieDetail() {
            setLoading(true)
            const res = await fetch(`http://www.omdbapi.com/?apikey=34476476&i=${context.imdb}`)
            const data = await res.json()
            setMovie(data)
            setLoading(false)
        }
        MovieDetail()
    }, [context.imdb])
    return (
        <>
            <Helmet>
                <title>{movie.Title}</title>
                <meta name="description" content={movie.Plot} />
            </Helmet>
            <div className="movie-list">
                <FaRegArrowAltCircleLeft onClick={() => context.setImdb(0)} />
                {loading ? <center><h3>Loading...</h3></center> : <>
                    <MovieDetail {...movie} />
                    <div className="detail">
                        <div className="stars-main-box">
                            <div className="stars-box">
                                {ActiveStars !== 'added' ? Array.from(Array(10).keys()).map(i => {
                                    return <span
                                        key={i}
                                        onMouseLeave={() => setHoverStars(ActiveStars)}
                                        onMouseEnter={() => setHoverStars(i)}
                                        onClick={() => setActiveStars(i)}
                                    >{i <= HoverStars ? <FaStar className="star-svg" /> : <FaRegStar className="star-svg" />}</span>
                                }) : <span>movie added successfully</span>}
                            </div>
                            {ActiveStars > -1 && <button className="btn" onClick={addItem}>Add to List</button>}
                        </div>
                        <div className="more-detail">
                            <p>{movie.Plot}</p><br />
                            <p>- directed by {movie.Director}</p>
                            <p>- worte by {movie.Writer}</p>
                        </div>
                    </div></>}
            </div>
        </>
    )
}

function MovieDetail({ Poster, Title, Released, imdbRating }) {
    return (
        <div className="movie-detail">
            <img src={Poster} alt="name" />
            <div className="detail">
                <h5>{Title}</h5>
                <p>{Released}</p>
                <div className="star">
                    <FaStar className="star-icon" />
                    <span>{imdbRating} Average Rating</span>
                </div>
            </div>
        </div>
    )
}   