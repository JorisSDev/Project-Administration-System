import React, { useState } from 'react';

const TaskCreatePage = () => {
    const [taskName, setTaskName] = useState('');
    const [taskDescription, setTaskDescription] = useState('');
    const [file, setFile] = useState(null);

    const handleTaskNameChange = (e) => {
        setTaskName(e.target.value);
    };

    const handleTaskDescriptionChange = (e) => {
        setTaskDescription(e.target.value);
    };

    const handleFileChange = (e) => {
        setFile(e.target.files[0]);
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        // Add your logic here to handle task creation
        console.log('Task name:', taskName);
        console.log('Task description:', taskDescription);
        console.log('Attached file:', file);
        // Reset the form
        setTaskName('');
        setTaskDescription('');
        setFile(null);
    };

    return (
        <div className="container">
            <h1 className="mb-3">Create Task</h1>
            <form onSubmit={handleSubmit}>
                <div className="mb-3">
                    <label className="form-label">Task Name:</label>
                    <input type="text" className="form-control" value={taskName} onChange={handleTaskNameChange} />
                </div>
                <div className="mb-3">
                    <label className="form-label">Task Description:</label>
                    <textarea className="form-control" value={taskDescription} onChange={handleTaskDescriptionChange} />
                </div>
                <div className="mb-3">
                    <label className="form-label">Attach File:</label>
                    <input type="file" className="form-control" onChange={handleFileChange} />
                </div>
                <button type="submit" className="btn btn-primary">Create</button>
            </form>
        </div>
    );
};

export default TaskCreatePage;