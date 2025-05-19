import React, { useEffect, useState } from 'react';
import MonitoringWater from './components/MonitoringWater';
import MonitoringWet from './components/MonitoringWet';
import MonitoringDry from './components/MonitoringDry';
import Header from './components/Header';
import './App.css';

function App() {
    const [userAuth, setUserAuth] = useState(null);
    const [newLogin, setNewLogin] = useState(false);

    const [monitoringType, setMonitoringType] = useState('water');

    useEffect(() => {
        fetch("/api/userInfo", {
            credentials: "include" // 쿠키로 세션 전달
        })
            .then(res => {
                if (!res.ok) throw new Error("No session");
                return res.json();
            })
            .then(data => {
                setUserAuth(data.userAuth);
                setNewLogin(data.newLogin);
            })
            .catch(err => {
                console.log("세션정보를 못받음", err);
                setUserAuth(null);
                setNewLogin(false);
            });
    }, []);

    let monitoringComponent = <MonitoringWater />;
    if (monitoringType === "wet") monitoringComponent = <MonitoringWet />;
    else if (monitoringType === "dry") monitoringComponent = <MonitoringDry />;
    else if (monitoringType === "water") monitoringComponent = <MonitoringWater />;

    return (
            <div className="app-container">
                <Header userAuth={userAuth}
                        newLogin={newLogin}
                        monitoringType={monitoringType}
                        onChangeMonitoringType={setMonitoringType}
                />
                <div className="monitoring-wrapper">
                    {monitoringComponent}
                </div>
            </div>
    );
}

export default App;