import React, { useEffect, useState } from 'react';
import { Col, Container, Row, Spinner } from 'react-bootstrap';
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

    const [timeRange, setTimeRange] = useState('Last 1 day');
    const [auditData, setAuditData] = useState(null);
    const [axisTimeUnit, setXAxisTimeUnit] = useState('hour');

    const y_labels = ['', 'bond_bloomberg', 'cfest_bond', 'mbs_bloomberg', 'extract_ytd_trades', 'unsettle_trade', ''];

    useEffect(() => {
        if (timeRange === 'Last 12 hours' || timeRange === 'Last 1 day' || timeRange === 'Last 3 days') {
            setXAxisTimeUnit("hour");
        } else {
            setXAxisTimeUnit("day");
        }
    }, [timeRange]);

    // Chart options
    const options = {
        scales: {
            x: {
                type: 'time',
                time: {
                    unit: axisTimeUnit,
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
                    <TimeRangeSelector setAuditData={setAuditData}
                        timeRange={timeRange}
                        setTimeRange={setTimeRange}>
                    </TimeRangeSelector>
                </Col>
            </Row>
            <Row>
                <Col>
                {auditData ? 
                    (<div style={chartStyle}>
                        <Scatter data={auditData} options={options} />
                    </div>) : (
                        <Spinner as="span" animation="border" size="sm" role="status" aria-hidden="true" />
                    )
                }                
                    
                    
                </Col>
            </Row>
        </Container>
    );
};

export default AuditChartByTimeCategory;
