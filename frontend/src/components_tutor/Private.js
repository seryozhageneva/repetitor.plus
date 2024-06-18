import React, { useContext, useEffect } from 'react';
import '../css/App.css';
import Header from './Header.js';
import Windows from './Windows.js';
import AuthContext from "../context/AuthProvider.js";
import { useNavigate } from "react-router-dom";
import Cookies from "js-cookie";
import getUrlParameter from './Http/URLextractor.js';
import fetchProfileData from './Http/fetchService.js';

class Private extends React.Component {
    constructor(props) {
        super(props);
        // Получение значения параметра из URL
        const userIdFromUrl = getUrlParameter('userID');
        this.state = {
            stud: false,
            opacities: [0, 0, 0, 0], /*profile, calendar, students, earnings*/
            currentWindow: <h2 id='StartingText'>ВЫБЕРИТЕ ПУНКТ В МЕНЮ СВЕРХУ СЛЕВА</h2>,
            id: userIdFromUrl || "kirill@mail.ru", // Использование значения из URL или значение по умолчанию
            loading: true,
            error: null,
        };
        this.changeOpacity = this.changeOpacity.bind(this);
        this.changeOpacityStud = this.changeOpacityStud.bind(this);
        this.changeStud = this.changeStud.bind(this);
    }

    async componentDidMount() {
        try {
            const profileData = await fetchProfileData();
            console.log(profileData)
            console.log(profileData);
            if (profileData) {
                this.setState({
                    // Предполагается, что идентификатор профиля доступен в полученных данных, если нет, оставьте как есть
                    stud : profileData.Stud
                });
            } else {
                this.setState({ loading: false, error: 'Failed to load profile data' });
            }
        } catch (error) {
            this.setState({ loading: false, error: error.message });
        }
    }

    changeStud(){
        this.setState({stud : !this.state.stud})
        this.setState({currentWindow : <h2 id='StartingText'>ВЫБЕРИТЕ ПУНКТ В МЕНЮ СВЕРХУ СЛЕВА</h2>})
      }
      render(){
        if(!this.state.stud){
          return <div>
          <div id='MainWindow'>
            <Header id={this.state.id} opacities = {this.state.opacities} changeOpacity = {this.changeOpacity} changeStud={this.changeStud} stud={this.state.stud} currentWindow={this.state.currentWindow}/>
            {this.state.currentWindow}
          </div>
        </div>
        } else {
          return <div>
          <div id='MainWindow'>
            <Header id={this.state.id} opacities = {this.state.opacities} changeOpacityStud = {this.changeOpacityStud} changeStud={this.changeStud} stud={this.state.stud} currentWindow={this.state.currentWindow}/>
            {this.state.currentWindow}
          </div>
        </div>
        }
      }
      changeOpacity(newOpacities) {
        let newWindow = <div></div>
        switch ([
          newOpacities[0],
          newOpacities[1],
          newOpacities[2],
          newOpacities[3]
        ].indexOf(1)) {
          case 0:
            newWindow = <Windows.ProfileWindow id={this.state.id}/>  
          break;
          case 1:
            newWindow = <Windows.CalendarWindow id={this.state.id}/>
          break;
          case 2:
            newWindow = <Windows.StudentsWindow id={this.state.id}/>
          break;
          case 3:
            newWindow = <Windows.EarningsWindow id={this.state.id}/>
          break;
          default:
            break;
        }
        this.setState({
          opacities : [
            newOpacities[0],
            newOpacities[1],
            newOpacities[2],
            newOpacities[3]
          ]
        })
        
        this.setState({
          currentWindow : newWindow
        })
      } 
      changeOpacityStud(newOpacities) {
        let newWindow = <div></div>
        switch ([
          newOpacities[0],
          newOpacities[1],
          newOpacities[2],
          newOpacities[3]
        ].indexOf(1)) {
          case 0:
            newWindow = <Windows.ProfileWindow id={this.state.id}/>  
          break;
          case 1:
            newWindow = <Windows.Teachers id={this.state.id}/>
          break;
          case 2:
            newWindow = <Windows.TrainingRequests id={this.state.id}/>
          break;
          default:
            break;
        }
        this.setState({
          opacities : [
            newOpacities[0],
            newOpacities[1],
            newOpacities[2],
            newOpacities[3]
          ]
        })
        
        this.setState({
          currentWindow : newWindow
        })
      } 
}

export default Private;