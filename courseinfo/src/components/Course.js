const Header = (props) =>{
    return(
  <div>
  <h2>{props.course}</h2>
  </div>
  )
  }
  
  const Part = (props) => {
    return(
  <div>
  {props.part} {props.exercises}
  </div>
  )
  }
  
  const Content = ({parts}) => {
    return(
        <div>
          { parts.map( element => 
            <Part key={element.id} part={element.name} exercises={element.exercises} />
            )
          }
        </div>
      )
    }
  
    const Total = ({parts}) => {
      return(
      <div>
      <br/><b>
      total of {parts.reduce((sum,element) => {
        return sum+element.exercises
      },0)} exercises</b>
      </div>
      )
      }
      
const Course = ({course}) => {
      return (
        <div>
          <Header course={course.name} />
          <Content parts={course.parts}/>
          <Total parts={course.parts}/>
        </div>
      )
    }
    
export default Course