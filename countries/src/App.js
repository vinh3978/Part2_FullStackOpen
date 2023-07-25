import React from 'react';
import {useState, useEffect} from 'react'
import countryService from './countries.js'
import weatherService from './weather.js'
const api_key = process.env.REACT_APP_API_KEY;
// variable api_key now has the value set in startup

<script src="lodash.js"></script>
var _ = require('lodash');


const Find = (props) => {
  return(
    <form>
      <div>
        find countries: <input 
        value={props.newCountry} 
        onChange={props.handleCountryChange}
        />
      </div>
    </form>
  )
}

const ShowOneCountry = ({countriesToShow,weatherControl, setWeatherControl}) => {
  const [weather, setWeather] = useState()
  
  try
  {
  const country = countriesToShow[0]
  var langList=[]

  if (weatherControl) {
  weatherService
            .getAll(country,api_key)
            .then(initialWeather => {
            setWeather(initialWeather)
            setWeatherControl(false)
            console.log(initialWeather)
            console.log(`weatherControl=${weatherControl}`)
          })
        }
    
   Object.keys(country.languages).forEach((key) => {
     langList = langList.concat(country.languages[key])
     }
   )

   
   
  
  

  return(
      <>
       <h1>{country.name.common}</h1>
       capital {country.capital}<br/>
       area {country.area}<br/>
       <h2>languages:</h2>
       <ShowLanguages langList={langList} />
       <img src={country.flags.png} />
       <h2>Weather in {country.capital}: {weather.list[0].weather[0].description} </h2>
       <>temperature: {Math.round((weather.list[0].main.temp-273.15)*10)/10}˚C</>
       <br/>
       <img src={`https://openweathermap.org/img/wn/${weather.list[0].weather[0].icon}@2x.png`} />
       <br/>
       <>wind: {weather.list[0].wind.speed} m/s</>
       </>
     )
    } catch (error){
      return('')
    }
   }


const Show = ({countriesToShow, weatherControl, setWeatherControl}) => {
  

  

  return  countriesToShow.length > 10 ?
  <>
  Too many countries, please specify
  </>
  : countriesToShow.length === 1 ?
  <>
  <ShowOneCountry countriesToShow={countriesToShow} weatherControl={weatherControl} setWeatherControl={setWeatherControl}/>
  </>
  : <>
  <ShowManyCountries countriesToShow={countriesToShow} weatherControl={weatherControl} setWeatherControl={setWeatherControl}/>
  </>
  
}




const ShowManyCountries = ({countriesToShow, weatherControl, setWeatherControl}) => {
  const [chosenCountry, setChosenCountry] = useState([])
  return(
    <>
    {countriesToShow.map((country) => {
      return(
        <>
        {country.name.common}
        <button onClick ={() =>{
          setWeatherControl(true)
          _.isEqual(chosenCountry,[country]) ?
          setChosenCountry([])
          : setChosenCountry([country])
        }} >{ _.isEqual(chosenCountry,[country]) ? 'unshow' : 'show'}</button>
        
        <br/>
        </>
      )
  
    })}
    <ShowOneCountry countriesToShow={chosenCountry} weatherControl={weatherControl} setWeatherControl={setWeatherControl} />
    </>
  )
}

const ShowLanguages = ({langList}) =>{
  return(
    <>
    {langList.map((lang) => {
      return(
        <ul>{lang}</ul>
      )
    })}
    </>
  )
}



const App = () => {
  const [newSearch, setSearch] = useState('')
  const [countries, setCountries] = useState([])
  const [weatherControl, setWeatherControl] = useState(false)

  useEffect(() => {
    countryService
      .getAll()
      .then(initialCountries => {
        setCountries(initialCountries)
      })
  },[])


  const handleCountryChange = (event) =>{
    setSearch(event.target.value)
    console.log(`${newSearch}`)

    countriesToShow.length === 1 ?
    setWeatherControl(true)
    :console.log(`weatherControl=${weatherControl}`)
  }

  const countriesToShow = _.isEqual(newSearch,'') 
  ? []
  : countries.filter(country =>country.name.common.toLowerCase().match(newSearch.toLowerCase()))
 

  return (
    <div>
    <Find newCountry={newSearch} handleCountryChange={handleCountryChange} />
    <Show countriesToShow ={countriesToShow} weatherControl={weatherControl} setWeatherControl={setWeatherControl} />
    </div>
  )
}

export default App;
