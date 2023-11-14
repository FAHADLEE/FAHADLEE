import React from 'react'
import { Link } from 'react-router-dom'

const Home = () => {
    return (
        <>
            <nav>
                <ul>
                    <li>
                        <Link to="/cms">CMS</Link>
                    </li>
                    <li>
                        <Link to="/maping">Maping</Link>
                    </li>
                </ul>
            </nav>
        </>
    )
}

export default Home