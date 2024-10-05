import { Container } from "../../components/container/Container";
import { useState,useEffect } from "react";
import { collection,query,getDocs ,orderBy,where} from "firebase/firestore";
import { db } from "../../services/firebaseConfig";
import { Link } from "react-router-dom";
import { Loading } from "../../components/loading/Loading";

interface VehiclesProps{
    id: string;
    type: string;
    name: string;
    year: string;
    uid: string;
    price: string | number;
    city: string;
    km: string;
    images: VehicleImagesProps[];
}
interface VehicleImagesProps{
    uid: string;
    name: string;
    url: string;
}

export function Home(){
    const [vehicles,setVehicles] = useState<VehiclesProps[]>([]);
    const [loadImages,setLoadImages] = useState<string[]>([]);
    const [input,setInput] = useState('')

    useEffect(()=>{
        loadVehicles();
    },[])

    function loadVehicles(){
        const vehiclesRef = collection(db,'vehicles')
        const queryRef = query(vehiclesRef,orderBy('created','desc'))
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

    async function handleSearchType(type: string){
        let q;
        let querySnapShot;
        setVehicles([])
        let listVehicles = [] as VehiclesProps[];
        if(type === 'caminhao'){
            q = query(collection(db,'vehicles'),where('type','==',type))
             querySnapShot = await getDocs(q);

        }else{
            if(type === "moto"){
                q = query(collection(db,'vehicles'),where('type','==',type))
                 querySnapShot = await getDocs(q);
            }else{
                if(type === 'carro'){
                    q = query(collection(db,'vehicles'),where('type','==',type))
                     querySnapShot = await getDocs(q);
                }
            }
        }
        
        querySnapShot?.forEach((doc)=>{
            listVehicles.push({
                id: doc.id,
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
        setVehicles(listVehicles);
        

    }

    async function handleSearchVehicle(){
        let detail = input.toUpperCase();
        if(input === ''){
            loadVehicles();
            return;
        }
        setVehicles([]);
        setLoadImages([]);
        const q = query(collection(db,'vehicles'),where("name" , ">=", detail),where("name","<=",detail + "\uf88f"));
        const querySnapShot = await getDocs(q)
        let listVehicles = [] as VehiclesProps[];
        querySnapShot.forEach(doc => {
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

    }

    function handleImageLoad(id: string){
        setLoadImages((prevImageLoaded)=> [...prevImageLoaded,id])
    }
    return(
        <Container>
        <section className="bg-white-200 rounded-lg p-4 max-w-3xl mx-auto flex justify-center items-center gap-2">
            <input type="text" className="w-full border-2 rounded-lg h-9 px-3 outline-none" value={input} onChange={(e)=> setInput(e.target.value)} placeholder="Digite o Nome do veiculo que procura..." />
            <button className="bg-green-500 h-9 px-8 rounded-lg text-white font-bold text-lg" onClick={handleSearchVehicle}>Search</button>
            
        </section>
        <h2 className="font-bold mt-6 text-2xl mb-4  text-center">Procure por Veiculos em todo Brasil</h2>
        <div className="flex items-center justify-center">
        <button className="bg-green-500 h-9 px-8 rounded-lg m-1 text-white font-bold text-lg hover:bg-slate-300 hover:text-green-500" onClick={()=> handleSearchType('carro')}>Carros</button>
        <button className="bg-green-500 h-9 px-8 rounded-lg text-white font-bold text-lg m-1  hover:bg-slate-300 hover:text-green-500"onClick={()=> handleSearchType('moto')}>Motos</button>
        <button className="bg-green-500 h-9 px-8 rounded-lg text-white font-bold text-lg m-1  hover:bg-slate-300 hover:text-green-500" onClick={()=> handleSearchType('caminhao')}>Caminhões</button>
        </div>
        <main className="grid grid-cols- gap-6 md:grid-cols-2  lg:grid-cols-3">
          {vehicles.map(vehicle=>(
              <Link to={`/vehicleDetails/${vehicle.id}`}>
              <section className="w-full  bg-white rounded-lg">
                <div className="w-full h-72 rounded-lg" style={{display: loadImages.includes(vehicle.id)? "none": "block"}}>
                    <Loading/>
                </div>
              <img src={vehicle.images[0].url} alt="fiat uno 4 " className="w-full   rounded-lg mb-2 max-h-72 hover:scale-105 transition-all" onLoad={()=> handleImageLoad(vehicle.id)} />
              <p className="font-bold mt-1 mb-2 px-2">{vehicle.name}</p>
            <div className="flex flex-col px-2">
              <span className="text-zinc-700 mb-6">Ano: {vehicle.year} || KM: {vehicle.km} </span>
              <strong className="text-black font-medium text-xl">R$ {vehicle.price} </strong>
              <div className="w-full h-px bg-slate-200 my-2"></div>
              <div className="px-2 pb-2 ">
                  <span className="text-black">{vehicle.city}</span>
              </div>
            </div>
          </section>
              </Link>
          ))}
        </main>
        </Container>
    )
}