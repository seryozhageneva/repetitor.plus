import { CgAlbum,CgAlignBottom,CgProfile,CgUserList,CgLogOut } from 'react-icons/cg'
import { IoMailOutline,IoReload } from "react-icons/io5";

import React, { Component } from 'react';
import '../css/MenuIcons.css'

import changeStud from "./Http/changeStud.js"

class Profile extends React.Component {render(){return (<CgProfile className='icon' id='profile' onMouseUp={
    (opacities = this.props.opacitites) => {
        opacities[0] = 1; opacities[1] = 0; opacities[2] = 0; opacities[3] = 0;
        this.props.changeOpacity(opacities)
    }
}/>)}
}
class Calendar extends React.Component {render(){return (<CgAlbum className='icon' id='calendar'onMouseUp={
    (opacities = this.props.opacitites) => {
        opacities[0] = 0; opacities[1] = 1; opacities[2] = 0; opacities[3] = 0;
        this.props.changeOpacity(opacities)
    }
}/>)}}
class Students extends React.Component {render(){return (<CgUserList className='icon' id='students'onMouseUp={
    (opacities = this.props.opacitites) => {
        opacities[0] = 0; opacities[1] = 0; opacities[2] = 1; opacities[3] = 0;
        this.props.changeOpacity(opacities)
    }
}/>)}}
class Earnings extends React.Component {render(){return (<CgAlignBottom className='icon' id='earnings'onMouseUp={
    (opacities = this.props.opacitites) => {
        opacities[0] = 0; opacities[1] = 0; opacities[2] = 0; opacities[3] = 1;
        this.props.changeOpacity(opacities)
    }
}/>)}}

class Mail extends Component {
    constructor(props) {
      super(props);
      this.state = {
        isModalOpen: false,
        email: '',
        isLoading: false,
        error: null,
      };
    }
  
    toggleModal = () => {
      this.setState({ isModalOpen: !this.state.isModalOpen });
    };
  
    handleEmailChange = (event) => {
      this.setState({ email: event.target.value });
    };
  
    handleSubmit = () => {
      const id = this.props.id; // Пример id, замените на нужное значение
      const id_point = this.state.email; // Используем email как id_point для отправки
  
      if (!id_point) {
        this.setState({ error: 'Почта не указана' });
        return;
      }
  
      this.setState({ isLoading: true, error: null });
  
      // Отправка GET-запроса на сервер
      fetch(`http://26.193.156.41:5000/permission_question/${id}/${id_point}`)
        .then((response) => {
          if (!response.ok) {
            throw new Error('Network response was not ok');
          }
          return response.json();
        })
        .then((data) => {
          console.log('Server response:', data);
          // Можно обработать ответ сервера, если нужно
          this.setState({ isModalOpen: false, email: '', isLoading: false });
        })
        .catch((error) => {
          console.error('There was a problem with the fetch operation:', error);
          this.setState({ error: 'Ошибка при отправке запроса', isLoading: false });
        });
    };
  
    render() {
      const { isModalOpen, email, isLoading, error } = this.state;
  
      return (
        <div className="mail-container">
          <IoMailOutline className="icon" id="mail" onClick={this.toggleModal} />
  
          {isModalOpen && (
            <div className="modal-overlay">
              <div className="modal-content">
                <h2>Отправить запрос на доступ</h2>
                <input
                  id="text-email"
                  type="email"
                  placeholder="Your Email"
                  value={email}
                  onChange={this.handleEmailChange}
                  className="email-input"
                />
                <button onClick={this.handleSubmit} className="submit-button" disabled={isLoading}>
                  {isLoading ? '...' : 'Отправить'}
                </button>
                <button onClick={this.toggleModal} className="close-button">
                  Закрыть
                </button>
                {error && <p className="error-message">{error}</p>}
              </div>
            </div>
          )}
        </div>
      );
    }
  }

class Exit extends React.Component {render(){return (<CgLogOut className='icon' id='exit'/>)}}
class ChangeStud extends React.Component {
    constructor(props) {
        super(props);
        // Привязываем метод к текущему контексту
        this.handleMouseUp = this.handleMouseUp.bind(this);
    }

    async handleMouseUp() {
        try {
            const profileData = await changeStud();

            if (profileData) {
                console.log('Change stud:', profileData);
                // Дополнительная логика для работы с profileData
                this.props.changeStud();
            } else {
                console.log('Failed to change stud.');
            }
        } catch (error) {
            console.error('Error during changeStud operation:', error);
        }
    }

    render() {
        return (
            <IoReload className='icon' id='hide' onMouseUp={this.handleMouseUp} />
        );
    }
}

class TeachersStud extends React.Component {render(){return (<CgUserList className='icon' id='calendar' onMouseUp={
    (opacities = this.props.opacitites) => {
        opacities[0] = 0; opacities[1] = 1; opacities[2] = 0; opacities[3] = 0;
        this.props.changeOpacity(opacities)
    }
}/>)}
}


class TrainingStud extends React.Component {render(){return (<CgAlbum className='icon' id='students' onMouseUp={
    (opacities = this.props.opacitites) => {
        opacities[0] = 0; opacities[1] = 0; opacities[2] = 1; opacities[3] = 0;
        this.props.changeOpacity(opacities)
    }
}/>)}
}
const MenuIcons = {Profile, Calendar, Students, Earnings, Exit, TeachersStud,TrainingStud,Mail,ChangeStud}
export default MenuIcons