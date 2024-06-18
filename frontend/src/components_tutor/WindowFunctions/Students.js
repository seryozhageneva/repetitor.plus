import React from 'react';
import { CgAddR, CgRemoveR } from "react-icons/cg";
import fetchUserData from '../Http/studentsService.js'; // Import function to load data

class UserTasksWindow extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            users: [],
            username: '',
            task: '',
            loading: true,
            error: null
        };
    }

    async componentDidMount() {
        try {
            const users = await fetchUserData();
            if (users) {
                this.setState({ users, loading: false });
            } else {
                this.setState({ loading: false, error: 'Failed to load user data' });
            }
        } catch (error) {
            this.setState({ loading: false, error: error.message });
        }
    }

    handleUserChange = (event) => {
        this.setState({ username: event.target.value });
    }

    handleTaskChange = (event) => {
        this.setState({ task: event.target.value });
    }

    addUser = async () => {
        if (this.state.username) {
            // Update state optimistically
            const newUser = { email: this.state.username, tasks: [] };
            this.setState((prevState) => ({
                users: [...prevState.users, newUser],
                username: ''
            }));

            // Call student_verify_route after adding user
            try {
                const response = await fetch(`http://26.193.156.41:5000/student_verify/${this.props.id}/${encodeURIComponent(newUser.email)}`, {
                    method: 'GET'
                });
                if (!response.ok) {
                    throw new Error('Failed to verify student');
                }
                const data = await response.json();
                if (!data.result) {
                    console.warn('Student verification failed:', data);
                    // Rollback local state if the student is not verified
                    this.setState((prevState) => ({
                        users: prevState.users.filter(user => user.email !== newUser.email)
                    }));
                }
            } catch (error) {
                console.error('Failed to verify student:', error);
                // Rollback local state in case of an error
                this.setState((prevState) => ({
                    users: prevState.users.filter(user => user.email !== newUser.email)
                }));
            }
        }
    }

    assignTask = (userIndex) => {
        if (this.state.task) {
            this.setState((prevState) => {
                const users = [...prevState.users];
                users[userIndex].tasks.push(prevState.task);
                return { users, task: '' };
            });
        }
    }

    deleteUser = async (userIndex) => {
        const userEmail = this.state.users[userIndex].email;

        // Log the attempt to delete a user
        console.log(`Attempting to delete user: ${userEmail}`);

        // Remove the user optimistically
        const removedUser = this.state.users[userIndex];
        this.setState((prevState) => {
            const users = [...prevState.users];
            users.splice(userIndex, 1); // Remove the user from the list immediately
            return { users };
        });

        // Call prepod_delete_stud_route to delete the student
        try {
            const response = await fetch(`http://26.193.156.41:5000/prepod_delete_stud/${this.props.id}/${encodeURIComponent(userEmail)}`, {
                method: 'GET'
            });

            if (!response.ok) {
                throw new Error('Failed to delete student');
            }

            const data = await response.json();
            console.log('Server response:', data); // Log server response

            if (data.result) {
                console.log('Student deleted successfully:', userEmail); // Log successful deletion
            } else {
                console.warn('Student deletion failed:', data);
                // If deletion failed, restore the user
                this.setState((prevState) => ({
                    users: [...prevState.users.slice(0, userIndex), removedUser, ...prevState.users.slice(userIndex)]
                }));
            }
        } catch (error) {
            console.error('Failed to delete student:', error);
            // If there was an error, restore the user
            this.setState((prevState) => ({
                users: [...prevState.users.slice(0, userIndex), removedUser, ...prevState.users.slice(userIndex)]
            }));
        }
    }

    deleteTask = (userIndex, taskIndex) => {
        this.setState((prevState) => {
            const users = [...prevState.users];
            users[userIndex].tasks.splice(taskIndex, 1);
            return { users };
        });
    }

    handleTaskEdit = (userIndex, taskIndex, event) => {
        const newTaskValue = event.target.value;
        this.setState((prevState) => {
            const users = [...prevState.users];
            users[userIndex].tasks[taskIndex] = newTaskValue;
            return { users };
        });
    }

    render() {
        const { loading, error, users, username, task } = this.state;

        if (loading) {
            return <h2>Loading...</h2>;
        }

        if (error) {
            return <h2>Error: {error}</h2>;
        }

        return (
            <div className='window' id='usertaskswindow'>
                <h2>Список учеников</h2>
                <div className='add-user'>
                    <input 
                        type='text' 
                        value={username} 
                        onChange={this.handleUserChange} 
                        placeholder='Email'
                    />
                    <CgAddR className='icon-button add-icon' onClick={this.addUser} title="Добавить пользователя"/>
                </div>
                <div className='user-list'>
                    {users.map((user, userIndex) => (
                        <div key={userIndex} className='user'>
                            <h2>{user.email}</h2>
                            <ul>
                                {user.tasks.map((task, taskIndex) => (
                                    <li key={taskIndex} className='task-item'>
                                        <textarea 
                                            value={task}
                                            onChange={(event) => this.handleTaskEdit(userIndex, taskIndex, event)}
                                        ></textarea>
                                        <CgRemoveR 
                                            className='icon-button delete-task-icon' 
                                            onClick={() => this.deleteTask(userIndex, taskIndex)}
                                            title="Удалить задание"
                                        />
                                    </li>
                                ))}
                            </ul>
                            <div className='task-input'>
                                <input 
                                    type='text' 
                                    value={task} 
                                    onChange={this.handleTaskChange} 
                                    placeholder='Задание' 
                                />
                                <CgAddR className='icon-button add-icon' onClick={() => this.assignTask(userIndex)} title="Назначить задание"/>
                            </div>
                            <CgRemoveR className='icon-button delete-user-icon' onClick={() => this.deleteUser(userIndex)} title="Удалить пользователя"/>
                        </div>
                    ))}
                </div>
            </div>
        );
    }
}

export default UserTasksWindow;
