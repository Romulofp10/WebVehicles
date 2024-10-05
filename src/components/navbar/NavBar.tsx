import {Link} from 'react-router-dom'
import { FiUser, FiLogIn } from 'react-icons/fi';
import { useContext } from 'react';
import { AuthContext } from '../../context/AuthContext';

export function NavBar(){
 const {signed,loadingAuth} = useContext(AuthContext);

    return(
        <nav className='w-full flex items-center justify-center h-16 bg-white drop-shadow mb-4'>
            <div className='flex w-full max-w-7xl justify-between px-4 mx-auto items-center '>
            <Link to='/'>
            <p className='bg-lime-300 font-mono px-4 py-1'>WEB<span className='font-bold'>VEHICLES</span></p>
            </Link>
            {!loadingAuth && signed &&(
                <Link to='/dashboard'>
                    <div className='border-2 rounded-full p-1 border-gray-900'>
                <FiUser size={24} color='#000'></FiUser>
                </div>
                </Link>
                
            )}
            {!loadingAuth && !signed &&(
                <Link to='/login'>
                <FiLogIn size={24} color='#000'></FiLogIn>
                </Link>
            )}
            </div>
           
        </nav>
    )
}