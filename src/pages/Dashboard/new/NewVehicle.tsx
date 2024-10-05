import { useForm } from "react-hook-form";
import { Container } from "../../../components/container/Container";
import { PanelHeader } from "../../../components/panelheader/PanelHeader";
import { FiTrash, FiUpload } from "react-icons/fi";
import { zodResolver } from "@hookform/resolvers/zod";
import { Input } from "../../../components/input/Input";
import { z } from "zod";
import { Select } from "../../../components/select/Select";
import { ChangeEvent, useContext, useState } from "react";
import { AuthContext } from "../../../context/AuthContext";
import { v4 as uuidV4 } from 'uuid'
import { storage,db } from "../../../services/firebaseConfig";
import { deleteObject, getDownloadURL, ref, uploadBytes } from "firebase/storage";
import { addDoc, collection } from "firebase/firestore";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";



const schema = z.object({
    type: z.string().nonempty("Selecione um tipo do veiculo"),
    name: z.string().nonempty('O campo nome é obrigatório'),
    model: z.string().nonempty("O modelo do carro é obrigatório"),
    year: z.string().nonempty("Ano é obrigátorio").refine((value) => /^[0-9]+$/.test(value), { message: "Somente Numeros" }),
    km: z.string().nonempty("O KM do carro é obrigatorio"),
    price: z.string().nonempty("O preço é obrigatório."),
    city: z.string().nonempty("A cidade é obrigatória"),
    whatsapp: z.string().min(1, "O telefone é obrigatório").refine((value) => /^(\d{11,12})$/.test(value), { message: "Numero de telefone invalido" }),
    description: z.string().nonempty("A descrição é obrigatória")
})

type FormData = z.infer<typeof schema>;

interface ImageItemProps{
    uid: string;
    name: string;
    previewUrl: string;
    url: string;
}

