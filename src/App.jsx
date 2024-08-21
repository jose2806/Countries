import { useEffect,useState } from "react"
import axios from 'axios'

const App = () =>{
  const [allCountries,setAllCountries] = useState([])
  const [filter,setFilter] = useState('')
  const [selectedCountry, setSelectedCountry] = useState(null);
  const [wheater,setWeather] = useState(null)

  const handleEventFilter = (event) =>{
    setSelectedCountry(null)
    setFilter(event.target.value)
  }

  useEffect(() =>{
    axios.get('https://studies.cs.helsinki.fi/restcountries/api/all')
    .then(response => {
      setAllCountries(response.data)
    })     
  },[])

  useEffect((lat,lon) => {
    const key ='a2da13af2773925ea537a0150e1c17b4'
    axios.get(`https://api.openweathermap.org/data/3.0/onecall?lat=${lat}&lon=${lon}&appid=${key}`)
  .then(response => {
    setWeather(response.data)
    console.log(response.data);
  })
  },[])

  const filteredCountries = allCountries.filter(country => country.name.common.toLowerCase().includes(filter.toLowerCase()))

  const handleShow = (country) =>{
    setSelectedCountry(country)
    setFilter('')

  }

  return (
    <div>
      <h3>Find countries <input value={filter || ''} onChange={handleEventFilter} /></h3>
      <ul>
       { 
        filteredCountries.length > 10 && filter?(
        <p>Too many matches, specify another filter</p>        
        ):
          filteredCountries.length <= 10 && filteredCountries.length > 1 ?(
          filteredCountries.slice(0,10).map(country => (
            <li key={country.name.common}>{country.name.common} <button  onClick={() => handleShow(country)}>Show</button></li>   
          ))): 
          filteredCountries.length === 1 && filter ? (
            filteredCountries.map(country =>(
              <>
              <h3>{country.name.common}</h3>
              <p>Capital: {country.capital}</p>
              <p>Area: {country.area}</p>
              <ul>
              {Object.values(country.languages).map((language) =>(    
                <li key={language}>{language}</li>
              ))}              
            </ul>
            <div>
              <br />
            <img src={country.flags.png} alt={country.name.common} style={{ width: "100px", height: "auto" }} />
            <h3>Weather in {country.name.common}</h3>
              
            </div>
          </>
            )))
          :(null)
          
          }
          </ul>
          {
          selectedCountry &&(
            <>
              <li key={selectedCountry.name.common}>{selectedCountry.name.common}</li>
              <p>Capital: {selectedCountry.capital}</p>
              <p>Area: {selectedCountry.area}</p>
              <ul>
                {Object.values(selectedCountry.languages).map((language) =>(    
                  <li key={language}>{language}</li>
                ))}              
              </ul>
              <div>
                <br />
              <img src={selectedCountry.flags.png} alt={selectedCountry.name.common} style={{ width: "100px", height: "auto" }} />
              </div>
            </>
          )}
    </div>
  )
}

export default App