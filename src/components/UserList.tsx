import React, { useEffect, useState } from 'react';
import { severArrayRetry } from '../model/serverRetry';
import { User } from '../model/talbe';
import './css/List.css';

interface UserListProps {
  user: User
}

const UserList:React.FC<UserListProps> = ({user}) => {
  const [users, setUsers] = useState<User[]>([]);

  
  useEffect(() => {
    if (user.authority === 5) {
      severArrayRetry(
        'https://port-0-my-spring-app-m09c1v2t70d7f20e.sel4.cloudtype.app/api/users',
        setUsers
      )
    }
  }, [user.authority]);

  return (
    <div className='list'>
      <h1>유저 목록</h1>
      {user.authority !== 5 && <div>권한이 없음</div>}
      {users.map((user) => (
        <div className='element' key={user.id}>
          <h4>이름: {user.name}</h4>
          <div>아이디: {user.userId}</div>
          <div>이메일: {user.email}</div>
          <div>권한: {user.authority}</div>
        </div>
      ))}
    </div>
  );
}

export default UserList;