import { BiTrash } from "react-icons/bi";
import { Container } from "../../components/container/Container";
import { PanelHeader } from "../../components/panelheader/PanelHeader";
import { useContext, useEffect, useState } from "react";
import {getDocs,where,query,collection, deleteDoc,doc} from 'firebase/firestore'
import { db, storage } from "../../services/firebaseConfig";
import {ref,deleteObject} from 'firebase/storage'
import { AuthContext } from "../../context/AuthContext";

interface VehiclesProps{
    uid: string;
    id: string;
    type: string;
    name: string;
    year: string;
    price: string | number;
    city: string;
    km: string;
    images: ImageVehicleProps[];
}

interface ImageVehicleProps{
    name : string;
    uid:  string;
    url: string;
}

export function DashBoard() {
    const [vehicles, setVehicles] = useState<VehiclesProps[]>([])
    const {user} = useContext(AuthContext);

    useEffect(()=>{
        function loadVehicles(){
            if(!user?.uid){
                return;
            }

            const vehiclesRef = collection(db,'vehicles')
            const queryRef = query(vehiclesRef,where("uid", "==", user.uid))
            getDocs(queryRef).then((snapshot)=>{
                let listVehicles = [] as VehiclesProps[];
                snapshot.forEach(doc => {
                    listVehicles.push({
                        id:doc.id,
                        type: doc.data().type,
                        name: doc.data().name,
                        year: doc.data().year,
                        km: doc.data().km,
                        price: doc.data().price,
                        city: doc.data().city,
                        images: doc.data().images,
                        uid: doc.data().uid
                    })
                })
                setVehicles(listVehicles)
            })
            
        }
        loadVehicles();
    },[user])
    
        async function handleDelete(vehicle: VehiclesProps){
            const itemVehicle = vehicle;
            const docRef = doc(db,"vehicles",vehicle.id)
            await deleteDoc(docRef);
            vehicle.images.map(async(image)=>{
                const imagePath = `images/${image.uid}/${image.name}`
                const imageRef = ref(storage,imagePath);
                try {
                    await deleteObject(imageRef);
                    setVehicles(vehicles.filter(vehicle => vehicle.id !== itemVehicle.id))
                } catch (error) {
                    console.log("ERRO ao excluir imagem") 
                }
            })
        }

    return (
        <Container>
            <PanelHeader />
            <main className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
                {vehicles.map(vehicle => (
                    <section className="w-full bg-white rounded-lg relative" key={vehicle.id}>
                    <button onClick={()=> handleDelete(vehicle)} className="absolute bg-white w-12 h-12 rounded-full flex items-center justify-center right-2 mt-2"><BiTrash size={26} color="#000" /></button>
                    <img src={vehicle.images[0].url} className="w-full rounded-lg mb-2 max-h-72" alt="" />
                    <p className="font-medium mt-1 px-2 mb-2">{vehicle.name}</p>
                    <div className="flex flex-col px-2">
                        <span>ANO: {vehicle.year} | KM: {vehicle.km} </span>
                        <strong className="text-black font-bold">R$: {vehicle.price} </strong>
                    </div>
                    <div className="w-full h-px bg-slate-200 my-2"></div>
                    <div>
                        <p className="text-black">{vehicle.city}</p>
                    </div>
                </section>
                ))}
            </main>
        </Container>
    )
}