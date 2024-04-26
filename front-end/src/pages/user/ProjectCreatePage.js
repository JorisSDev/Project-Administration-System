import React, { useState, useEffect } from 'react';

const ProjectCreatePage = () => {
  const [projectName, setProjectName] = useState('');
  const [projectDescription, setProjectDescription] = useState('');
  const [error, setError] = useState('');
  const [email, setEmail] = useState("");

  useEffect(() => {
    fetch("/api/me", {
      method: "GET",
    }).then((res) => {
      if (res.status >= 400 && res.status < 500) {
        navigate("/user/register");
        return;
      }
      if (res.status >= 200 && res.status < 300) {
        res.json().then((body) => setEmail(body.email));
      }
    });
  }, []);

  const handleSubmit = (event) => {
    event.preventDefault();
  
    // Create a new project object
    const newProject = {
      projectName,
      projectDescription,
      projectManager: email, 
    };
    if(!projectName || !projectDescription) {
        setError("Please fill in all fields");
        return;
    }
    // Send a POST request to the /join endpoint
    fetch('/api/project', {
        method: 'POST',
        headers: {
        'Content-Type': 'application/json',
        },
        body: JSON.stringify(newProject),
    })
    .then((response) => response.json())
    .then((data) => {
        console.log('Success:', data);
        setError("Succesfully created project")
    })
    .catch((error) => {
        setError(error.message);
    });
    
  };

  return (
    <div className="container">
        <div className="row col">
            <h3>Create New Project</h3>
            <form onSubmit={handleSubmit}>
                <div className="form-group">
                    <label>Project Name</label>
                    <input 
                        type="text" 
                        className="form-control" 
                        value={projectName} 
                        onChange={(e) => setProjectName(e.target.value)} 
                    />
                </div>
                <div className="form-group">
                    <label>Project Description</label>
                    <input 
                        type="text" 
                        className="form-control" 
                        value={projectDescription} 
                        onChange={(e) => setProjectDescription(e.target.value)} 
                    />
                </div>
                <div>{error ? error : ""}</div>
                <div className="form-group">
                    <button type="submit" className="btn btn-primary">Create Project</button>
                </div>
                <div>
                    <a href="/user/home">Back to Home</a>
                </div>
            </form>
        </div>
    </div>
  );
};

export default ProjectCreatePage;