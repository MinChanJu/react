import React, { useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Contest, CurrentContest, User } from "../model/talbe";
import axios from "axios";
import "./css/ContestMake.css"

interface ContestMakeProps {
  user: User
  setCurrentContest: React.Dispatch<React.SetStateAction<CurrentContest>>;
}

const ContestMake: React.FC<ContestMakeProps> = ({ user, setCurrentContest }) => {
  const navigate = useNavigate();
  const [makeMessage, setMakeMessage] = useState<string>('')
  const userIdRef = useRef<HTMLInputElement | null>(null);
  const contestNameRef = useRef<HTMLInputElement | null>(null);
  const contestPasswordRef = useRef<HTMLInputElement | null>(null);
  const contestCheckPasswordRef = useRef<HTMLInputElement | null>(null);
  const contestDescriptionRef = useRef<HTMLTextAreaElement | null>(null);

  const handleSubmit = () => {
    if (userIdRef.current &&
        contestNameRef.current &&
        contestPasswordRef.current &&
        contestCheckPasswordRef.current &&
        contestDescriptionRef.current) {
      if (userIdRef.current.value === user.userId && user.userId !== "") {
        if (contestPasswordRef.current.value === contestCheckPasswordRef.current.value) {
          if (contestNameRef.current.value !== '') {
            axios.post(`https://port-0-my-spring-app-m09c1v2t70d7f20e.sel4.cloudtype.app/api/contests/create`,
              {
                userId: userIdRef.current.value,
                contestName: contestNameRef.current.value,
                contestDescription: contestDescriptionRef.current.value,
                contestPw: contestPasswordRef.current.value
              }
            ).then(response => {
              if (response.data === "") {
                setMakeMessage("서버 오류")
              } else {
                const contest = response.data as Contest
                setCurrentContest({contestId: contest.id, contestName: contest.contestName})
                navigate('/problem/make')
                setMakeMessage("대회 개최 성공!")
              }
            })
            .catch(error => setMakeMessage("이미 존재하는 대회 이름 또는 서버 에러"));
          } else {
            setMakeMessage("이름 작성 필요")
          }
        } else {
          setMakeMessage("비밀번호 불일치")
        }
      } else {
        setMakeMessage("아이디 불일치")
      }
    }
  };
  
  return (
    <div className="makeContainer">
      {user.authority < 3 &&
        <div className="makeBox">
          <h2>권한 없음</h2>
        </div>
      }
      {user.authority >= 3 &&
        <div className="makeBox">
          <h2>대회 정보 기입</h2>
          <span>{makeMessage}</span>
          <div className="make-group">
            <div className="makeTitle">본인 아이디</div>
            <input className="makeField" ref={userIdRef} type="text"></input>
          </div>
          <div className="make-group">
            <div className="makeTitle">대회 제목</div>
            <input className="makeField" ref={contestNameRef} type="text" id="contestName"></input>
          </div>
          <div className="double-make-group">
            <div className="make-group">
              <div className="makeTitle">대회 비밀번호</div>
              <input className="makeField" ref={contestPasswordRef} type="password" id="contestPassword"></input>
            </div>
            <div className="make-group">
              <div className="makeTitle">비밀번호 확인</div>
              <input className="makeField" ref={contestCheckPasswordRef} type="password" id="contestCheckPassword"></input>
            </div>
          </div>
          <div style={{ marginTop: '10px', color: 'red' }}>누구나 접근할 수 있는 대회를 개최하려면 빈칸으로 해주세요.</div>
          <div className="make-group">
            <div className="makeTitle">대회 설명</div>
            <textarea className="makeField" ref={contestDescriptionRef} style={{ height: '100px' }} id="contestDescription" />
          </div>
          <div className="makeButton" onClick={handleSubmit}>대회 개최</div>
        </div>
      }
    </div>
  )
}

export default ContestMake