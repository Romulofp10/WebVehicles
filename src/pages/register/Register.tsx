import { Container } from '../../components/container/Container'
import { Link,useNavigate } from 'react-router-dom'
import { Input } from '../../components/input/Input'
import { useForm } from 'react-hook-form'
import {  z } from 'zod'
import {auth} from '../../services/firebaseConfig'
import { zodResolver } from '@hookform/resolvers/zod'
import { createUserWithEmailAndPassword, updateProfile ,signOut} from 'firebase/auth'
import { useContext, useEffect } from 'react'
import { AuthContext } from '../../context/AuthContext'

const schema = z.object({
    email: z.string().email('Insira um email valido').nonempty('O campo email é obrigatorio'),
    name: z.string().nonempty('O campo nome é obrigátorio'),
    password: z.string().min(6, 'A senha deve ter pelo menos 6 caracters').nonempty("O campo senha é obrigatorio")
})

type FormData = z.infer<typeof schema>



export function Register() {
    const {handleInfoUser} = useContext(AuthContext);

    useEffect(()=>{
        async function handleSignOut(){
            await signOut(auth);
        };
        handleSignOut();
    },[])

    const navigate = useNavigate()

    async function onSubmit(data: FormData) {
        createUserWithEmailAndPassword(auth,data.email,data.password)
        .then(async user=>{
           await updateProfile(user.user,{
            displayName: data.name
           })
           handleInfoUser({
            name: data.name,
            email: data.email,
            uid: user.user.uid
           })

           console.log('Cadastrado com sucesso ')
           navigate('/dashboard',{replace: true})
        })
        .catch((error)=>{
            console.log('erro ao cadastrar')
            console.log(error);
        })
    
    }

   
    const { register, handleSubmit, formState: { errors } } = useForm<FormData>({
        resolver: zodResolver(schema),
        mode: 'onChange'
    })
    return (
        <div>
            <Container>
                <div className=' w-full min-h-screen flex justify-center items-center flex-col gap-4'>
                    <Link to='/' className='mb-6 max-w-sm w-full'>
                        <p className='bg-lime-300 font-mono px-4 py-1 text-center'>WEB<span className='font-bold'>VEHICLES</span></p>
                    </Link>
                    <form className='bg-white max-w-xl w-full rounded-lg p-4' onSubmit={handleSubmit(onSubmit)} >
                        <div className='pb-2'>
                            <div className='pb-2'>
                                <Input type='text'
                                    placeholder='Digite seu nome...'
                                    name='name'
                                    error={errors.name?.message}
                                    register={register} />
                            </div>
                           <div className='pb-2'>
                           <Input type='email'
                                placeholder='Digite seu Email...'
                                name='email'
                                error={errors.email?.message}
                                register={register} />
                           </div>
                         
                        </div>
                        <div className='pb-2'>
                            <Input type='password'
                                placeholder='Digite seu password...'
                                name='password'
                                error={errors.password?.message}
                                register={register} />
                        </div>
                        <button className='bg-zinc-900 w-full rounded-md text-white h-10 font-medium'>Cadastrar</button>
                    </form>
                    <Link className='text-black' to='/login'>Já possui uma conta? Faça um login</Link>
                </div>
                
            </Container>
        </div>
       
    )
}