import React, { Component } from 'react';
import '../css/Windows.css'
import { SlCheck } from "react-icons/sl";
import UserTasksWindow from './WindowFunctions/Students.js'
import EarnWindow from './WindowFunctions/EarningsWindow.js'
import CalWindow from './WindowFunctions/CalendarWindow.js'

import fetchProfileData from './Http/fetchService.js'; // Adjust the import path based on your file structure
import updateProfile from './Http/profileUpdateService.js'

class ChangeUserName extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            newName: this.props.name
        };
    }

    handleNameChange = (event) => {
        this.setState({ newName: event.target.value });
    };

    handleNameAccept = () => {
        this.props.changeName(this.state.newName);
        this.props.closeEdit();
    };

    render() {
        return (
            <div className="change-user-name">
                <textarea
                    id="nameChange"
                    value={this.state.newName}
                    onChange={this.handleNameChange}
                />
                <SlCheck
                    id="fieldAccept"
                    type="button"
                    onClick={this.handleNameAccept}
                />
            </div>
        );
    }
}

// Main component for displaying and editing the profile
class ProfileWindow extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            id: this.props.id, // Идентификатор профиля (нужно будет получить его из данных профиля, если доступен)
            loginname: 'YourLogin',
            profilename: 'Name',
            profilesurname: 'Surname',
            profiledescription: '',
            editopenName: false,
            editopenSurName: false,
            editopenDescription: false,
            loading: true,
            error: null
        };
        this.changeName = this.changeName.bind(this);
        this.changeSurName = this.changeSurName.bind(this);
        this.changeDescription = this.changeDescription.bind(this);
        this.handleSave = this.handleSave.bind(this); // Привязываем метод сохранения
    }

    async componentDidMount() {
        try {
            const profileData = await fetchProfileData();
            console.log(profileData)
            console.log(profileData);
            if (profileData) {
                this.setState({
                    // Предполагается, что идентификатор профиля доступен в полученных данных, если нет, оставьте как есть
                    id: this.state.id, 
                    profilename: profileData.profile.name || 'Name',
                    profilesurname: profileData.profile.surname || 'Surname',
                    profiledescription: profileData.profile.description || '',
                    loading: false
                });
            } else {
                this.setState({ loading: false, error: 'Failed to load profile data' });
            }
        } catch (error) {
            this.setState({ loading: false, error: error.message });
        }
    }

    changeName(name) {
        this.setState({ profilename: name });
        console.log(name, this.state.profilename);
    }

    changeSurName(name) {
        this.setState({ profilesurname: name });
        console.log(name, this.state.profilesurname);
    }

    changeDescription(description) {
        this.setState({ profiledescription: description });
        console.log(description, this.state.profiledescription);
    }

    async handleSave() {
        const { id, profilename, profilesurname, profiledescription } = this.state;
        try {
            const updateData = await updateProfile(id, profilename, profilesurname, profiledescription);
            if (updateData) {
                console.log('Profile updated successfully:', updateData);
                // Можно добавить логику для уведомления пользователя об успешном обновлении
            } else {
                console.error('Failed to update profile');
            }
        } catch (error) {
            console.error('There was a problem with the save operation:', error);
        }
    }

    render() {
        const { loading, error, loginname, profilename, profilesurname, profiledescription, editopenName, editopenSurName, editopenDescription } = this.state;

        if (loading) {
            return <h2>Loading...</h2>;
        }

        if (error) {
            return <h2>Error: {error}</h2>;
        }

        return (
            <div className='window' id='profilewindow'>
                <div id='sub-window'>
                    <h3 id='profilelogin'>{loginname}</h3>
                    <div id='profilefullname'>
                        <div id='profilename' onClick={() => this.setState({ editopenName: !editopenName })}>
                            {profilename}
                        </div>
                        {editopenName && (
                            <ChangeUserName
                                name={profilename}
                                changeName={this.changeName}
                                closeEdit={() => this.setState({ editopenName: false })}
                            />
                        )}
                        <div id='profilesurname' onClick={() => this.setState({ editopenSurName: !editopenSurName })}>
                            {profilesurname}
                        </div>
                        {editopenSurName && (
                            <ChangeUserName
                                name={profilesurname}
                                changeName={this.changeSurName}
                                closeEdit={() => this.setState({ editopenSurName: false })}
                            />
                        )}
                    </div>
                    <div id='profiledescriptionContainer'>
                        <textarea
                            id='profiledescription'
                            value={profiledescription}
                            readOnly={!editopenDescription}
                            onClick={() => !editopenDescription && this.setState({ editopenDescription: true })}
                            onChange={(e) => this.changeDescription(e.target.value)}
                        />
                        {editopenDescription && (
                            <SlCheck
                                id="fieldAccept"
                                type="button"
                                onClick={() => this.setState({ editopenDescription: false })}
                            />
                        )}
                    </div>
                    <button id='enterbutton' className='icon' onClick={this.handleSave}>Сохранить</button>
                </div>
            </div>
        );
    }
}

class CalendarWindow extends React.Component {
    render(){
        return(
            <div className='window' id='calendarwindow'>
                <CalWindow />
            </div>
        )
    }
}

class StudentsWindow extends React.Component {
    render() {
        return (
            <div className='window' id='studentswindow'>
                <UserTasksWindow id={this.props.id}/>
            </div>
        );
    }
}

