import React from 'react';
import { Col, Container, Row } from 'react-bootstrap';
import { Scatter } from 'react-chartjs-2';
import TimeRangeSelector from './TimeRangeSelector';
import {
    Chart as ChartJS,
    TimeScale, // for time axis
    LinearScale,
    PointElement,
    Tooltip,
    Legend,
    CategoryScale,
} from 'chart.js';
import 'chartjs-adapter-date-fns';
import './css/AuditPage.css';

ChartJS.register(TimeScale, LinearScale, PointElement, Tooltip, Legend, CategoryScale);

const AuditChartByTimeCategory = () => {

    const y_labels = ['', 'BBG Bond', 'BBG MBS', 'CFETS', 'Unsettle Trade', 'YTD Trade Extract', ''];

    const data = {
        datasets: [
            {
                label: 'BBG Bond',
                data: [
                    { x: '2024-10-21T10:05:00', y: 'BBG Bond' },
                    { x: '2024-10-21T11:10:00', y: 'BBG Bond' },
                    { x: '2024-10-21T12:20:00', y: 'BBG Bond' },
                    { x: '2024-10-21T10:23:00', y: 'BBG Bond' },
                    { x: '2024-10-21T11:45:00', y: 'BBG Bond' },
                    { x: '2024-10-21T12:12:00', y: 'BBG Bond' },
                    { x: '2024-10-21T10:40:00', y: 'BBG Bond' },
                    { x: '2024-10-21T11:26:00', y: 'BBG Bond' },
                    { x: '2024-10-21T12:50:00', y: 'BBG Bond' },
                ],
                backgroundColor: 'rgba(255, 165, 0, 0.8)',
                pointRadius: 5,
            },
            {
                label: 'BBG MBS',
                data: [
                    { x: '2024-10-21T10:30:00', y: 'BBG MBS' },
                    { x: '2024-10-21T11:30:00', y: 'BBG MBS' },
                    { x: '2024-10-21T12:30:00', y: 'BBG MBS' },
                    { x: '2024-10-21T10:23:00', y: 'BBG MBS' },
                    { x: '2024-10-21T11:53:00', y: 'BBG MBS' },
                    { x: '2024-10-21T12:16:00', y: 'BBG MBS' },
                    { x: '2024-10-21T10:36:00', y: 'BBG MBS' },
                    { x: '2024-10-21T11:55:00', y: 'BBG MBS' },
                    { x: '2024-10-21T12:47:00', y: 'BBG MBS' },
                ],
                backgroundColor: 'rgba(255, 217, 0, 0.7)',
                pointRadius: 5,
            },
            {
                label: 'CFETS',
                data: [
                    { x: '2024-10-21T10:30:00', y: 'CFETS' },
                    { x: '2024-10-21T11:30:00', y: 'CFETS' },
                    { x: '2024-10-21T12:30:00', y: 'CFETS' },
                    { x: '2024-10-21T10:11:00', y: 'CFETS' },
                    { x: '2024-10-21T11:01:00', y: 'CFETS' },
                    { x: '2024-10-21T12:51:00', y: 'CFETS' },
                    { x: '2024-10-21T10:45:00', y: 'CFETS' },
                    { x: '2024-10-21T11:32:00', y: 'CFETS' },
                    { x: '2024-10-21T12:24:00', y: 'CFETS' },
                ],
                backgroundColor: 'rgba(255, 192, 0, 0.6)',
                pointRadius: 5,
            },
            {
                label: 'Unsettle Trade',
                data: [
                    { x: '2024-10-21T10:14:54', y: 'Unsettle Trade' },
                    { x: '2024-10-21T10:47:10', y: 'Unsettle Trade' },
                    { x: '2024-10-21T11:30:00', y: 'Unsettle Trade' },
                    { x: '2024-10-21T11:45:00', y: 'Unsettle Trade' },
                    { x: '2024-10-21T12:40:01', y: 'Unsettle Trade' },
                    { x: '2024-10-21T11:51:25', y: 'Unsettle Trade' },
                    { x: '2024-10-21T12:10:00', y: 'Unsettle Trade' },
                ],
                backgroundColor: 'rgba(230, 181, 10, 0.8)',
                pointRadius: 5,
            },
            {
                label: 'YTD Trade Extract',
                data: [
                    { x: '2024-10-21T10:10:00', y: 'YTD Trade Extract' },
                    { x: '2024-10-21T11:30:00', y: 'YTD Trade Extract' },
                ],
                backgroundColor: 'rgba(230, 181, 10, 0.8)',
                pointRadius: 5,
            },
        ],
    };

    // Chart options
    const options = {
        scales: {
            x: {
                type: 'time',
                time: {
                    unit: 'hour',
                },
                title: {
                    display: true,
                    text: 'Time',
                },
                grid: {
                    display: false, // Disable grid lines on the x-axis
                },
            },
            y: {
                type: 'category',
                labels: y_labels,
                title: {
                    display: true,
                    text: '',
                },
                grid: {
                    display: false, // Disable grid lines on the x-axis
                },
            },
        },
        layout: {
            padding: {
                top: 30,    // Margin at the top of the chart
                bottom: 30, // Margin at the bottom of the chart
            },
        },
    };

    const chartStyle = {
        height: '70vh', // 70% of the viewport height
        width: '90vw',  // 90% of the viewport width
    };

    return (
        <Container >
            <Row>
                <Col md="12">
                    <h4 className='audit-chart-header-container'>History Script Executions</h4>
                </Col>
            </Row>
            <Row>
            <Col md="12" className="audit-time-container">
                    <TimeRangeSelector></TimeRangeSelector>
                </Col>
            </Row>
            <Row>
                <Col>
                    <div style={chartStyle}>
                        <Scatter data={data} options={options} />
                    </div>
                </Col>
            </Row>
        </Container>
    );
};

export default AuditChartByTimeCategory;
