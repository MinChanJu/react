import React from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Contest, Problem, User } from "../model/talbe";
import './css/ContestView.css';
import axios from "axios";

interface ContestViewProps {
  user: User
  contests: Contest[]
  problems: Problem[]
}

const ContestView: React.FC<ContestViewProps> = ({ user, contests, problems }) => {
  const { id } = useParams();
  const contest = contests.filter(contest => contest.id === Number(id));
  const contestProblems = problems.filter(problem => problem.contestId === Number(id));
  const navigate = useNavigate();

  const goToProblemId = (problemId: number) => {
    navigate(`/problem/${problemId}`);
  };

  const goToUserId = (userId: string) => {
    navigate(`/user/${userId}`);
  };

  const deleteContest = (contestId: number) => {
    axios.delete(`https://port-0-my-spring-app-m09c1v2t70d7f20e.sel4.cloudtype.app/api/contests/${contestId}`)
      .then(response => {
        console.log('Delete successful:', response.status);
        navigate('/contest')
        window.location.reload()
      })
      .catch(error => console.error('There was an error deleting the contest!', error));
  }

  const goToProblemMake = () => {
    navigate('/problem/make')
  }

  const goToContestEdit = () => {
    navigate(`/contest/edit/${id}`)
  }

  return (
    <div>
      <div className="ContestName">{contest[0]?.contestName}</div>
      <div className="ContestDescription">{contest[0]?.contestDescription}</div>
      <div className="ContestUserId">주최자 : <span onClick={() => { goToUserId(contest[0]?.userId) }}>{contest[0]?.userId}</span></div>
      {(user.authority === 5 || user.userId === contest[0]?.userId) &&
        <div className="owner" style={{marginTop: '30px'}}>
          <span className="editButton" onClick={goToContestEdit}>편집</span>
          <span className="deleteButton" onClick={() => { deleteContest(contest[0].id) }}>삭제</span>
        </div>
      }
      <div className='list'>
        {contestProblems.map((problem, index) => (
          <div className='element' onClick={() => { goToProblemId(problem.id) }} key={problem.id}>
            <h4>{index + 1}. {problem.problemName}</h4>
            <p>{problem.problemDescription.slice(0, 50)} ...</p>
          </div>
        ))}
        {(user.authority === 5 || user.userId === contest[0]?.userId) &&
        <div className="owner">
          <span className="addProblem" onClick={goToProblemMake}>문제 추가</span>
        </div>
        }
      </div>
    </div>
  )
}

export default ContestView