class EarningsWindow extends React.Component {
    render(){
        return(
            <div className='window' id='earningswindow'>
                <EarnWindow />
            </div>
        )
    }
}

class Teachers extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            teacher: {
                firstName: 'John',
                lastName: 'Doe',
                description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nulla convallis libero non nunc ultrices, in varius ipsum laoreet. Nulla a odio felis.',
                pdfFiles: [
                    { name: 'File 1', url: '/pdf/file1.pdf', date: '2023-06-01' },
                    { name: 'File 2', url: '/pdf/file2.pdf', date: '2023-06-15' }
                ]
            }
        };
    }

    removeTeacher = () => {
        this.setState({ teacher: null });
    }

    render() {
        const { teacher } = this.state;

        return (
            <div>
                <h1 align="center">Список учителей</h1>
                {teacher ? (
                    <div className="teacher-profile">
                        <div className="teacher-info">
                            <p>Имя: {teacher.firstName}</p>
                            <p>Фамилия: {teacher.lastName}</p>
                            <p>Описание:</p>
                            <p>{teacher.description}</p>
                        </div>
                        <div className="pdf-files">
                            <p>Файлы:</p>
                            <ul>
                                {teacher.pdfFiles.map((file, index) => (
                                    <li key={index}>
                                        <a href={file.url} target="_blank" rel="noopener noreferrer">{file.name}</a>
                                        <span className="file-date">{file.date}</span>
                                    </li>
                                ))}
                            </ul>
                        </div>
                        <button className="remove-button" onClick={this.removeTeacher}>Удалить преподавателя</button>
                    </div>
                ) : (
                    <p align="center">Преподаватель удален.</p>
                )}
            </div>
        );
    }
}


class TrainingRequests extends Component {
    constructor(props) {
      super(props);
      this.state = {
        requests: [],
      };
    }
  
    componentDidMount() {
      this.fetchRequests();
    }
  
    fetchRequests = () => {
      fetch(`http://26.193.156.41:5000/get_emailbox/${this.props.id}`)
        .then((response) => {
          if (!response.ok) {
            throw new Error('Network response was not ok');
          }
          return response.json();
        })
        .then((data) => {
          console.log('Server response:', data);
          // Assuming data is an array of strings (emails)
          const requestsWithIds = data.map((email, index) => ({ id: index, email, status: 'pending' }));
          this.setState({ requests: requestsWithIds });
        })
        .catch((error) => {
          console.error('There was a problem with the fetch operation:', error);
        });
    };
  
    handleAccept = (id, email) => {
      // Update status locally
      this.setState((prevState) => ({
        requests: prevState.requests.map((req) =>
          req.id === id ? { ...req, status: 'accepted' } : req
        ),
      }));
  
      // Send accept request to server
      fetch(`http://26.193.156.41:5000/permission_response_yes/${this.props.id}/${email}`, {
        method: 'GET',
      }).then(response => {
        if (!response.ok) {
          throw new Error('Failed to update server');
        }
        // Optionally handle success response
      }).catch(error => {
        console.error('Failed to update server:', error);
        // Rollback local state if necessary
        this.setState((prevState) => ({
          requests: prevState.requests.map((req) =>
            req.id === id ? { ...req, status: 'pending' } : req
          ),
        }));
      });
    };
  
    handleReject = (id, email) => {
      // Update status locally
      this.setState((prevState) => ({
        requests: prevState.requests.map((req) =>
          req.id === id ? { ...req, status: 'rejected' } : req
        ),
      }));
  
      // Send reject request to server
      fetch(`http://26.193.156.41:5000/permission_response_no/${this.props.id}/${email}`, {
        method: 'GET',
      }).then(response => {
        if (!response.ok) {
          throw new Error('Failed to update server');
        }
        // Optionally handle success response
      }).catch(error => {
        console.error('Failed to update server:', error);
        // Rollback local state if necessary
        this.setState((prevState) => ({
          requests: prevState.requests.map((req) =>
            req.id === id ? { ...req, status: 'pending' } : req
          ),
        }));
      });
    };
  
    render() {
      return (
        <div>
          <h1 className="main-title">Список запросов на обучение</h1>
          <div className="training-requests">
            <ul>
              {this.state.requests.map((request) => (
                <li key={request.id} className={`request ${request.status}`}>
                  <div className="request-info">
                    <p>
                      <strong>Почта:</strong> {request.email}
                    </p>
                  </div>
                  <div className="request-actions">
                    {request.status === 'pending' && (
                      <>
                        <button
                          className="accept-button"
                          onClick={() => this.handleAccept(request.id, request.email)}
                        >
                          Принять
                        </button>
                        <button
                          className="reject-button"
                          onClick={() => this.handleReject(request.id, request.email)}
                        >
                          Отклонить
                        </button>
                      </>
                    )}
                    {request.status === 'accepted' && (
                      <p className="status accepted">Принято</p>
                    )}
                    {request.status === 'rejected' && (
                      <p className="status rejected">Отклонено</p>
                    )}
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>
      );
    }
  }

const Windows = {ProfileWindow, CalendarWindow, StudentsWindow, EarningsWindow,Teachers,TrainingRequests}
export default Windows