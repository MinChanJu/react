import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Problem } from '../model/talbe';
import './List.css';

interface ProblemListProps {
  problems: Problem[]
}

const ProblemList:React.FC<ProblemListProps> = ({problems}) => {
  const navigate = useNavigate();

  const goToProblemId = (problemId:number) => {
    navigate(`/problem/${problemId}`);
  };

  return (
    <div className='list'>
      <h1>문제 목록</h1>
      {problems.map((problem) => (
        <div className='element' onClick={() => {goToProblemId(problem.id)}} key={problem.id}>
          <h4>{problem.problemName}</h4>
          <div>{problem.contestName}</div>
          {problem.contestName === "" && <div> 대회에 속하지 않음 </div>}
        </div>
      ))}
    </div>
  );
}

export default ProblemList;
