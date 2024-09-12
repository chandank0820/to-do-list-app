import React,{useState,useEffect} from 'react';
import './App.css';
import '@fortawesome/fontawesome-free/css/all.min.css'; 

function App() {

  const [newTask,setNewTask]=useState('');
  const [tasks,setTasks] = useState([]);
  const [filter,setFilter]=useState('All');
  const [editTaskText,setEditTaskText]=useState('');
  const [editTaskId,setEditTaskId]=useState(null);
 

 
  useEffect(()=>{
    const savedTasks=JSON.parse(localStorage.getItem('tasks'));
    if(savedTasks){
      try{
        setTasks(savedTasks);
      }catch(error){
        console.log("failed to get data from local storage",error);
      }
    }
  },[]);

  useEffect(()=>{
    if(tasks.length>0){
      localStorage.setItem('tasks',JSON.stringify(tasks));
      
    }else{
      localStorage.removeItem('tasks');
    }
   },[tasks]);

  
  const addTask = ()=>{
    if(newTask.trim()===''){
      setNewTask('');
      return; //Checking the empty input validation
    }


    //method to add NewTask
    const newTaskItem={
      id:Date.now(),
      text:newTask,
      completed:false
    };
    setTasks([...tasks,newTaskItem]);
    setNewTask('');
  }

  //save the task again after performing edit on it
  const saveTask=(taskId)=>{
    setTasks(
      tasks.map((task)=>task.id===taskId?{...task,text:editTaskText}:task)
    );
    setEditTaskId(null);
  }

  //Toggling between marking as complete or not complete
  const toggle=(taskId)=>{
    setTasks(
      tasks.map((task)=>task.id===taskId?{...task,completed:!task.completed}:task)
    );
  };

  //Method to delete task
  const deleteTask=(taskId)=>{
    setTasks(tasks.filter((task)=>task.id!==taskId));
  };

  const filteredTasks=tasks.filter((task)=>{
    if(filter==='All') return true;
    if(filter==='Active') return !task.completed;
    if(filter==='Completed') return task.completed;
    
  })

  const editTask=(taskId,text)=>{
    setEditTaskId(taskId);
    setEditTaskText(text);
    
  }

  return (
    
    <div className="App">
      <h1>Add Your List here</h1>

      {/* Input Task*/}
      <div>
        <input
          type="text"
          value={newTask}
          onChange={(e)=>setNewTask(e.target.value)}
          placeholder='Enter new task'
        />
        
        <button onClick={addTask}>Add Task</button>
      </div>

      {/* filtering */}
      
      <div>
      
      <i className="fas fa-hourglass-start">   </i> Filter      
        <button onClick={()=>setFilter('All')}>All</button>
        <button onClick={()=>setFilter('Active')}>Active</button>
        <button onClick={()=>setFilter('Completed')}>Completed</button>
       </div>

      {/* List of Tasks */}

      <ul>
        {
          filteredTasks.map((task)=>(
            <li key={task.id}
            style={{textDecoration:task.completed?'line-through':'',color:task.completed?'green':'red'}}
            >
              {editTaskId===task.id?
              (<div>
                <input
                  type='text'
                  value={editTaskText}
                  onChange={(e)=>setEditTaskText(e.target.value)}
                />
                <button onClick={()=>saveTask(task.id)}>Save</button>
              </div>):(
                <div>
                  <span onClick={()=>toggle(task.id)} style={{cursor:'pointer'}}>
                    {task.text}
                  </span>
                  <button onClick={()=>toggle(task.id)}>{task.completed?"Mark as not completed":"Mark as completed"}</button>
                  <button onClick={()=>editTask(task.id,task.text)}>Edit</button>
                  <button onClick={()=>deleteTask(task.id,task.text)} style={{backgroundcolor:'red'}}>Delete</button>
                </div>
              )}
            </li>
          ))
        }
      </ul>


    </div>
  );
}

export default App;


