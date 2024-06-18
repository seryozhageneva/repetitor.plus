import React from 'react';
import { CgAddR, CgRemoveR } from "react-icons/cg";

class LessonEntry extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            isEditing: false,
            ...this.props.lesson,
            files: this.props.lesson.files || [], // Initialize with existing files or empty array
        };
    }

    toggleEditing = () => {
        this.setState({ isEditing: !this.state.isEditing });
    }

    handleChange = (event) => {
        this.setState({ [event.target.name]: event.target.value });
    }

    handleSave = () => {
        const updatedLesson = { ...this.state, files: this.state.files };
        this.props.updateLesson(this.props.index, updatedLesson);
        this.toggleEditing();
    }

    handleFileChange = (event) => {
        const newFiles = Array.from(event.target.files).slice(0, 5);
        this.setState({ files: [...this.state.files, ...newFiles].slice(0, 5) });
    }

    handleFileRemove = (fileIndex) => {
        this.setState((prevState) => {
            const files = [...prevState.files];
            files.splice(fileIndex, 1);
            return { files };
        });
    }

    render() {
        const { date, time, studentName, cost, paid, files } = this.state;
        return (
            <div className='lesson-entry'>
                {this.state.isEditing ? (
                    <>
                        <input type='date' name='date' value={date} onChange={this.handleChange} />
                        <input type='time' name='time' value={time} onChange={this.handleChange} />
                        <input type='text' name='studentName' value={studentName} onChange={this.handleChange} placeholder='Имя' />
                        <input type='number' name='cost' value={cost} onChange={this.handleChange} placeholder='Стоимость' />
                        <select name='paid' value={paid} onChange={this.handleChange}>
                            <option value='false'>Не оплачено</option>
                            <option value='true'>Оплачено</option>
                        </select>
                        <input type='file' accept='application/pdf' onChange={this.handleFileChange} multiple />
                        <p>до 5 PDF файлов.</p>
                        {files.length > 0 && (
                            <div className='file-list'>
                                {files.map((file, index) => (
                                    <div key={index} className='file-item'>
                                        <a href={URL.createObjectURL(file)} target='_blank' rel='noopener noreferrer'>{file.name}</a>
                                        <CgRemoveR className='icon-button delete-icon' onClick={() => this.handleFileRemove(index)} title="Удалить файл" />
                                    </div>
                                ))}
                            </div>
                        )}
                        <button onClick={this.handleSave}>Сохранить</button>
                    </>
                ) : (
                    <>
                        <p>Дата: {date}</p>
                        <p>Время: {time}</p>
                        <p>Имя: {studentName}</p>
                        <p>Стоимость: {cost} руб.</p>
                        <p>Статус оплаты: {paid === 'true' ? 'Оплачено' : 'Не оплачено'}</p>
                        {files.length > 0 && (
                            <div className='file-list'>
                                <p>Прикрепленные файлы:</p>
                                {files.map((file, index) => (
                                    <div key={index} className='file-item'>
                                        <a href={URL.createObjectURL(file)} target='_blank' rel='noopener noreferrer'>{file.name}</a>
                                    </div>
                                ))}
                            </div>
                        )}
                        <button onClick={this.toggleEditing}>Редактировать</button>
                        <CgRemoveR className='icon-button delete-icon' onClick={() => this.props.deleteLesson(this.props.index)} title="Удалить занятие" />
                    </>
                )}
            </div>
        );
    }
}

class LessonForm extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            date: '',
            time: '',
            studentName: '',
            cost: '',
            paid: 'false',
            files: []
        };
    }

    handleChange = (event) => {
        this.setState({ [event.target.name]: event.target.value });
    }

    handleFileChange = (event) => {
        const newFiles = Array.from(event.target.files).slice(0, 5);
        this.setState({ files: newFiles });
    }

    handleSubmit = (event) => {
        event.preventDefault();
        this.props.addLesson(this.state);
        this.setState({
            date: '',
            time: '',
            studentName: '',
            cost: '',
            paid: 'false',
            files: []
        });
    }

    render() {
        return (
            <form onSubmit={this.handleSubmit} className='lesson-form'>
                <input type='date' name='date' value={this.state.date} onChange={this.handleChange} required />
                <input type='time' name='time' value={this.state.time} onChange={this.handleChange} required />
                <input type='text' name='studentName' value={this.state.studentName} onChange={this.handleChange} placeholder='Имя' required />
                <input type='number' name='cost' value={this.state.cost} onChange={this.handleChange} placeholder='Стоимость' required />
                <select name='paid' value={this.state.paid} onChange={this.handleChange} required>
                    <option value='false'>Не оплачено</option>
                    <option value='true'>Оплачено</option>
                </select>
                <input type='file' accept='application/pdf' onChange={this.handleFileChange} multiple />
                <p>до 5 PDF файлов.</p>
                <button type='submit'><CgAddR className='icon-button add-icon' title="Добавить занятие"/></button>
            </form>
        );
    }
}

class CalWindow extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            lessons: [],
        };
    }

    addLesson = (lesson) => {
        this.setState((prevState) => ({
            lessons: [...prevState.lessons, lesson]
        }));
    }

    updateLesson = (index, updatedLesson) => {
        this.setState((prevState) => {
            const lessons = [...prevState.lessons];
            lessons[index] = updatedLesson;
            return { lessons };
        });
    }

    deleteLesson = (index) => {
        this.setState((prevState) => {
            const lessons = [...prevState.lessons];
            lessons.splice(index, 1);
            return { lessons };
        });
    }

    render() {
        return (
            <div className='window' id='calendarwindow'>
                <h2>Календарь занятий</h2>
                <LessonForm addLesson={this.addLesson} />
                <div className='lessons-list'>
                    {this.state.lessons.map((lesson, index) => (
                        <LessonEntry 
                            key={index} 
                            index={index} 
                            lesson={lesson} 
                            updateLesson={this.updateLesson} 
                            deleteLesson={this.deleteLesson} 
                        />
                    ))}
                </div>
            </div>
        );
    }
}

export default CalWindow;
