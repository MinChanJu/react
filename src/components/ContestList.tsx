import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Contest } from '../model/talbe';
import './List.css';

interface ContestListProps {
  contests: Contest[]
}

const ContestList:React.FC<ContestListProps> = ({contests}) => {
  const navigate = useNavigate();

  const goToContestId = (contestId:number) => {
    navigate(`/contest/${contestId}`);
  };

  return (
    <div className='list'>
      <h1>대회 목록</h1>
      {contests.map((contest) => (
        <div className='element' onClick={() => {goToContestId(contest.id)}} key={contest.id}>
          <h4>{contest.contestName}</h4>
          <p>{contest.contestDescription}</p>
          <div>주최: {contest.userId}</div>
        </div>
      ))}
    </div>
  );
}

export default ContestList;
