import React from "react";
import '../css/Header.css'
import MenuIcons from './MenuIcons'

class Header extends React.Component {
    render() {
        if(!this.props.stud){
            return (
                <header>
                    <MenuIcons.Profile opacities = {this.props.opacitites} changeOpacity = {this.props.changeOpacity}/>
                    <MenuIcons.Calendar opacities = {this.props.opacitites} changeOpacity = {this.props.changeOpacity}/>
                    <MenuIcons.Students opacities = {this.props.opacitites} changeOpacity = {this.props.changeOpacity}/>
                    <MenuIcons.Earnings opacities = {this.props.opacitites} changeOpacity = {this.props.changeOpacity}/>
                    <MenuIcons.Exit />
                    <MenuIcons.ChangeStud changeStud={this.props.changeStud} />
                    <MenuIcons.Mail id={this.props.id}/>
                </header>
            )
        } else {
            return (
                <header>
                    <MenuIcons.Profile opacities = {this.props.opacitites} changeOpacity = {this.props.changeOpacityStud}/>
                    <MenuIcons.TeachersStud opacities = {this.props.opacitites} changeOpacity = {this.props.changeOpacityStud}/>
                    <MenuIcons.TrainingStud opacities = {this.props.opacitites} changeOpacity = {this.props.changeOpacityStud}/>
                    <MenuIcons.Exit />
                    <MenuIcons.ChangeStud changeStud={this.props.changeStud} stud={this.props.stud}/>
                </header>
            ) 
        }
    }
}

export default Header