import React, { useEffect, useState } from 'react';
import { HashRouter as Router, Routes, Route } from 'react-router-dom';
import { Contest, CurrentContest, Problem, User } from './model/talbe';
import { severComposeArrayRetry } from './model/serverRetry';
import Header from './components/Header';
import Home from './components/Home';
import ContestList from './components/ContestList';
import ProblemList from './components/ProblemList';
import ContestView from './components/ContestView';
import ProblemView from './components/ProblemView';
import UserView from './components/UserView';
import SettingView from './components/SettingView';
import ContestMake from './components/ContestMake';
import ProblemMake from './components/ProblemMake';
import EditContest from './components/EditContest';
import EditProblem from './components/EditProblem';
import Login from './components/Login';
import './App.css';

const App: React.FC = () => {
  const [user, setUser] = useState<User>(() => {
    const savedUser = sessionStorage.getItem('user');
    return savedUser ? JSON.parse(savedUser) : { id: -1, name: '', userId: '', userPw: '', phone: '', email: '', authority: 0, createdAt: '' };
  });
  const [currentContest,setCurrentContest] = useState<CurrentContest>({contestId:-1, contestName: ''})
  const [problems, setProblems] = useState<Problem[]>([]);
  const [contests, setContests] = useState<Contest[]>([]);

  useEffect(() => {
    severComposeArrayRetry<Problem,Contest>('data', setProblems, setContests);
  }, []);

  return (
    <Router>
      <Header user={user} setUser={setUser} problems={problems} contests={contests} setCurrentContest={setCurrentContest} />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/home" element={<Home />} />
        <Route path="/login" element={<Login setUser={setUser} />} />
        <Route path="/contest" element={<ContestList user={user} contests={contests} setCurrentContest={setCurrentContest} />} />
        <Route path="/contest/edit/:id" element={<EditContest user={user} contests={contests} />} />
        <Route path="/contest/make" element={<ContestMake user={user} setCurrentContest={setCurrentContest} />} />
        <Route path="/contest/:id" element={<ContestView user={user} contests={contests} problems={problems} />} />
        <Route path="/problem" element={<ProblemList user={user} problems={problems} />} />
        <Route path="/problem/edit/:id" element={<EditProblem problems={problems} />} />
        <Route path="/problem/make" element={<ProblemMake currentContest={currentContest} user={user} />} />
        <Route path="/problem/:id" element={<ProblemView user={user} problems={problems} />} />
        <Route path="/user/:id" element={<UserView />} />
        <Route path="/setting" element={<SettingView user={user} contests={contests} problems={problems} />} />
      </Routes>
    </Router>
  );
}

export default App;
