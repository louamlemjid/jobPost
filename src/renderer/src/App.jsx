import Versions from './components/Versions'
import electronLogo from './assets/electron.svg'
import React, { useEffect,useState } from 'react'
import "98.css"
import cat from './assets/cat.gif'
import cat2 from './assets/cat.jpeg'
function App() {
  const [data,setData]=useState({
    company:'',
    date:'',
    country:'',
    coverLetter:'',
    poste:''
  })
  const [data2,setData2]=useState({
    company2:'',
    date2:'',
    country2:'',
    poste2:''
  })
  const [jobPostes,setJobPostes]=useState([])
  function dateToString(date){
    return `${date.getDate()}-${date.getMonth()+1}-${date.getFullYear()}`
  }

  useEffect(()=>{
    window.electron.ipcRenderer.on('jobs',(event,jobs)=>{
      // let {id,country,name,poste,posteDate,coverletter}=jobs
      console.log(jobs)
      setJobPostes(jobs)
      
    })
  })
  console.log(jobPostes)
  const handleChange=(event)=>{
    const { name, value } = event.target;
        setData({ ...data, [name]: value });
  }
  const handleSubmit=(event)=>{
    event.preventDefault();
    console.log(data)
    window.electron.ipcRenderer.send('add-poste',data)
    
  }

  const handleChange2=(event)=>{
    const { name, value } = event.target;
        setData2({ ...data2, [name]: value });
  }
  const handleSubmit2=(event)=>{
    event.preventDefault();
    console.log(data2)
    window.electron.ipcRenderer.send('jobs',data2)
  }
  const handleRadioChange=(event,jobPosteId)=>{
    const selectedId = event.target.id;

    // Prepare the data to send to the backend
    const data = {
      jobPosteId: jobPosteId,
      selectedStatus: selectedId
    };
    window.electron.ipcRenderer.send('update-poste',data)
  }
  const handleDelete=(event,jobPosteId)=>{
    window.electron.ipcRenderer.send('delete-poste',jobPosteId)
    window.electron.ipcRenderer.send('jobs',data2)
  }
  return (
    <>
    <section>
    <div className='forms'>
      <img src={cat} alt="blue cat entertaimnment" width={80} style={{margin:"auto"}}/>
    <form onSubmit={handleSubmit}>
    <input type="text" name='company' id='company' placeholder='company' 
    value={data.company} onChange={handleChange}/>
    <input type="text" name='poste' id='poste' placeholder='poste'
    value={data.poste} onChange={handleChange}/>
    <input type='date' name='date' id='date' 
    value={data.date} onChange={handleChange}/>
    <input type="text" name='country' id='country' placeholder='country' 
    value={data.country} onChange={handleChange}/>
    <textarea rows={7} type="text" className='field-row-stacked' id='coverLetter' name='coverLetter'
    placeholder='cover letter'
    value={data.coverLetter} onChange={handleChange}/>
    <button type='submit'>zid'ha</button>
    </form>
    <form className='form2' onSubmit={handleSubmit2}>
    <input type="text" name='company2' id='company2' placeholder='company' 
    value={data.company2} onChange={handleChange2}/>
    <input type="text" name='poste2' id='poste2' placeholder='poste'
    value={data.poste2} onChange={handleChange2}/>
    <input type='date' name='date2' id='date2' 
    value={data.date2} onChange={handleChange2}/>
    <input type="text" name='country2' id='country2' placeholder='country' 
    value={data.country2} onChange={handleChange2}/>
    <button type='submit'>lawej</button>
    </form>
    </div>
    <div className='table'>
    {jobPostes.map((jobPoste,index)=>(
      <div key={index} className='job'>
        {console.log(jobPoste.admission)}
        
        <input type="radio" name={`admission${jobPoste.id}`} id={`null${jobPoste.id}`}
        defaultChecked={jobPoste.admission === null || "null"}
        onChange={(event) => handleRadioChange(event, jobPoste.id)}  />
        <label for={`null${jobPoste.id}`}>pending</label>
        
        <input type="radio" name={`admission${jobPoste.id}`} id={`rejected${jobPoste.id}`}
        defaultChecked={jobPoste.admission === "rejected"} 
        onChange={(event) => handleRadioChange(event, jobPoste.id)}/>
        <label for={`rejected${jobPoste.id}`}>rejected</label>

        <input type="radio" name={`admission${jobPoste.id}`} id={`accepted${jobPoste.id}`}
        defaultChecked={jobPoste.admission === "accepted"}  
        onChange={(event) => handleRadioChange(event, jobPoste.id)}/>
        <label for={`accepted${jobPoste.id}`}>accepted</label>

        <h4>{`${jobPoste.name}`}</h4>
        <h5>{jobPoste.postedate?dateToString(jobPoste.postedate):null}</h5> 
        <p>{jobPoste.poste}</p>
        <p>{jobPoste.country}</p>
        <p>{jobPoste.coverletter}</p>
        <button onClick={()=>handleDelete(event,jobPoste.id)}>fassakh </button>
      </div>
    ))}
    </div>
    </section>
    </>
  )
}

export default App

