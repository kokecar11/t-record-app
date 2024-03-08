'use client'
import Image from 'next/image'
import Link from 'next/link'
import { signOut, useSession } from 'next-auth/react'
import Live from '~/app/_components/live'
import { Avatar, AvatarFallback, AvatarImage } from '~/components/ui/avatar'
import { 
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuGroup,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger } 
    from '~/components/ui/dropdown-menu'
    import { Skeleton } from '../ui/skeleton'
    import { Badge } from '../ui/badge'
    import { capitalizeFirstLetter } from '~/lib/utils'
    import { LogOut, User, Users, Wallet, LayoutDashboard } from 'lucide-react'
import { Button } from '../ui/button'

export function NavbarApp () {
    const { data: session } = useSession()

    const userImage = session?.user?.image as string | undefined
    const initalName = session?.user?.name?.split(" ").map((n: string) => n[0]).join("")

    return (
    <nav className='w-full sticky container flex z-10 px-4 sm:px-14 py-1.5 items-center justify-between top-0 bg-transparent backdrop-filter backdrop-blur-lg'>
        <Link href='/' className='flex items-center'>
            <Image
                src='/images/logo.png'
                alt='Budgets-map logo'
                width={40}
                height={40}
            />
            <span className='ml-2 text-primary text-xl font-semibold text-white'>T-Record</span>
        </Link>
        <div className='flex flex-1 font-semibold ml-3'> 

        </div>
        <div className='flex items-center space-x-4 flex-none'>
        {session?.user.plan ? 
            session?.user.plan === 'PLUS' ? 
            (<Badge variant='plus'>{capitalizeFirstLetter(session.user.plan.toLowerCase())}</Badge>) : 
            (<Button variant='secondary' className='capitalize'> update your plan</Button>)
            :
            (<Skeleton className="rounded-full h-[22px] w-[66px]"></Skeleton>)
        }
        <Live/>
        <div className=''>
            {session?.user?.image ? (
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Avatar className='cursor-pointer'>
                            <AvatarImage src={userImage} alt='profile-image'/>
                            <AvatarFallback>{initalName}</AvatarFallback>
                        </Avatar>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent className="w-56">
                        <DropdownMenuGroup>
                            <DropdownMenuItem className='cursor-pointer'>
                                <LayoutDashboard className="mr-2 h-4 w-4" />
                                <span>Dashboard</span>
                            </DropdownMenuItem>
                            <DropdownMenuItem className='cursor-pointer'>
                                <User className="mr-2 h-4 w-4" />
                                <span>Profile</span>
                            </DropdownMenuItem>
                            <DropdownMenuItem className='cursor-pointer'>
                                <Wallet className="mr-2 h-4 w-4" />
                                <span>Billing</span>
                            </DropdownMenuItem>
                            <DropdownMenuItem>
                                <Users className="mr-2 h-4 w-4" />
                                <span>Team</span>
                            </DropdownMenuItem>
                        </DropdownMenuGroup>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem onClick={async () => {await signOut()}} className='cursor-pointer'>
                            <LogOut className="mr-2 h-4 w-4" />
                            <span>Logout</span>
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            ) : (
                <Skeleton className="w-10 h-10 rounded-full" />
            )}
        </div>
        </div>
        
    </nav>
)
}
