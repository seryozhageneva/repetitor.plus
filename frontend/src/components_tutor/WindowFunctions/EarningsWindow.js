import React from 'react';
import { Line } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend } from 'chart.js';

// Регистрация необходимых компонентов Chart.js
ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

class EarningsWindow extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            monthlyEarnings: [300, 500, 700, 200, 800, 400, 600, 700, 900, 500, 600, 400], // Пример данных
            dailyEarnings: [50, 75, 60, 90, 40, 80, 70, 60, 55, 45, 80, 70, 100, 60, 40, 55, 65, 90, 80, 85, 90, 75, 70, 85, 60, 95, 70, 55, 75, 85], // Пример данных
        };
    }

    render() {
        // Данные для месячного графика
        const monthlyData = {
            labels: ['Янв', 'Фев', 'Мар', 'Апр', 'Май', 'Июн', 'Июл', 'Авг', 'Сен', 'Окт', 'Ноя', 'Дек'],
            datasets: [
                {
                    label: 'Ежемесячный заработок (руб.)',
                    data: this.state.monthlyEarnings,
                    fill: false,
                    backgroundColor: '#4caf50',
                    borderColor: '#4caf50',
                },
            ],
        };

        // Данные для ежедневного графика
        const dailyData = {
            labels: Array.from({ length: 30 }, (_, i) => `День ${i + 1}`),
            datasets: [
                {
                    label: 'Ежедневный заработок (руб.)',
                    data: this.state.dailyEarnings,
                    fill: false,
                    backgroundColor: '#3f51b5',
                    borderColor: '#3f51b5',
                },
            ],
        };

        return (
            <div className='window' id='earningswindow'>
                <div className='chart-container'>
                    <h3>Заработок за год</h3>
                    <Line data={monthlyData} options={{ maintainAspectRatio: false }} />
                </div>
                <div className='chart-container'>
                    <h3>Заработок за месяц</h3>
                    <Line data={dailyData} options={{ maintainAspectRatio: false }} />
                </div>
            </div>
        );
    }
}

export default EarningsWindow;
