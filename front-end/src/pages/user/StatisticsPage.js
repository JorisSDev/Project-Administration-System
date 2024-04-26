import React, { useEffect, useRef } from 'react';
import Chart from 'chart.js/auto';

const StatisticsPage = () => {
    const pieChartRef = useRef(null);
    const barChartRef = useRef(null);

    useEffect(() => {
        if (pieChartRef.current && barChartRef.current) {
            const pieChartContext = pieChartRef.current.getContext('2d');
            const barChartContext = barChartRef.current.getContext('2d');

            new Chart(pieChartContext, {
                type: 'pie',
                data: {
                    labels: ['Red', 'Blue', 'Yellow'],
                    datasets: [{
                        data: [300, 50, 100],
                        backgroundColor: ['Red', 'Blue', 'Yellow']
                    }]
                }
            });

            new Chart(barChartContext, {
                type: 'bar',
                data: {
                    labels: ['Red', 'Blue', 'Yellow'],
                    datasets: [{
                        label: '# of Votes',
                        data: [12, 19, 3],
                        backgroundColor: ['Red', 'Blue', 'Yellow']
                    }]
                }
            });
        }
    }, []);

    return (
        <div className="container">
            <h1 className="mb-3">Statistics</h1>
            <p className="mb-3">This is some placeholder text.</p>
            <div className="row">
                <div className="col-sm-6 mb-3">
                    <div style={{maxHeight: '300px'}}>
                        <canvas ref={pieChartRef} />
                    </div>
                </div>
                <div className="col-sm-6 mb-3">
                    <div style={{maxHeight: '300px'}}>
                        <canvas ref={barChartRef} />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default StatisticsPage;