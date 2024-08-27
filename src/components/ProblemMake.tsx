import React, { useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { CurrentContest, User } from "../model/talbe";
import { autoResize } from "../model/commonFunction";
import axios from "axios";
import "./css/ProblemMake.css"

interface ProblemMakeProps {
  currentContest: CurrentContest
  user: User
}

interface Example {
  id: number;
  inputRef: React.RefObject<HTMLTextAreaElement>;
  outputRef: React.RefObject<HTMLTextAreaElement>;
}

const ProblemMake: React.FC<ProblemMakeProps> = ({ currentContest, user }) => {
  const navigate = useNavigate();
  const [makeMessage, setMakeMessage] = useState<string>('')
  const [examples, setExamples] = useState<Example[]>([]);
  const problemNameRef = useRef<HTMLInputElement | null>(null);
  const problemDescriptionRef = useRef<HTMLTextAreaElement | null>(null);
  const problemInputDescriptionRef = useRef<HTMLTextAreaElement | null>(null);
  const problemOutputDescriptionRef = useRef<HTMLTextAreaElement | null>(null);
  const problemExampleInputRef = useRef<HTMLTextAreaElement | null>(null);
  const problemExampleOutputRef = useRef<HTMLTextAreaElement | null>(null);
  const refs = [
    problemNameRef,
    problemDescriptionRef,
    problemInputDescriptionRef,
    problemOutputDescriptionRef,
    problemExampleInputRef,
    problemExampleOutputRef
  ];

  const handleInput = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    autoResize(event.target);
  };

  const addExample = () => {
    setExamples(prevExamples => [
      ...prevExamples,
      {
        id: Date.now(),
        inputRef: React.createRef<HTMLTextAreaElement>(),
        outputRef: React.createRef<HTMLTextAreaElement>(),
      }
    ]);
  };

  const handleSubmit = (cont: number) => {
    if (problemNameRef.current &&
      problemDescriptionRef.current &&
      problemInputDescriptionRef.current &&
      problemOutputDescriptionRef.current &&
      problemExampleInputRef.current &&
      problemExampleOutputRef.current) {
      setMakeMessage("")

      if (problemNameRef.current.value !== "" &&
        problemDescriptionRef.current.value !== "" &&
        problemInputDescriptionRef.current.value !== "" &&
        problemOutputDescriptionRef.current.value !== "") {

        const exampleData = examples.map(example => ({
          exampleInput: example.inputRef.current?.value,
          exampleOutput: example.outputRef.current?.value,
        }));

        const requestData = {
          contestId: currentContest.contestId,
          contestName: currentContest.contestName,
          userId: user.userId,
          problemName: problemNameRef.current.value,
          problemDescription: problemDescriptionRef.current.value,
          problemInputDescription: problemInputDescriptionRef.current.value,
          problemOutputDescription: problemOutputDescriptionRef.current.value,
          problemExampleInput: problemExampleInputRef.current.value,
          problemExampleOutput: problemExampleOutputRef.current.value,
          examples: exampleData
        };
        console.log(requestData)
        axios.post(`https://port-0-my-spring-app-m09c1v2t70d7f20e.sel4.cloudtype.app/api/problems/create`, requestData)
          .then(response => {
            if (response.data === "") {
              setMakeMessage("서버 오류")
            } else {
              if (cont === 1) {
                setExamples([])
                refs.forEach(ref => {
                  if (ref.current) {
                    ref.current.value = "";
                  }
                });
              } else {
                navigate(`/contest/${currentContest.contestId}`)
                window.location.reload()
              }
            }
          })
          .catch(error => setMakeMessage("이미 존재하는 문제 이름 또는 서버 에러"));
      } else {
        setMakeMessage("설명을 채워 넣어주세요")
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
          <h2>문제 정보 기입</h2>
          {currentContest.contestName === "" && <div>대회에 종속되지 않음</div>}
          {currentContest.contestName !== "" && <div>Contest Id: {currentContest.contestId} Contest Name: {currentContest.contestName}</div>}
          <span>{makeMessage}</span>
          <div className="make-group">
            <div className="makeTitle">문제 제목</div>
            <input className="makeField" ref={problemNameRef} type="text"></input>
          </div>
          <div className="make-group">
            <div className="makeTitle">문제 설명</div>
            <textarea className="makeField" ref={problemDescriptionRef} style={{ minHeight: '100px' }} onInput={handleInput} />
          </div>
          <div className="make-group">
            <div className="makeTitle">입력에 대한 설명</div>
            <textarea className="makeField" ref={problemInputDescriptionRef} style={{ minHeight: '100px' }} onInput={handleInput} />
          </div>
          <div className="make-group">
            <div className="makeTitle">출력에 대한 설명</div>
            <textarea className="makeField" ref={problemOutputDescriptionRef} style={{ minHeight: '100px' }} onInput={handleInput} />
          </div>
          <div className="double-make-group">
            <div className="make-group">
              <div className="makeTitle">입력 예제</div>
              <textarea className="makeField" ref={problemExampleInputRef} style={{ minHeight: '100px' }} onInput={handleInput} />
            </div>
            <div className="make-group">
              <div className="makeTitle">출력 예제</div>
              <textarea className="makeField" ref={problemExampleOutputRef} style={{ minHeight: '100px' }} onInput={handleInput} />
            </div>
          </div>
          {examples.map((example) => (
            <div key={example.id} className="double-make-group">
              <div className="make-group">
                <div className="makeTitle">입력 예제</div>
                <textarea className="makeField" ref={example.inputRef} style={{ minHeight: '100px' }} onInput={handleInput} />
              </div>
              <div className="make-group">
                <div className="makeTitle">출력 예제</div>
                <textarea className="makeField" ref={example.outputRef} style={{ minHeight: '100px' }} onInput={handleInput} />
              </div>
            </div>
          ))}
          <div className="addExample" onClick={addExample}>예제 추가</div>
          <div className="double-make-group">
            <div className="makeButton" onClick={() => { handleSubmit(1) }}>문제 추가</div>
            <div className="makeButton" onClick={() => { handleSubmit(0) }}>대회 완성</div>
          </div>
        </div>
      }
    </div>
  )
}

export default ProblemMake