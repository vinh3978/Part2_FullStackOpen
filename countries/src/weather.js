import axios from 'axios'
const baseUrl = "https://api.openweathermap.org/data/2.5/forecast?"

const getAll = (country, api_key) =>{
    console.log('in weather.js')
    console.log(country.capital[0])
    const request = axios.get(`${baseUrl}q=${country.capital[0]},${country.cca2}&appid=${api_key}`)
   return request.then(response => response.data)
}

export default {getAll}