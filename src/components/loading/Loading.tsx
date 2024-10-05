import loadingSpinner from '../../assets/tube-spinner.svg'

export function Loading(){
    return(
        <div className='flex items-center justify-center w-full'>
            <img src={loadingSpinner} alt="loadingSpinner" className='w-1/2' />
        </div>
    )
}