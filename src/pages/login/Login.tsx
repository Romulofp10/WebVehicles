import { Container } from '../../components/container/Container'
import { Link, useNavigate } from 'react-router-dom'
import { Input } from '../../components/input/Input'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { auth } from '../../services/firebaseConfig'
import { signInWithEmailAndPassword,signOut } from 'firebase/auth'
import { useEffect, useState } from 'react'
import toast from 'react-hot-toast'

const schema = z.object({
    email: z.string().email('Insira um email valido').nonempty('O campo email é obrigatorio'),
    password: z.string().nonempty("O campo senha é obrigatorio")
})

type FormData = z.infer<typeof schema>

export function Login() {
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();
    const { register, handleSubmit, formState: { errors } } = useForm<FormData>({
        resolver: zodResolver(schema),
        mode: 'onChange'
    })

    useEffect(()=>{
        async function handleSignOut(){
            await signOut(auth);
        };
        handleSignOut();
    },[])

    function onSubmit(data: FormData) {
        setLoading(true);
        signInWithEmailAndPassword(auth, data.email, data.password)
            .then((user) => {
                navigate('/dashboard', { replace: true })
                toast.success(`Olá ${user.user.displayName} logado com sucesso!`)
            })
            .catch(error => {
                console.log('usuario nao existe')
                console.log(error);
                toast.error("Error ao fazer login.")
            })
        setLoading(false);
    }

    return (
        <Container>
            <div className=' w-full min-h-screen flex justify-center items-center flex-col gap-4'>
                <Link to='/' className='mb-6 max-w-sm w-full'>
                    <p className='bg-lime-300 font-mono px-4 py-1 text-center'>WEB<span className='font-bold'>VEHICLES</span></p>
                </Link>
                <form className='bg-white max-w-xl w-full rounded-lg p-4' onSubmit={handleSubmit(onSubmit)} >
                    <div className='pb-2'>
                        <Input type='email'
                            placeholder='Digite seu Email...'
                            name='email'
                            error={errors.email?.message}
                            register={register} />
                    </div>
                    <div className='pb-2'>
                        <Input type='password'
                            placeholder='Digite seu password...'
                            name='password'
                            error={errors.password?.message}
                            register={register} />
                    </div>
                    {loading && <button disabled className='bg-zinc-900 w-full rounded-md text-white h-10 font-medium'>Carregando...</button>}
                    <button className='bg-zinc-900 w-full rounded-md text-white h-10 font-medium'>Acessar</button>
                </form>
                <Link className='text-black' to='/register'>Já possui uma conta? Faça um login</Link>
            </div>

        </Container>
    )
}