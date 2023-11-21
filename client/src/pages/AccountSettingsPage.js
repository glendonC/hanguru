import React, { useState } from 'react';

export default function AccountSettingsPage() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [profilePic, setProfilePic] = useState(null);

  const handleUsernameChange = (e) => {
    e.preventDefault();

  };

  const handlePasswordChange = (e) => {
    e.preventDefault();

  };

  const handleProfilePicChange = (e) => {
    e.preventDefault();

  };

  return (
    <div>


      <form onSubmit={handleProfilePicChange}>
        <label>
          Profile Picture:
          <input type="file" onChange={e => setProfilePic(e.target.files[0])} />
        </label>
        <button type="submit">Update Profile Picture</button>
      </form>

      <form onSubmit={handleUsernameChange}>
        <label>
          New Username:
          <input type="text" value={username} onChange={e => setUsername(e.target.value)} />
        </label>
        <button type="submit">Change Username</button>
      </form>

      <form onSubmit={handlePasswordChange}>
        <label>
          New Password:
          <input type="password" value={password} onChange={e => setPassword(e.target.value)} />
        </label>
        <button type="submit">Change Password</button>
      </form>
    </div>
  );
}
