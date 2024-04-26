import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const UserHomePage = () => {
  const navigate = useNavigate();

  const [projects, setProjects] = useState([]);
  const [myProjects, setMyProjects] = useState([]);
  const [email, setEmail] = useState("");

  useEffect(() => {
    fetch("/api/me", { method: "GET" })
      .then(res => {
        if (res.status >= 400 && res.status < 500) {
          navigate("/user/register");
          return Promise.reject('Unauthorized, redirecting...');
        }
        return res.json();
      })
      .then(data => {
        setEmail(data.email);
      })
      .catch(error => console.error("Fetch error:", error));
  }, [navigate]);

  // Fetch projects once email is set
  useEffect(() => {
    if (email) {
      getProjectsList();
    }
  }, [email]);

  const handleCreateNewProject = () => {
    // Navigate to the project list page
    navigate("/user/create-project");
  };

  const handleDelete = (projectId) => {
    fetch(`/api/project/${projectId}`, {
      method: 'DELETE',
    })
      .then(() => { getProjectList(); })
      .catch((error) => {
        console.error('Error:', error);
      });
  };

  function getProjectsList() {
    fetch("/api/projects")
      .then((response) => response.json())
      .then((data) => {
        setProjects(data);
      });
    if (!email) {
      console.error("Email not set, cannot fetch projects");
      return;
    }
    fetch(`/api/manager/projects/${email}`)
      .then((response) => response.json())
      .then((data) => {
        setMyProjects(data);
      });
  }

  return (
    <div className="container mt-4">
      <div className="mb-4">
        <h3>My projects</h3>
        <table className="table">
          <thead>
            <tr>
              <th>Project ID</th>
              <th>Project Name</th>
              <th>Description</th>
              <th>Project Manager</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {myProjects.map((project) => (
              <tr key={project.projectId} onClick={() => navigate(`/user/project/${project.projectId}`)}>
                <td>{project.projectId}</td>
                <td>{project.projectName}</td>
                <td>{project.projectDescription}</td>
                <td>{project.projectManager}</td>
                <td>
                <button onClick={(e) => { e.stopPropagation(); handleDelete(project.projectId); }} className="btn btn-danger">Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        <button onClick={handleCreateNewProject} className="btn btn-primary">Create New Project</button>
      </div>
      <div>
        <h3>All Projects</h3>
        <table className="table">
          <thead>
            <tr>
              <th>Project ID</th>
              <th>Project Name</th>
              <th>Description</th>
              <th>Project Manager</th>
            </tr>
          </thead>
          <tbody>
            {projects.map((project) => (
              <tr key={project.projectId}>
                <td>{project.projectId}</td>
                <td>{project.projectName}</td>
                <td>{project.projectDescription}</td>
                <td>{project.projectManager}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default UserHomePage;
