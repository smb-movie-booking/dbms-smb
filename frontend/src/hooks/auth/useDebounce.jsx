import { useEffect, useState } from "react"

export const useDebounce=(searchText,delay=500)=>{
    const [debouncedValue,setDebouncedValue]=useState("");
    useEffect(()=>{
        const intervalId=setTimeout(()=>{
            setDebouncedValue(searchText)
        },delay)

        return ()=>clearTimeout(intervalId);
    },[searchText,delay])

    return debouncedValue;
}