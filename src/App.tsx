import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Contest, Problem, User } from './model/talbe';
import axios from 'axios';
import Header from './components/Header';
import Home from './components/Home';
import ContestList from './components/ContestList';
import ProblemList from './components/ProblemList';
import UserList from './components/UserList';
import ContestView from './components/ContestView';
import ProblemView from './components/ProblemView';
import Login from './components/Login';
import './App.css';

const App:React.FC = () => {
  const [user, setUser] = useState<User>(() => {
    const savedUser = sessionStorage.getItem('user');
    return savedUser ? JSON.parse(savedUser) : {id: -1, name: '', userId: '', userPw: '', phone: '', email: '', authority: 0, createdAt: ''};
  });

  const [problems, setProblems] = useState<Problem[]>([]);
  const [contests, setContests] = useState<Contest[]>([]);
  
  useEffect(() => {
    if (problems.length === 0) {
      axios.post('https://port-0-my-spring-app-m09c1v2t70d7f20e.sel4.cloudtype.app/api/problems')
        .then(response => {setProblems(response.data as Problem[]); console.log("problems load complete")})
        .catch(error => console.error('There was a problem with the axios request:', error));
    }
  }, [problems.length]);

  useEffect(() => {
    if (contests.length === 0) {
      axios.post('https://port-0-my-spring-app-m09c1v2t70d7f20e.sel4.cloudtype.app/api/contests')
        .then(response => {setContests(response.data as Contest[]); console.log("contests load complete")})
        .catch(error => console.error('There was a contest with the axios request:', error));
    }
  }, [contests.length]);

  return (
    <Router basename="/react">
      <Header user={user} setUser={setUser} />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/home" element={<Home />} />
        <Route path="/login" element={<Login setUser={setUser} />} />
        <Route path="/contest" element={<ContestList contests={contests} />} />
        <Route path="/contest/:id" element={<ContestView contests={contests} problems={problems} />} />
        <Route path="/problem" element={<ProblemList problems={problems} />} />
        <Route path="/problem/:id" element={<ProblemView problems={problems} />} />
        <Route path="/user" element={<UserList />} />
      </Routes>
    </Router>
  );
}

export default App;
