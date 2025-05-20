import React, { useEffect, useState } from 'react';

export default function MyPagePopup({ isOpen, onClose }) {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (isOpen) {
            setLoading(true);
            fetch('/api/myPage', {
                credentials: 'include' // ← 쿠키를 포함해서 요청 (토큰 포함 목적)
            })
                .then(res => {
                    if (!res.ok) throw new Error('유저 정보를 불러올 수 없습니다');
                    return res.json();
                })
                .then(data => {
                    setUser(data);
                    setLoading(false);
                })
                .catch(err => {
                    console.error(err);
                    setUser(null);
                    setLoading(false);
                });
        }
    }, [isOpen]);

    if (!isOpen) return null;

    return (
        <div style={overlayStyle}>
            <div style={popupStyle}>
                <button style={closeButtonStyle} onClick={onClose}>×</button>
                <h2>마이페이지</h2>
                {loading ? (
                    <div>로딩 중...</div>
                ) : user ? (
                    <>
                        <div style={textStyle}><strong>이름:</strong> {user.name}</div>
                        <div style={textStyle}><strong>아이디:</strong> {user.id}</div>
                        <div style={textStyle}><strong>비밀번호:</strong> {'●'.repeat(8)}</div> {/* 또는 '****' 등 원하는 스타일 */}
                        <div style={textStyle}><strong>업체명:</strong> {user.organization}</div>
                        <div style={textStyle}><strong>핸드폰:</strong> {user.phone}</div>
                        <div style={textStyle}><strong>권한:</strong> {user.auth === '01' ? '관리자' : '사용자'}</div>
                        <div style={textStyle}><strong>가입날짜:</strong> {formatDate(user.reg_date)}</div>
                        {/* 추가 정보 및 기능: 비밀번호 변경, 로그아웃 등 */}
                    </>
                ) : (
                    <div>사용자 정보를 불러올 수 없습니다.</div>
                )}
            </div>
        </div>
    );
}
const textStyle = {
    marginBottom: '8px',
    color: '#222', // 더 진한 글자색
    fontSize: '15px',
};

// 스타일 정의는 그대로 유지
const overlayStyle = {
    position: 'fixed',
    top: 0, left: 0, right: 0, bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 9999,
};

const popupStyle = {
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    backgroundImage: 'url("/icon/h2.jpg")',
    backgroundSize: 'contain',
    padding: '24px',
    borderRadius: '12px',
    width: '450px',
    height: '290px',
    boxShadow: '0 4px 12px rgba(0,0,0,0.3)',
    position: 'relative',
    color: 'black'
};

const closeButtonStyle = {
    position: 'absolute',
    top: '10px',
    right: '10px',
    border: 'none',
    background: 'transparent',
    fontSize: '20px',
    cursor: 'pointer',
};

function formatDate(dateStr) {
    // dateStr: "2024.05.20.14:35:00" → "2024.05.20 14:35"
    if (!dateStr) return '';
    return dateStr.replace(/\./g, '-').replace(/-(\d{2}):(\d{2}):\d{2}$/, ' $1:$2').replace(/-/g, '.');
}
