import {useState, useEffect} from 'react'
import axios from 'axios'
import personService from './services/persons'

<script src="lodash.js"></script>
var _ = require('lodash');

const ErrorNotification = ({message}) => {

  const notificationStyle ={ 
      color: 'red',
      background: 'lightgrey',
      fontSize: 20,
      borderStyle: 'solid',
      borderRadius: 5,
      padding: 10,
      marginBottom: 10,
  }

  if (message===null){
    return null
  }
  return (
    <div style = {notificationStyle}>
      {message}
    </div>
  )
}

const Notification = ({message}) => {

  const notificationStyle ={ 
      color: 'green',
      background: 'lightgrey',
      fontSize: 20,
      borderStyle: 'solid',
      borderRadius: 5,
      padding: 10,
      marginBottom: 10,
  }

  if (message===null){
    return null
  }
  return (
    <div style = {notificationStyle}>
      {message}
    </div>
  )
}

const Contact = ({name, number, handleDelete}) => {
  return (
      <>
      {name} {number}   {<button onClick={handleDelete} >delete</button>} 
      
      <br/>
      </>
  )
}

const Filter = (props) =>{
  return (
  <form>
      <div>
        filter shown with <input
        value={props.newSearch}
        onChange={props.handleSearch}
        />
      </div>
  </form>
  )
}

const PersonForm = (props) => {
  return(
    <form onSubmit={props.addContact}>
    <div>
      name: <input 
      value={props.newName} 
      onChange={props.handleContactChange}
      />
    </div>
    <div>
      phone: <input
       value={props.newPhone}
       onChange={props.handlePhoneChange}
       />
    </div>
    <div>
      <button type='submit'>add</button>
    </div>
  </form>
  )
}

const Persons = ({contactsToShow, handleDelete}) =>{
  console.log(contactsToShow)
  return (
    <div>
        {contactsToShow.map((person) => {
          return(
          <>
          <Contact key={person.name} name={person.name} number={person.number} handleDelete={() => handleDelete(person.id)} />
          </>
          )
        }
        )
        }
    </div>
  )
}


const App = () => {
  
  const [persons, setPersons] = useState([])
  const [newName, setNewName] = useState('')
  const [newPhone, setNewPhone] = useState('')
  const [newSearch, setSearch] = useState('')
  const [message, setMessage] = useState(null)
  const [errorMessage, setError] = useState(null)

  useEffect(() => {
    console.log('Effect')
    personService
      .getAll()
      .then(initialPersons => {
        setPersons(initialPersons)
      })

  },[])

  console.log('render', persons.length,'persons')
  console.log(persons)


  const addContact = (event) =>{
    event.preventDefault()
    const nameObject = {
      name: newName,
      number: newPhone
    }

  const check = persons.some(person => 
      {
        console.log(`${person.name} compare with ${nameObject.name} results in ${_.isEqual(person.name,nameObject.name)}`)
        return _.isEqual(person.name,nameObject.name)
      }
      ) 
  
  
    check ?  
      window.confirm(`${nameObject.name} is already added to the phonebook, replace the old phone number with a new one?`) ?   
      personService
        .update(persons.find(person => _.isEqual(person.name,nameObject.name)).id,nameObject)
        .then(returnedPerson => {
          setPersons(persons.map(person => _.isEqual(person.name,nameObject.name) ? returnedPerson : person))
          setMessage(`Changed ${returnedPerson.name}'s phone number`)
          setTimeout(() =>{
            setMessage(null)
          }, 3000)
          setNewName('')
          setNewPhone('') 
        })
        .catch((error) => {
          setError(
            `${nameObject.name} has already been removed from server`
          )
          setTimeout(() =>{
            setError(null)
          }, 3000)
          personService
          .getAll()
          .then(initialPersons => {
            setPersons(initialPersons)
      })
          console.log('ERROR -  the requested command failed')
        })
      : console.log(``)
    
    : personService
      .create(nameObject)
      .then(
        returnedPerson => {
          setPersons(persons.concat(returnedPerson))
          setTimeout(() =>{
            setMessage(null)
          }, 3000)
          setMessage(`Added ${returnedPerson.name}`)
          setNewName('')
          setNewPhone('')
        }
      )
    
    
  }



  const handleContactChange = (event) => {
    setNewName(event.target.value)
  }

  const handlePhoneChange = (event) => { 
    setNewPhone(event.target.value)
  }

  const handleSearch = (event) =>{
    setSearch(event.target.value)
    console.log(newSearch)

  }
  
  const handleDelete = (id) =>{
    console.log(`delete ${id}`)
    var deleteName = persons.find(x=>x.id === id).name
    window.confirm(`Delete ${deleteName} ?`) ? 
    personService
     .eliminate(id)
     .then(() => {
      setPersons(persons.filter(person => person.id !== id))
      setMessage(`Deleted ${deleteName}'s phone number`)
      setTimeout(() =>{
            setMessage(null)
          }, 3000)
     })
     
    : console.log(`cancel`)

    console.log('handleDelete done')
    
  }

  const contactsToShow = _.isEqual(newSearch,'')
    ? persons
    : persons.filter(person =>person.name.toLowerCase().match(newSearch.toLowerCase()))

  
  return (
    <div>
      <h2>Phonebook</h2>
      <Notification message={message} />
      <ErrorNotification message={errorMessage} />
      <Filter newSearch={newSearch} handleSearch={handleSearch} />
      <h2>add a new</h2>
      <PersonForm addContact={addContact} newName={newName} handleContactChange={handleContactChange} newPhone={newPhone} handlePhoneChange={handlePhoneChange} />
      <h2>Numbers</h2>
      <Persons contactsToShow={contactsToShow} handleDelete={handleDelete} />
    </div>
  )
}

export default App