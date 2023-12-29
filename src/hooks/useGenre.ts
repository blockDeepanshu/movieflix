import { useEffect } from "react";
import { GENERES } from "../utils/constant";




interface Movie {
    id: number;
    title: string;
    genre_ids:number[]
  }

export const useGenere=(movieList:Movie[])=>{

const data=movieList.map(movie=>{
   
   const newArr:string[]=[]
    movie.genre_ids.forEach((item)=>{
       newArr.push(GENERES[item.toString()])
    })

    movie.genre_ids=newArr

    return movie
})

return data


}