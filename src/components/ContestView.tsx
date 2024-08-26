import React from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Contest, Problem } from "../model/talbe";
import './ContestView.css';

interface ContestViewProps {
  contests: Contest[]
  problems: Problem[]
}

const ContestView:React.FC<ContestViewProps> = ({contests, problems}) => {
  const { id } = useParams();
  const contest = contests.filter(contest => contest.id === Number(id));
  const contestProblems  = problems.filter(problem => problem.contestId === Number(id));
  const navigate = useNavigate();

  const goToProblemId = (problemId:number) => {
    navigate(`/problem/${problemId}`);
  };

  return (
    <div>
      <div className="ContestName">{ contest[0]?.contestName }</div>
      <div className="ContestDescription">{ contest[0]?.contestDescription }</div>
      <div className="ContestUserId">주최자 : { contest[0]?.userId }</div>
      <div className='list'>
        {contestProblems.map((problem, index) => (
          <div className='element' onClick={() => {goToProblemId(problem.id)}} key={problem.id}>
            <h4>{index+1}. {problem.problemName}</h4>
            <p>{problem.problemDescription}</p>
          </div>
        ))}
      </div>
    </div>
  )
}

export default ContestView