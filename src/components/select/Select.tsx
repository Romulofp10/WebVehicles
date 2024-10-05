import { RegisterOptions, UseFormRegister } from "react-hook-form";

interface SelectProps{
    name: string;
    register: UseFormRegister<any>
    error?: string;
    rules?: RegisterOptions
}

export function Select({name,register,error,rules}: SelectProps){
    return(
        <div>
            <select className="w-full border-2 rounded-md h-11"  {...register(name,rules)} id={name}>
            <option value="carro">Carro</option>
            <option value="moto">Moto</option>
            <option value="caminhao">Caminhão</option>
            </select>
            {error && <p className="text-red-600">{error}</p>}
        </div>
    )
}