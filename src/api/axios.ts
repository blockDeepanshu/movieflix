import axios from 'axios'



export const getMovies= async( movieYear:number=2012)=>{
    const response=await axios.get(`https://api.themoviedb.org/3/discover/movie?api_key=2dca580c2a14b55200e784d157207b4d&sort_by=popularity.desc&primary_release_year=${movieYear}&page=1&vote_count.gte=100`)

    return response.data

}