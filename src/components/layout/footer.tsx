import Link from 'next/link'
import Image from 'next/image'
import { FeHeart, FeGithub, FeInstagram, FeTwitter } from '../icons'

export function Footer () {
    return (
    <footer className="bg-[#15162c] text-center text-white border-secondary-old border-t-4">
        <div className="p-4 flex space-x-6 items-center justify-between container mx-auto sm:px-14">
            <div className="flex justify-center items-center space-x-6">
                <Link href='/' className={"font-bold text-xl text-white flex place-items-center space-x-2"}>
                    <Image className="rounded-md" src='/images/logo.png' width={40} height={40} alt='Logo T-Record'/>
                    <span>T-Record</span>
                </Link>
            </div>
            <div className="flex space-x-6">
                <p className="text-white font-semibold flex">Made with<FeHeart className="text-2xl text-rose-600 mx-1" /> by <Link href='https://twitter.com/Kokecar11' className="pl-1 underline" target="_blank">Koke</Link></p>
                <Link href="https://github.com/kokecar11" className="icon hover:animate-jump hover:animate-once hover:animate-duration-1000 hover:animate-delay-300" target='_blank'>
                    <FeGithub className='text-2xl' />
                </Link>
                <Link href="https://twitter.com/Kokecar11" className="icon hover:animate-shake hover:animate-once hover:animate-duration-1000 hover:animate-delay-300" target='_blank'>
                    <FeTwitter className='text-2xl' />
                </Link>
                <Link href="https://www.instagram.com/koke_car11/" className="icon hover:animate-wiggle hover:animate-once hover:animate-duration-1000 hover:animate-delay-300" target='_blank'>
                    <FeInstagram className='text-2xl' />
                </Link>
            </div>
        </div>
    </footer>
    )
}
