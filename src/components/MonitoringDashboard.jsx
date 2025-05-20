import React, { useState, useEffect} from "react";
import dayjs from "dayjs";
import { Line } from "react-chartjs-2";
import Select from "react-select";
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend,
} from 'chart.js';

ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend
);

const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
        legend: {
            position: 'bottom',
        },
    },
    scales: {
        x: {
            ticks: {
                autoSkip: true,
                maxRotation: 30,
                minRotation: 30,
                maxTicksLimit: 10,
            },
        },
        y: {
            beginAtZero: true,
        },
    },
};
export default function MonitoringDashboard() {
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedKeys, setSelectedKeys] = useState([]);

    const handleSelect = (selected) => {
        const keys = selected ? selected.map(opt => opt.value) : [];
        setSelectedKeys(keys.slice(0, 8)); // 최대 8개 선택 제한
    };

    useEffect(() => {
        fetch("/api/dashboard")
            .then(res => res.json())
            .then(resData => {
                const sorted = [...resData].reverse();
                setData(sorted); // 이미 가공된 최신 날짜별 10건
                setLoading(false);
            })
            .catch(err => {
                alert("데이터를 불러오지 못했습니다!");
                setLoading(false);
            });
    }, []);

    const allKeys = Object.keys(data[0] || {}).filter(k => k !== "received_at");
    const options = allKeys.map(k => ({ label: k, value: k }));

    const datasets = selectedKeys.map((key, idx) => ({
        label: key,
        data: data.map(d => d[key]),
        borderColor: `hsl(${idx * 40 % 360}, 90%, 55%)`,
        backgroundColor: 'transparent',
        pointRadius: 2,
        tension: 0.1,
    }));

    const chartData = {
        labels: data.map(d => dayjs(d.received_at).format("MM/DD")),
        datasets
    };

    const convertToCSV = (objArray) => {
        const array = typeof objArray !== 'object' ? JSON.parse(objArray) : objArray;
        const keys = Object.keys(array[0]);

        const csvRows = [];
        csvRows.push(keys.join(',')); // 헤더

        for (const item of array) {
            const values = keys.map(k => {
                const escaped = ('' + item[k]).replace(/"/g, '""');
                return `"${escaped}"`;
            });
            csvRows.push(values.join(','));
        }

        return csvRows.join('\n');
    };

    const handleDownloadCSV = () => {
        const csv = convertToCSV(data);
        const blob = new Blob([csv], { type: 'text/csv' });
        const href = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = href;
        link.download = `dashboard_data_${dayjs().format('YYYYMMDD_HHmmss')}.csv`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(href);
    };



    return (
        <div>
            {loading ? (
                <div className="loader"></div>
            ) : (
                <>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '1000px', margin: '0 auto' }}>
                    <Select
                        isMulti
                        options={options}
                        value={options.filter(opt => selectedKeys.includes(opt.value))}
                        onChange={handleSelect}
                        closeMenuOnSelect={true}
                        placeholder="데이터를 선택하세요."
                        isOptionDisabled={opts => selectedKeys.length >= 8 && !selectedKeys.includes(opts.value)}
                        styles={{
                            container: base => ({
                                ...base,
                                width: 800
                            }),
                        }}
                            />
                    <button
                        onClick={handleDownloadCSV}
                        style={{
                            marginLeft: '10px',
                            padding: '6px 12px',
                            height: '40px',
                            whiteSpace: 'nowrap',
                            cursor: 'pointer',
                        }}
                    >
                        CSV 다운로드
                    </button>
                </div>
                    <div style={{ marginTop: '4px', color: '#888', fontSize: '14px', textAlign: 'center'}}>
                        최대 8개까지 선택할 수 있습니다.
                    </div>
                    <div style={{ width: '1900px', height: '700px', marginTop: '20px' }}>
                        <Line data={chartData} options={chartOptions} />
                    </div>
                </>
            )}
        </div>
    );
}
