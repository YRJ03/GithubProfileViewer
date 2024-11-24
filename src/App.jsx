import { useState } from 'react';
import './App.css';

function App() {
  const [user, setUser] = useState('');
  const [result, setResult] = useState(null);
  const [error, setError] = useState(''); // Track errors

  const getUser = (e) => {
    setUser(e.target.value);
  };

  const fetchUser = async (e) => {
    e.preventDefault();

    // Clear any previous error when trying to fetch a new user
    setError('');
    setResult(null);

    if (user.trim() === '') {
      alert('Please enter a valid username');
      return;
    }

    try {
      let response = await fetch(`https://api.github.com/users/${user}`);

      if (!response.ok) {
        // Check if user not found (404 error)
        if (response.status === 404) {
          throw new Error('User not found');
        }
        throw new Error('Error fetching user data');
      }

      let data = await response.json();
      setResult(data);
      console.log(data);
    } catch (error) {
      // Handle errors and set error state
      console.error('Error fetching user:', error);
      setError(error.message);  // Set error message
      setResult(null);  // Clear previous result if error occurs
    }
  };

  return (
    <div className="app-container">
      <form onSubmit={fetchUser} className="search-form">
        <input
          type="text"
          placeholder="Enter GitHub username..."
          onChange={getUser}
          value={user}
          className="search-input"
        />
        <button type="submit" className="search-button">
          Search
        </button>
      </form>

      {/* Show error message if there is an error */}
      {error && <div className="error-message">{error}</div>}

      {result ? (
        <div className="profile-container">
          <div className="profile-header">
            <img
              src={result.avatar_url}
              alt={result.name}
              className="profile-avatar"
            />
            <div className="profile-info">
              <h2 className="profile-name">{result.name}</h2>
              <span className="profile-username">@{result.login}</span>
              <p className="profile-bio">{result.bio}</p>
            </div>
          </div>

          <div className="profile-stats">
            <div className="stats">
              <div className="stat-item">
                <h3>Following</h3>
                <span>{result.following}</span>
              </div>
              <div className="stat-item">
                <h3>Followers</h3>
                <span>{result.followers}</span>
              </div>
              <div className="stat-item">
                <h3>Repos</h3>
                <span>{result.public_repos}</span>
              </div>
            </div>
            <button className="profile-button">
              <a href={result.html_url} target="_blank" rel="noopener noreferrer">
                Visit Profile
              </a>
            </button>
          </div>
        </div>
      ) : (
        <div className="no-user">Github Profile Viewer</div>
      )}
    </div>
  );
}

export default App;
