import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { User } from "../model/talbe";
import { severObjectRetry } from '../model/serverRetry';
import "./css/UserView.css"

interface UserViewProps {
  user: User;
}

const UserView:React.FC<UserViewProps> = ({user}) => {
  const { id } = useParams<{id: string}>();
  const [curUser, setCurUser] = useState<User>();
  const navigate = useNavigate();
  
  useEffect(() => {
    if (id) {
      severObjectRetry(`api/users/${id}`, setCurUser);
    }
  }, [id]);

  useEffect(() => {
    if (user.id === curUser?.id) {
      setCurUser(user);
    }
  }, [user, curUser]);

  const goToSetting = () => {
    navigate('/setting');
  };

  const goToUser = () => {
    navigate('/user');
  };

  return (
    <div className="userView">
      <h1>정보</h1>
      <div className="userElement">
        <h4>{curUser?.name}</h4>
        <div>{curUser?.userId}</div>
        <div>{curUser?.userPw}</div>
        <div>{curUser?.phone}</div>
        <div>{curUser?.email}</div>
        <div>{curUser?.authority}</div>
        <div>{curUser?.createdAt}</div>
      </div>
      <div className="userMenu">
        {user.id === curUser?.id && <div className="userButton" onClick={goToSetting}>설정</div>}
        {user.id === curUser?.id && user.authority === 5 && <div className="userButton" onClick={goToUser}>회원관리</div>}
      </div>
    </div>
  )
}

export default UserView