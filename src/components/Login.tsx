import React, { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { User } from "../model/talbe";
import axios from "axios";
import './css/Login.css'

interface LoginProps {
  setUser: React.Dispatch<React.SetStateAction<User>>;
}

const Login:React.FC<LoginProps> = ({setUser}) => {
  const navigate = useNavigate();
  const [isMovedLeft, setIsMovedLeft] = useState<boolean>(false);

  const signInRef = useRef<HTMLDivElement | null>(null);
  const signInIdRef = useRef<HTMLInputElement | null>(null);
  const signInPasswordRef = useRef<HTMLInputElement | null>(null);
  const [loginMessage, setloginMessage] = useState<string>('');

  const signUpRef = useRef<HTMLDivElement | null>(null);
  const signUpNameRef = useRef<HTMLInputElement | null>(null);
  const signUpIdRef = useRef<HTMLInputElement | null>(null);
  const signUpPasswordRef = useRef<HTMLInputElement | null>(null);
  const signUpCheckPasswordRef = useRef<HTMLInputElement | null>(null);
  const signUpEmailRef = useRef<HTMLInputElement | null>(null);
  const signUpPhoneRef = useRef<HTMLInputElement | null>(null);
  const [registerMessage, setregisterMessage] = useState<string>('');

  useEffect(() => {
    const intervalId = setInterval(() => {
      if (signInRef.current && signUpRef.current) {
        const signInElement = signInRef.current;
        const signUpElement = signUpRef.current;

        const signInTransformValue = getComputedStyle(signInElement).transform;
        const signUpTransformValue = getComputedStyle(signUpElement).transform;

        const signInMatrixValues = signInTransformValue.match(/matrix.*\((.+)\)/)?.[1].split(', ');
        const signUpMatrixValues = signUpTransformValue.match(/matrix.*\((.+)\)/)?.[1].split(', ');

        if (signInMatrixValues && signUpMatrixValues) {
          const signInTranslateX = parseFloat(signInMatrixValues[4]);
          const signUpTranslateX = parseFloat(signUpMatrixValues[4]);

          const parentWidth = signInElement.parentElement?.offsetWidth || 0;
          const signInPercentageMoved = (signInTranslateX / parentWidth) * 100;
          const signUpPercentageMoved = (signUpTranslateX / parentWidth) * 100;

          if (isMovedLeft) {
            signInElement.style.zIndex = signInPercentageMoved >= 25 ? '1' : '2';
            signUpElement.style.zIndex = signUpPercentageMoved >= 25 ? '2' : '1';
          } else {
            signInElement.style.zIndex = signInPercentageMoved <= 25 ? '2' : '1';
            signUpElement.style.zIndex = signUpPercentageMoved <= 25 ? '1' : '2';
          }

          if ((isMovedLeft && signInPercentageMoved >= 30) || (!isMovedLeft && signInPercentageMoved <= 20)) {
            clearInterval(intervalId);
          }
        }
      }
    }, 50);

    return () => clearInterval(intervalId); // 컴포넌트가 언마운트될 때 interval 정리
  }, [isMovedLeft]);

  const handleButtonClick = () => {
    setIsMovedLeft(prevState => !prevState);
    if (signInIdRef.current &&
        signInPasswordRef.current &&
        signUpNameRef.current &&
        signUpIdRef.current &&
        signUpPasswordRef.current &&
        signUpCheckPasswordRef.current &&
        signUpEmailRef.current &&
        signUpPhoneRef.current) {
      signInIdRef.current.value = ""
      signInPasswordRef.current.value = ""
      signUpNameRef.current.value = ""
      signUpIdRef.current.value = ""
      signUpPasswordRef.current.value = ""
      signUpCheckPasswordRef.current.value = ""
      signUpEmailRef.current.value = ""
      signUpPhoneRef.current.value = ""
    }
  };

  const isPasswordValid = (password: string): string => {
    let message = "\n비밀번호는 8자 이상이어야 하며 영문자, 숫자를 포함해야 합니다."
    if (/\s|'|"|;/.test(password)) {return "비밀번호에 포함되면 안되는 문자가 있습니다."+message}
    if (password.length < 8) {return "비밀번호가 8자 미만입니다."+message}
    if (!/[a-zA-Z]/.test(password)) {return "비밀번호에 영문자가 포함되어 있지 않습니다."+message}
    if (!/[0-9]/.test(password)) {return "비밀번호에 숫자가 포함되어 있지 않습니다."+message}
  
    return "이미 존재하는 아이디";
  };

  const registerUser = async () => {
    if (signUpNameRef.current &&
        signUpIdRef.current &&
        signUpPasswordRef.current &&
        signUpCheckPasswordRef.current &&
        signUpEmailRef.current &&
        signUpPhoneRef.current) {
      const password = signUpPasswordRef.current!.value;
      const checkPassword = signUpCheckPasswordRef.current!.value;
      if (password === checkPassword) {
        let attempts = 0;

        while (attempts < 5) {
          try {
            const response = await axios.post(`https://port-0-my-spring-app-m09c1v2t70d7f20e.sel4.cloudtype.app/api/users/create`,
            { name: signUpNameRef.current.value,
              phone: signUpPhoneRef.current.value,
              userId: signUpIdRef.current.value,
              userPw: signUpPasswordRef.current.value,
              email: signUpEmailRef.current.value,
              authority: 0,
            }, { timeout: 10000 });
            if (response.data === "") {
              setregisterMessage(isPasswordValid(password))
            } else {
              setregisterMessage("회원가입 성공!")
            }
            break;  // 성공 시 루프 탈출
          } catch (error: any) {
            attempts++;
            console.error(`Attempt ${attempts} failed for register. Error: ${error.message}`);
            if (attempts >= 5) {
              console.error(`All ${5} attempts failed for register.`);
              setregisterMessage("서버 에러 또는 이미 존재하는 아이디")
              break;
            }
            console.log(`Retrying register in ${1000 / 1000}s...`);
            await new Promise(resolve => setTimeout(resolve, 1000));
          }
        }
      } else {
        setregisterMessage("비밀번호가 일치하지 않습니다.")
      }
      
    }
  }

  const loginUser = async () => {
    if (signInIdRef.current &&
        signInPasswordRef.current) {
      let attempts = 0;

      while (attempts < 5) {
        try {
          const response = await axios.post(`https://port-0-my-spring-app-m09c1v2t70d7f20e.sel4.cloudtype.app/api/users/${signInIdRef.current.value}/${signInPasswordRef.current.value}`, { timeout: 10000 });
          if (response.data === "") {
            setloginMessage("잘못된 아이디 또는 비밀번호")
          } else {
            setUser(response.data as User)
            sessionStorage.setItem('user', JSON.stringify(response.data));
            navigate('/home');
          }
          break;  // 성공 시 루프 탈출
        } catch (error: any) {
          attempts++;
          console.error(`Attempt ${attempts} failed for login. Error: ${error.message}`);
          if (attempts >= 5) {
            console.error(`All ${5} attempts failed for login.`);
            setloginMessage("서버 에러")
            break;
          }
          console.log(`Retrying login in ${1000 / 1000}s...`);
          await new Promise(resolve => setTimeout(resolve, 1000));
        }
      }
    }
  }
  
  return (
    <div className="loginContainer">
      <div className="loginBox" style={{margin: "auto auto"}}>
        <div ref={signUpRef} id="signUp" className={`signUp`} style={{ transform: isMovedLeft ? 'translateX(100%)' : 'translateX(0%)' }}>
          <h1>회원가입</h1>
          <span>{registerMessage}</span>
          <div className="input-group">
            <input className="loginField" ref={signUpNameRef} type="text" placeholder="닉네임" required></input>
          </div>
          <div className="input-group">
            <input className="loginField" ref={signUpIdRef} type="text" placeholder="아이디" required></input>
          </div>
          <div className="input-group">
            <input className="loginField" ref={signUpPasswordRef} type="password" placeholder="비밀번호" required></input>
          </div>
          <div className="input-group">
            <input className="loginField" ref={signUpCheckPasswordRef} type="password" placeholder="비밀번호 확인" required></input>
          </div>
          <div className="input-group">
            <input className="loginField" ref={signUpEmailRef} type="text" placeholder="이메일" required></input>
          </div>
          <div className="input-group">
            <input className="loginField" ref={signUpPhoneRef} type="text" placeholder="전화번호" required></input>
          </div>
          <button className="loginButton" onClick={registerUser}>회원가입</button>
        </div>

        <div id="signInDes" className={`signInDes ${isMovedLeft ? 'move-right' : ''}`}>
          <h1 style={{color: "white"}}> Hello MiC! </h1>
          <p style={{color: "white"}}>아이디와 비밀번호를 입력해주세요</p>
          <button className="changeBtn" onClick={handleButtonClick}>회원가입</button>
        </div>

        <div className={`changeBox ${isMovedLeft ? 'move-left' : ''}`}></div>

        <div id="signUpDes" className={`signUpDes ${isMovedLeft ? '' : 'move-left'}`}>
          <h1 style={{color: "white"}}> Wellcome MiC! </h1>
          <p style={{color: "white"}}>사용자 정보들을 입력해주세요</p>
          <p style={{color: "white"}}>비밀번호는 8자 이상이어야 하며</p>
          <p style={{color: "white"}}>영문자, 숫자를 포함해야합니다.</p>
          <button className="changeBtn" onClick={handleButtonClick}>로그인</button>
        </div>

        <div ref={signInRef} id="signIn" className={`signIn`} style={{ transform: isMovedLeft ? 'translateX(100%)' : 'translateX(0%)' }}>
          <h1>로그인</h1>
          <span>{loginMessage}</span>
          <div className="input-group">
            <input className="loginField" ref={signInIdRef} type="text" placeholder="아이디" required></input>
          </div>
          <div className="input-group">
            <input className="loginField" ref={signInPasswordRef} type="password" placeholder="비밀번호" required></input>
          </div>
          <button className="loginButton" onClick={loginUser}>로그인</button>
        </div>
      </div>
    </div>
  )
}

export default Login