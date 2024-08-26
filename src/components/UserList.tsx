import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './List.css';
import { User } from '../model/talbe';

const UserList:React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);

  useEffect(() => {
    axios.post('https://port-0-my-spring-app-m09c1v2t70d7f20e.sel4.cloudtype.app/api/users')
      .then(response => setUsers(response.data as User[]))
      .catch(error => console.error('There was a user with the axios request:', error));
  }, []);

  return (
    <div className='list'>
      <h1>유저 목록</h1>
      {users.map((user) => (
        <div className='element' key={user.id}>
          <h4>이름: {user.name}</h4>
          <div>아이디: {user.userId}</div>
          <div>전화번호: {user.phone}</div>
          <div>이메일: {user.email}</div>
        </div>
      ))}
    </div>
  );
}

export default UserList;