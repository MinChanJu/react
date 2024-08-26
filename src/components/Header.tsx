import React from "react";
import { useNavigate } from 'react-router-dom';
import { User } from "../model/talbe";
import logo from "../image/MiC_logo.png"
import './Header.css';

interface HeaderProps {
  user: User;
  setUser: React.Dispatch<React.SetStateAction<User>>;
}

const Header:React.FC<HeaderProps> = ({user,setUser}) => {
  const navigate = useNavigate();

  const goToLogin = () => {
    navigate('/login');
  };

  const goToProblem = () => {
    navigate('/problem');
  };

  const goToContest = () => {
    navigate('/contest');
  };

  const goToUser = () => {
    navigate('/user');
  };

  const goToHome = () => {
    navigate('/home');
    window.location.reload();
  };

  const logout = () => {
    sessionStorage.removeItem('user');
    setUser({id: -1, name: '', userId: '', userPw: '', phone: '', email: '', authority: 0, createdAt: ''});
  }

  return (
    <header>
      <div className="logo" onClick={goToHome}>
        <img className="logoImg" src={logo} alt="" />
        <span className="logoTitle">
          <div>Mathematics</div>
          <div>in Coding</div>
        </span>
      </div>
      <div className="menu-container">
        <div className="login">
          {user.name !== "" && <span>{user.name}</span>}
          {user.name === "" && <span>회원가입</span>}
          <span style={{marginLeft: '10px', marginRight: '10px', fontSize: '20px'}}>|</span>
          {user.name !== "" && <span>설정</span>}
          {user.name === "" && <span onClick={goToLogin}>로그인</span>}
          {user.name !== "" && <span style={{marginLeft: '10px', marginRight: '10px', fontSize: '20px'}}>|</span>}
          {user.name !== "" && <span onClick={logout}>로그아웃</span>}
        </div>
        <div className="menu">
          <div className="select-menu" onClick={goToProblem}>문제</div>
          <div className="select-menu" onClick={goToContest}>대회</div>
          <div className="select-menu" onClick={goToUser}>게시판</div>
          <div className="select-menu">그룹</div>
          <div className="select-menu">검색</div>
          <div className="description">
            <div className="select-menu-description">
              <h2>문제</h2>
              <div>문제</div>
              <div>문제</div>
            </div>
            <div className="select-menu-description">
              <h2>대회</h2>
              <div>대회</div>
              <div>대회</div>
              <div>대회</div>
              <div>대회</div>
            </div>
            <div className="select-menu-description"></div>
            <div className="select-menu-description"></div>
            <div className="select-menu-description"></div>
          </div>
        </div>
      </div>
    </header>
  )
}

export default Header