
import { Link } from "react-router"

export default function NotFound() {
    return (
        <figure className='flex w-screen h-screen bg-white items-center justify-center'>
            <figcaption className='flex gap-3 items-center select-none'>
                <h1 className='text-3xl font-semibold'>404</h1>
                <span className='w-px h-10 bg-black'></span>
                <article className='text-base'>This page could not be found</article>
            </figcaption>
            <Link className='flex gap-1 top-6 left-6 absolute items-center' to='/'>
                <svg className="size-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" d="m2.25 12 8.954-8.955c.44-.439 1.152-.439 1.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h8.25" />
                </svg>
                <p>HOME</p>
            </Link>
        </figure>
    )
}