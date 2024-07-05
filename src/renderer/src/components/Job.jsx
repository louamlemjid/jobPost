 function Job(prop){
    return (
        <div>
            <h2>{prop.name}</h2>
            <p>{prop.date}</p>
            <h3>{prop.poste}</h3>
            <p>{prop.country}</p>
            <p>{prop.coverLetter}</p>
        </div>
    )
}
export default Job;