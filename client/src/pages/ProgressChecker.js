import React, { useState, useEffect } from 'react';

const Calendar = ({ loginStreak }) => {
  return (
    <div>
      <h2>Calendar</h2>
      <p>Login Streak: {loginStreak} days</p>
    </div>
  );
};

function ProgressChecker() {
  const [loginStreak, setLoginStreak] = useState(0);

  useEffect(() => {
    const storedStreak = localStorage.getItem('loginStreak');
    if (storedStreak) {
      setLoginStreak(parseInt(storedStreak, 10));
    }
  }, []);

  return (
    <div>
      <h1>Progress Checker</h1>
      <Calendar loginStreak={loginStreak} />
    </div>
  );
}


export default ProgressChecker;
