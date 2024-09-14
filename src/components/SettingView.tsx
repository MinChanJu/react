import React, { useCallback, useEffect, useRef, useState } from "react";
import { User } from "../model/talbe";
import { severArrayRetry } from "../model/serverRetry";
import './css/SettingView.css'

interface SettingViewProps {
  user: User
}

const SettingView:React.FC<SettingViewProps> = ({user}) => {
  const [data, setData] = useState<string>("정보")
  return (
    <div className="setting-container">
      <div className="setting-menu">
        <div className={data === "정보" ? "setting-menu-select now": "setting-menu-select"} onClick={() => {setData("정보")}}>정보</div>
        <div className={data === "비밀번호 변경" ? "setting-menu-select now": "setting-menu-select"} onClick={() => {setData("비밀번호 변경")}}>비밀번호 변경</div>
        <div className={data === "내가 푼 문제" ? "setting-menu-select last now": "setting-menu-select last"} onClick={() => {setData("내가 푼 문제")}}>내가 푼 문제</div>

        <div className="admin-menu">관리자 메뉴</div>
        <div className={data === "만든 문제" ? "setting-menu-select now": "setting-menu-select"} onClick={() => {setData("만든 문제")}}>만든 문제</div>
        <div className={data === "만든 대회" ? "setting-menu-select now": "setting-menu-select"} onClick={() => {setData("만든 대회")}}>만든 대회</div>
        <div className={data === "회원 관리" ? "setting-menu-select last now": "setting-menu-select last"} onClick={() => {setData("회원 관리")}}>회원 관리</div>
      </div>
      <div className="setting-view">
        <div className="view-title">{data}</div>
        {data === "정보" && <Info user={user} />}
        {data === "비밀번호 변경" && <ChagePw user={user} />}
        {data === "내가 푼 문제" && <Solved user={user} />}
        {data === "만든 문제" && <MakeCon user={user} />}
        {data === "만든 대회" && <MakePro user={user} />}
        {data === "회원 관리" && <UserManage user={user} />}
      </div>
    </div>
  )
}

export default SettingView

const Info:React.FC<SettingViewProps> = ({user}) => {
  const passwordRef = useRef<HTMLInputElement | null>(null)
  const phoneRef = useRef<HTMLInputElement | null>(null)
  const emailRef = useRef<HTMLInputElement | null>(null)

  useEffect(() => {
    if (phoneRef.current &&
        emailRef.current) {
      phoneRef.current.value = user.phone
      emailRef.current.value = user.email
    }
  })
  
  return (
    <div>
      <div className="total-container">
        <div className="view-container">
          <div className="view-name">이름: </div>
          <div className="view-content">{user.name}</div>
        </div>
        <div className="view-container">
          <div className="view-name">아이디: </div>
          <div className="view-content">{user.userId}</div>
        </div>
        <div className="view-container">
          <div className="view-name">전화번호: </div>
          <input className="view-content" ref={phoneRef} type="text"></input>
        </div>
        <div className="view-container">
          <div className="view-name">이메일: </div>
          <input className="view-content" ref={emailRef} type="text"></input>
        </div>
        <div className="view-container">
          <div className="view-name">비밀번호: </div>
          <input className="view-content" ref={passwordRef} type="password"></input>
        </div>
        <div className="view-submit">변경</div>
      </div>
    </div>
  )
}

const ChagePw:React.FC<SettingViewProps> = ({user}) => {
  const passwordRef = useRef<HTMLInputElement | null>(null)

  return (
    <div>
      <div className="total-container">
        <div>
          <div className="view-name">현재 비밀번호</div>
          <input className="view-content" ref={passwordRef} type="password"></input>
        </div>
        <div>
          <div className="view-name">새로운 비밀번호</div>
          <input className="view-content" ref={passwordRef} type="password"></input>
        </div>
        <div>
          <div className="view-name">새로운 비밀번호 확인</div>
          <input className="view-content" ref={passwordRef} type="password"></input>
        </div>
        <div className="view-submit">변경</div>
      </div>
    </div>
  )
}

const Solved:React.FC<SettingViewProps> = ({user}) => {
  return (
    <div>내가 푼 문제</div>
  )
}

const MakeCon:React.FC<SettingViewProps> = ({user}) => {
  return (
    <div>만든 문제</div>
  )
}

const MakePro:React.FC<SettingViewProps> = ({user}) => {
  return (
    <div>만든 대회</div>
  )
}

const UserManage:React.FC<SettingViewProps> = ({user}) => {
  const [users, setUsers] = useState<User[]>([]);
  const [numbers, setNumbers] = useState<string[]>([]);

  const addNumberField = useCallback((num: string) => {
    setNumbers([...numbers, num]);
  }, [numbers])

  const handleChange = (index: number, event: React.ChangeEvent<HTMLInputElement>) => {
    const updatedNumbers = [...numbers];
    updatedNumbers[index] = event.target.value;
    setNumbers(updatedNumbers);
  };
  
  useEffect(() => {
    if (user.authority === 5) {
      severArrayRetry('users', setUsers)
    }
  }, [user.authority]);

  useEffect(() => {
    users.forEach((user) => {
      addNumberField(user.authority.toString())
    })
  }, [users, addNumberField])

  return (
    <div className="total-container">
      {user.authority !== 5 && <div>권한이 없음</div>}
      <table>
        <thead>
          <tr>
            <th>번호</th>
            <th>이름</th>
            <th>아이디</th>
            <th>이메일</th>
            <th>권한</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user, index) => (
            <tr>
              <td>{index+1}</td>
              <td>{user.name}</td>
              <td>{user.userId}</td>
              <td>{user.email}</td>
              <td><input type="number" value={numbers[index]} onChange={(event) => handleChange(index, event)} min="0" max="5" step="1"></input></td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}