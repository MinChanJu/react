import React, { useRef, useState } from "react";
import { Problem, User } from "../model/talbe";
import { useParams } from "react-router-dom";
import { autoResize } from "../model/commonFunction";
import { severObjectRetry } from "../model/serverRetry";
import axios from "axios";
import "./css/ProblemView.css";

interface ProblemViewProps {
  user: User
  problems: Problem[]
}

const ProblemView: React.FC<ProblemViewProps> = ({ user, problems }) => {
  const { id } = useParams();
  const problem = problems.filter(problem => problem.id === Number(id));
  const [lang, setLang] = useState<string>('Python');
  const [code, setCode] = useState<string>('');
  const [message, setMessage] = useState<string>('');
  const textareaRef = useRef<HTMLTextAreaElement | null>(null);

  const handleLanguageChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setLang(event.target.value);
  };

  const insertKey = (event: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (event.key === 'Tab') {
      event.preventDefault();
      const textarea = event.currentTarget;
      const start = textarea.selectionStart;
      const end = textarea.selectionEnd;
      setCode(code.substring(0, start) + '    ' + code.substring(end));
      requestAnimationFrame(() => { textarea.selectionStart = textarea.selectionEnd = start + 4; });
      autoResize(textarea);
    } else if (event.key === '(') {
      event.preventDefault();
      const textarea = event.currentTarget;
      const start = textarea.selectionStart;
      const end = textarea.selectionEnd;
      setCode(code.substring(0, start) + '()' + code.substring(end));
      requestAnimationFrame(() => { textarea.selectionStart = textarea.selectionEnd = start + 1; });
      autoResize(textarea);
    } else if (event.key === '{') {
      event.preventDefault();
      const textarea = event.currentTarget;
      const start = textarea.selectionStart;
      const end = textarea.selectionEnd;
      setCode(code.substring(0, start) + '{}' + code.substring(end));
      requestAnimationFrame(() => { textarea.selectionStart = textarea.selectionEnd = start + 1; });
      autoResize(textarea);
    } else if (event.key === '[') {
      event.preventDefault();
      const textarea = event.currentTarget;
      const start = textarea.selectionStart;
      const end = textarea.selectionEnd;
      setCode(code.substring(0, start) + '[]' + code.substring(end));
      requestAnimationFrame(() => { textarea.selectionStart = textarea.selectionEnd = start + 1; });
      autoResize(textarea);
    } else if (event.key === '"') {
      event.preventDefault();
      const textarea = event.currentTarget;
      const start = textarea.selectionStart;
      const end = textarea.selectionEnd;
      setCode(code.substring(0, start) + '""' + code.substring(end));
      requestAnimationFrame(() => { textarea.selectionStart = textarea.selectionEnd = start + 1; });
      autoResize(textarea);
    } else if (event.key === "'") {
      event.preventDefault();
      const textarea = event.currentTarget;
      const start = textarea.selectionStart;
      const end = textarea.selectionEnd;
      setCode(code.substring(0, start) + "''" + code.substring(end));
      requestAnimationFrame(() => { textarea.selectionStart = textarea.selectionEnd = start + 1; });
      autoResize(textarea);
    }
  };

  const handleInput = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    setCode(event.target.value);
    if (textareaRef.current) {
      autoResize(textareaRef.current);
    }
  };

  const submitCode = async () => {
    if (code !== "") {
      let attempts = 0;

      while (attempts < 5) {
        try {
          const response = await axios.post(`https://port-0-my-spring-app-m09c1v2t70d7f20e.sel4.cloudtype.app/api/code`, {
            code: code,
            lang: lang,
            problemId: problem[0]?.id
          }, { timeout: 10000 });
          setMessage(response.data);
          console.log(`code load complete`);
          break;  // 성공 시 루프 탈출
        } catch (error: any) {
          attempts++;
          console.error(`Attempt ${attempts} failed for code. Error: ${error.message}`);
          if (attempts >= 5) {
            console.error(`All ${5} attempts failed for code.`);
            setMessage("서버 에러")
            break;
          }
          console.log(`Retrying code in ${1000 / 1000}s...`);
          await new Promise(resolve => setTimeout(resolve, 1000));
        }
      }
    } else {
      setMessage("코드를 작성해주세요")
    }
  }

  return (
    <div className="Problem">
      <div className="prblemName">{problem[0]?.problemName}</div>
      <div className="resultMessage">{message}</div>
      <div className="titleDes">
        <div className="desName">문제 설명</div>
        <div className="problemDes">{problem[0]?.problemDescription}</div>
      </div>
      <div className="titleDes">
        <div className="desName">입력에 대한 설명</div>
        <div className="problemDes">{problem[0]?.problemInputDescription}</div>
      </div>
      <div className="titleDes">
        <div className="desName">출력에 대한 설명</div>
        <div className="problemDes">{problem[0]?.problemOutputDescription}</div>
      </div>
      <div className="doubleDes">
        <div className="titleDes">
          <div className="desName">입력 예제</div>
          <div className="problemDes">{problem[0]?.problemExampleInput}</div>
        </div>
        <div className="titleDes">
          <div className="desName">출력 예제</div>
          <div className="problemDes">{problem[0]?.problemExampleOutput}</div>
        </div>
      </div>
      <div className="doubleDes">
        <div className="titleDes">
          <div className="desName">코드</div>
        </div>
        <div className="titleDes left">
          <select className="desName" value={lang} onChange={handleLanguageChange}>
            <option value="Python">Python</option>
            <option value="C">C</option>
            <option value="JAVA">JAVA</option>
          </select>
        </div>
      </div>
      <textarea className="codeForm" ref={textareaRef} onInput={handleInput} onKeyDown={insertKey} spellCheck={false} value={code} id="code"></textarea>
      <div className="submitCode" onClick={submitCode}>제출</div>
    </div>
  )
}

export default ProblemView