export function NewVehicle() {
    const navigate = useNavigate();
    const { user } = useContext(AuthContext)
    const [imageVehicle,setImageVehicle] = useState<ImageItemProps[]>([]);
    const { register, handleSubmit, formState: { errors }, reset } = useForm<FormData>({
        resolver: zodResolver(schema),
        mode: "onChange"
    })

    async function handleFile(e: ChangeEvent<HTMLInputElement>) {
        if (e.target.files && e.target.files[0]) {
            const image = e.target.files[0]
            console.log(image);

            if (image.type === 'image/jpeg' || image.type === 'image/png') {
                await handleUpload(image)
            } else {
                alert("Envie uma imagem jpeg ou png")
                return;
            }
        }
    }
    async  function handleDeleteImage(item: ImageItemProps){
        const imagePath = `images/${item.uid}/${item.name}`;

        const imageRef = ref(storage,imagePath);
        try {
            await deleteObject(imageRef)
            setImageVehicle(imageVehicle.filter((vehicle)=> vehicle.url !== item.url))
        } catch (error) {
            console.log('ERROR AO DELETAR')
        }
        console.log(item);
    }

    async function handleUpload(image: File) {
        if (!user?.uid) {
            return;
        } else {
            const currentUid = user?.uid;
            const uidImage = uuidV4();
            const uploadRef = ref(storage, `images/${currentUid}/${uidImage}`)
            uploadBytes(uploadRef, image)
                .then((snapshot) => {
                    getDownloadURL(snapshot.ref).then((downloadUrl) => {
                        console.log('URL da foto',downloadUrl);
                        const imageItem ={
                            name: uidImage,
                            uid: currentUid,
                            previewUrl: URL.createObjectURL(image),
                            url: downloadUrl,
                        }

                        setImageVehicle((images)=>[...images,imageItem])
                    })
                })
        }
    }

    function onSubmit(data: FormData) {
        if(imageVehicle.length===0){
            alert("Envie alguma imagem deste Veiculo!")
            return;
        }

        const carListImages = imageVehicle.map(vehicle =>{
            return{
                uid: vehicle.uid,
                name: vehicle.name,
                url: vehicle.url
            }
        });

        addDoc((collection(db,'vehicles')),{
            type: data.type,
            name: data.name.toUpperCase(),
            model: data.model,
            whatsapp: data.whatsapp,
            city: data.city,
            year: data.year,
            km: data.km,
            price: data.price,
            description: data.description,
            created: new Date(),
            owner: user?.name,
            uid: user?.uid,
            images: carListImages

        }).then(()=>{
            reset();
            setImageVehicle([]);
            toast.success('Veiculo cadastrado com sucesso!')
            navigate('/dashboard')
            
        })
        .catch((error)=>{
            toast.error('Error ao cadastrar , tente novamente mais tarde')
            console.log(error);
        })

        console.log(data);
    }
    return (
        <Container>
            <PanelHeader />
            <div className="w-full flex flex-col  bg-white p-3 rounded-lg sm:flex-row items-center gap-2">
                <button className="border-2 w-48 rounded-lg flex items-center justify-center cursor-pointer border-gray-600 h-32">
                    <div className="absolute cursor-pointer">
                        <FiUpload size={30} color="#000" />
                    </div>
                    <div className="cursor-pointer">
                        <input type="file" className='opacity-0 cursor-pointer' accept="image/*" onChange={handleFile} />
                    </div>
                </button>
                {imageVehicle.map(item =>(
                    <div key={item.name} className="w-full h-32 flex items-center justify-center relative">
                        <button className="fixed" onClick={()=> handleDeleteImage(item)}>
                            <FiTrash size={28} color="#fff" />
                        </button>
                        <img src={item.previewUrl} className="rounded-lg w-full h-32 object-cover" alt="Foto do Veiculo" />
                    </div>
                ))}
            </div>
            <div className="w-full bg-white p-3 roudend-lg flex flex-col sm:flex-row items-center gap-2 mt-2">
                <form className="w-full" onSubmit={handleSubmit(onSubmit)}>
                    <div className="mb-3">
                        <p className="mb-2 font-medium">Tipo do veiculo</p>
                        <Select name="type" register={register} />
                    </div>
                    <div className="mb-3">
                        <p className="mb-2 font-medium">Nome do Veiculo</p>
                        <Input type="text" register={register} name='name' error={errors.name?.message} placeholder="Ex: Fazer 250cc..." />
                    </div>
                    <div className="mb-3">
                        <p className="mb-2 font-medium">Modelo </p>
                        <Input type="text" register={register} name='model' error={errors.model?.message} placeholder="Ex: Fazer 250cc..." />
                    </div>
                    <div className="mb-3">
                        <p className="mb-2 font-medium">Ano</p>
                        <Input type="text" register={register} name='year' error={errors.year?.message} placeholder="Ex: 2023/2023..." />
                    </div>
                    <div className="mb-3">
                        <p className="mb-2 font-medium">KM</p>
                        <Input type="text" register={register} name='km' error={errors.km?.message} placeholder="Ex: 25.900..." />
                    </div>
                    <div className="mb-3">
                        <p className="mb-2 font-medium">Valor</p>
                        <Input type="text" register={register} name='price' error={errors.price?.message} placeholder="Ex: R$ 2500..." />
                    </div>
                    <div className="mb-3">
                        <p className="mb-2 font-medium">Cidade</p>
                        <Input type="text" register={register} name='city' error={errors.city?.message} placeholder="Ex: Santos..." />
                    </div>
                    <div className="mb-3">
                        <p className="mb-2 font-medium">Telefone / WhatsApp</p>
                        <Input type="text" register={register} name='whatsapp' error={errors.whatsapp?.message} placeholder="Ex: 13991646054" />
                    </div>
                    <div className="mb-3">
                        <p className="mb-2 font-medium">Descrição</p>
                        <Input type="text" register={register} name='description' error={errors.description?.message} placeholder="Ex: 13991646054" />
                    </div>
                    <button type="submit" className="w-full rounded-md bg-zinc-900 text-white font-medium  h-10">Cadastrar</button>
                </form>
            </div>
        </Container>
    )
}