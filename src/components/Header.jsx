import React, { useEffect, useState } from "react";
import MyPagePopup from './myPagePopup';
import Swal from "sweetalert2";
import "./Header.css";

function Header({ userAuth, newLogin, monitoringType, onChangeMonitoringType }) {
    const [isMyPageOpen, setMyPageOpen] = useState(false);
    const [userInfo, setUserInfo] = useState(null);

    useEffect(() => {
        document.title = "수전해 모니터링 시스템";
        const faviconUrl = "/favicon.png";
        let link = document.querySelector("link[rel~='icon']");
        if (!link) {
            link = document.createElement("link");
            link.rel = "icon";
            document.head.appendChild(link);
        }
        link.href = faviconUrl;

        if (userAuth === "01" && newLogin && sessionStorage.getItem("seenToast") !== "true") {
            showToast("새로운 권한 요청이 있습니다.");
            sessionStorage.setItem("seenToast", "true");
        }
    }, [userAuth, newLogin]);

    const showToast = (message) => {
        Swal.fire({
            toast: true,
            position: "top-end",
            icon: "info",
            title: message,
            showConfirmButton: true,
            timer: 3000,
            timerProgressBar: true,
            didOpen: () => {
                Swal.showLoading();
            },
            willClose: () => {
                Swal.hideLoading();
            }
        });
    };

    const handleMyPageClick = async (e) => {
        e.preventDefault();
        try {
            const res = await fetch('/api/myPage', {
                method: 'GET',
                credentials: 'include',
            });
            if (!res.ok) throw new Error('조회 실패');
            const data = await res.json();
            setUserInfo(data);
            setMyPageOpen(true);
        } catch (err) {
            alert('마이페이지 정보를 가져오지 못했습니다.');
        }
    };

    const handleLogout = (e) => {
        e.preventDefault();
        sessionStorage.removeItem("seenToast");
        window.location.href = "/logout";
    };

    const handleBell = (e) => {
        e.preventDefault();
        window.location.href = "/admin";
    };

    return (
        <div className="header">
            <div className="logo">
                <a href="/monitor">
                    <img src="/icon/logoImage.png" alt="Logo" className="logo-img" />
                </a>
            </div>

            <div className="header-switch-btns">
                {["water", "wet", "dry", "dashboard"].map(type => (
                    <button
                        key={type}
                        className={`btn btn-primary btn-ghost btn-switch${monitoringType === type ? " active" : ""}`}
                        onClick={() => onChangeMonitoringType(type)}
                    >
                        {type === "dashboard" ? type.toUpperCase() : `${type.toUpperCase()} SECTION`}
                    </button>
                ))}
            </div>

            <div className="header-icons">
                {userAuth === "01" && (
                    <div className="bell-wrapper">
                        <a href="#" className="bell-icon" id="bellBtn" title="관리자 페이지" onClick={handleBell}>🔔</a>
                    </div>
                )}
                <div className="user-menu">
                    <img src="/icon/user.png" alt="User Icon" className="user-icon" />
                    <div className="dropdown">
                        <a href="#" onClick={handleMyPageClick}>마이페이지</a>
                        <a href="#" id="logoutBtn" onClick={handleLogout}>로그아웃</a>
                    </div>
                </div>
            </div>

            <MyPagePopup
                isOpen={isMyPageOpen}
                onClose={() => setMyPageOpen(false)}
                user={userInfo}
            />
        </div>
    );
}

export default Header;
