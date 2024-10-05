import { useEffect, useState } from "react";
import { Container } from "../../components/container/Container";
import { useNavigate, useParams } from "react-router-dom";
import { getDoc, doc } from "firebase/firestore";
import { db } from "../../services/firebaseConfig";
import { FaWhatsapp } from "react-icons/fa"
import {Swiper,SwiperSlide} from 'swiper/react'

interface VehicleProps {
    id: string;
    name: string;
    type: string;
    model: string;
    city: string;
    year: string;
    whatsapp: string;
    price: string | number;
    km: string;
    description: string;
    created: string | number;
    owner: string;
    uid: string;
    images: ImageVehicleProps[];
}

interface ImageVehicleProps {
    uid: string;
    name: string;
    url: string;
}

export function VehicleDetails() {
    const { id } = useParams();
    const [vehicle, setVehicle] = useState<VehicleProps>()
    const [slidePerView,setSlidePerView] = useState<number>(2);
    const navigate = useNavigate();

    useEffect(()=>{
        function handleResize(){
            if(window.innerWidth<720){
                setSlidePerView(1);
            }else{
                setSlidePerView(2);
            }
        }
        handleResize();

        window.addEventListener("resize",handleResize)
        return()=>{
            window.removeEventListener('resize',handleResize)
        }
    },[])
 
    useEffect(() => {
        async function loadVehicle() {
            if (!id) {
                return;
            }
            const docRef = doc(db, "vehicles", id)
            getDoc(docRef)
                .then((snapshot) => {
                    if(!snapshot.data()){
                        navigate('/')
                    }
                    setVehicle({
                        id: snapshot.data()?.id,
                        name: snapshot.data()?.name,
                        type: snapshot.data()?.type,
                        year: snapshot.data()?.year,
                        city: snapshot.data()?.city,
                        model: snapshot.data()?.model,
                        uid: snapshot.data()?.uid,
                        description: snapshot.data()?.description,
                        created: snapshot.data()?.created,
                        whatsapp: snapshot.data()?.whatsapp,
                        price: snapshot.data()?.price,
                        km: snapshot.data()?.km,
                        owner: snapshot.data()?.owner,
                        images: snapshot.data()?.images
                    })
                })
        }
        loadVehicle();
    }, [id])

    return (
        <div>
            <Container>
                <Swiper slidesPerView={slidePerView}
                pagination={{clickable:true}}
                navigation>
                {vehicle?.images.map(image=>(
                    <SwiperSlide key={image.name}><img src={image.url} className="w-full h-96 object-cover" /></SwiperSlide>
                ))}
                </Swiper>
                {vehicle && (
                    <main className="w-full bg-white rounded-lg p-6 my-4">
                        <div className="flex flex-col sm:flex-row mb-4 items-center  justify-between">
                            <h1 className="font-bold text-3xl text-black">{vehicle?.name}</h1>
                            <h1 className="font-bold text-3xl text-black">R$: {vehicle?.price}</h1>
                        </div>
                        <p>{vehicle?.model}</p>
                        <div className="flex w-full gap-6 my-4">
                            <div className="flex flex-col gap-4">
                                <div>
                                    <p>Cidade</p>
                                    <strong>{vehicle?.city}</strong>
                                </div>
                                <div>
                                    <p>Ano</p>
                                    <strong>{vehicle?.year}</strong>
                                </div>
                                </div>    
                                <div className="flex flex-col gap-4">
                                    <div>
                                        <p>km</p>
                                        <strong>{vehicle?.km}</strong>
                                    </div>
                                </div>
                           

                        </div>
                        <div>
                            <strong>telefone / whatsapp</strong>
                            <p>{vehicle?.whatsapp}</p>
                            <strong>Descrição:</strong>
                            <p className="mb-4">{vehicle?.description}</p>
                        </div>
                        <a className=" cursor-pointer bg-green-500 w-full text-white flex items-center justify-center gap-2 my-6 h-11 text-xl  rounded-lg font-medium " href={`https://api.whatsapp.com/send?phone=${vehicle?.whatsapp}&text=Olá vi esse ${vehicle.name} na WebVehicle! Gostaria de saber mais sobre!`} target="_blank"> Conversar Com o vendedor<FaWhatsapp /></a>
                    </main>
                )}
            </Container>
        </div>

    )
}