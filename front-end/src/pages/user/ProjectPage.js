import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import 'bootstrap/dist/css/bootstrap.min.css';

const ProjectPage = () => {
    const navigate = useNavigate();
    const { projectId } = useParams();
    const [project, setProject] = useState([]);
    const [users, setUsers] = useState([]);

    // Fetch project details and users
    useEffect(() => {
        fetchProject();
    }, [projectId]);

    useEffect(() => {
        if (Object.keys(project).length > 0) {
            fetchUsers();
        }
    }, [project]);

    // Function to fetch project details and users
    const fetchProject = () => {
        fetch(`/api/project/${projectId}`)
        .then(res => res.json())
        .then(data => {
            setProject(data);
            console.log("project data", data);
        })

        .catch(error => console.error('Error fetching project:', error));
    };

    const fetchUsers = () => {
        console.log("project data", project);
        fetch("/api/users")
            .then(res => res.json())
            .then(allEmails => {
                const filteredEmails = allEmails.filter(email => 
                    email !== project.projectManager && 
                    !(project.members || []).includes(email)
                );
                setUsers(filteredEmails);
            })
            .catch(error => console.error('Error fetching users:', error));
    };


    const assignUserToProject = (userEmail) => {
        console.log(`Assigning ${userEmail} to project ${projectId}`);
        fetch(`/api/project/${projectId}/assign`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ userEmail })
        })
        .then(response => response.json())
        .then(data => {
            console.log('Success:', data);
            // Refresh the project details and user list after successful assignment
            fetchProject();
            fetchUsers();
        })
        .catch(error => {
            console.error('Error assigning user:', error);
        });
    };

    const removeUserFromProject = (memberEmail) => {
        fetch(`/api/project/${projectId}/member/${memberEmail}`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
            },
        })
        .then(response => response.json())
        .then(() => {
            fetchProject();
            fetchUsers(); 
        })
        .catch(error => console.error('Error removing user:', error));
    };

    return (
        <div className="container mt-3">
            <h1 className="mb-3">{project.projectName || 'Project Details'}</h1>
            <p>{project.projectDescription || 'No description available.'}</p>
            <button className="btn btn-primary" onClick={() => navigate(`/user/project/${projectId}/create-task`)}>Create Task</button>
            <div className="mt-4">
                <h2 className="mb-2">Project members</h2>
                <ul className="list-group">
                {project.members && project.members.map((email, index) => (
                    <li key={index} className="list-group-item d-flex justify-content-between align-items-center">
                    {email}
                    <button className="btn btn-danger" onClick={() => removeUserFromProject(email)}>Remove from Project</button>
                    </li>
                ))}
                </ul>
            </div>
            <div>
                <h2 className="mb-2">Assignable Users</h2>
                <ul className="list-group">
                    {users.map((email, index) => (
                        <li key={index} className="list-group-item d-flex justify-content-between align-items-center">
                            {email}
                            <button className="btn btn-primary" onClick={() => assignUserToProject(email)}>Assign to Project</button>
                        </li>
                    ))}
                </ul>
            </div>
            <div>
                <h2 className="mb-2">Tasks</h2>
            </div>
        </div>
    );
};

export default ProjectPage;
