import React, { useState, useEffect } from 'react';
import axios from 'axios';

const Team = () => {
  const [team, setTeam] = useState([]);

  const [hoverTeam, setHoverTeam] = useState(null);

  useEffect(() => {
    axios.get('http://localhost:4001/api/v1/members')
      .then(response => {
        setTeam(response.data.team);
      })
      .catch(error => {
        console.error('Error fetching data:', error);
      });
  }, []);

  const handleMouseEnter = (team) => {
    setHoverTeam(team);
  };

  const handleMouseLeave = () => {
    setHoverTeam(null);
  };

  return (
    <div>
      <div className="navbar">
      </div>

      <div className="recent-projects-section" style={{ backgroundColor: 'gray', color: 'white', padding: '15px', marginTop: '-15px', marginBottom: '1cm' }}>
        <h1 style={{ textAlign: 'center', fontWeight: 'bold', fontSize: '40px', fontFamily: 'Georgia, serif' }}>Team Members</h1>
      </div>

      <div className="portfolio-section">
        <div className="container">
          <div className="row portfolio-container">
            {team.map(teams => (
              <div
                key={teams._id}
                className="col-lg-4 col-md-4 col-sm-4 portfolio-item mix"
                onMouseEnter={() => handleMouseEnter(teams)}
                onMouseLeave={handleMouseLeave}
                style={{ position: 'relative', marginBottom: '1cm' }}
              >
                <div className="pd" style={{ position: 'relative' }}>
                  <img
                    src={teams.images[0].url}
                    alt={teams.name}
                    style={{ width: '100%', height: '100%' }}
                  />

                  {hoverTeam && hoverTeam._id === teams._id && (
                    <div
                      className="hovered-content"
                      style={{
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        width: '100%',
                        height: '100%',
                        backgroundColor: 'rgba(169, 169, 169, 0.8)',
                        borderRadius: '4px',
                        display: 'flex',
                        flexDirection: 'column',
                        justifyContent: 'center',
                        alignItems: 'left',
                        color: 'white',
                        fontWeight: 'bold',
                        fontFamily: 'Georgia, serif'
                      }}
                    >
                      <p>Name: {teams.name}</p>
                      <p>Position: {teams.position}</p>
                      <p>Description: {teams.description}</p>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Team;
