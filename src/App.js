import React, { useEffect, useState } from 'react';
import MonitoringDiagram from './components/MonitoringDiagram';
import Header from './components/Header';
import './App.css';

function App() {
    const [userAuth, setUserAuth] = useState(null);
    const [newLogin, setNewLogin] = useState(false);

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


    return (
            <>
                <Header userAuth={userAuth} newLogin={newLogin} /> {/* 헤더 렌더링 */}
                <MonitoringDiagram />
            </>
    );
}

export default App;