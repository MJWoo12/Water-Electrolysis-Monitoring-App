import React, { useEffect } from "react";
import Swal from "sweetalert2";
import "./Header.css";

function Header({ userAuth, newLogin, monitoringType, onChangeMonitoringType }) {
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

    function showToast(message) {
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
    }

    function handleLogout(e) {
        e.preventDefault();
        sessionStorage.removeItem("seenToast");
        window.location.href = "/logout";
    }

    function handleBell(e) {
        e.preventDefault();
        window.location.href = "/admin";
    }

    return (
        <div className="header">
            <div className="logo">
                <a href="/monitor/water">
                    <img src="/icon/logoImage.png" alt="Logo" className="logo-img" />
                </a>
            </div>
            <div className="header-switch-btns">
                <button
                    onClick={() => onChangeMonitoringType("water")}
                    className={monitoringType === "water" ? "active" : ""}
                >WATER SECTION</button>
                <button
                    onClick={() => onChangeMonitoringType("dry")}
                    className={monitoringType === "dry" ? "active" : ""}
                >DRY SECTION</button>
                <button
                    onClick={() => onChangeMonitoringType("wet")}
                    className={monitoringType === "wet" ? "active" : ""}
                >WET SECTION</button>
            </div>

            <div className="header-icons">
                {userAuth === "01" && (
                    <div className="bell-wrapper">
                        {/* eslint-disable-next-line jsx-a11y/anchor-is-valid */}
                        <a
                            href="#"
                            className="bell-icon"
                            id="bellBtn"
                            title="관리자 페이지"
                            onClick={handleBell}
                        >
                            🔔
                        </a>
                    </div>
                )}
                <div className="user-menu">
                    <img src="/icon/user.png" alt="User Icon" className="user-icon" />
                    <div className="dropdown">
                        <a href="/mypage">마이페이지</a>
                        {/* eslint-disable-next-line jsx-a11y/anchor-is-valid */}
                        <a href="#" id="logoutBtn" onClick={handleLogout}>
                            로그아웃
                        </a>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Header;
