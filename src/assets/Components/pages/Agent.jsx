import React from 'react'

const Agent = ({user}) => {
  return (
    <div className="company-profile">
      <h3>Welcome {user.userName}</h3>
      <p>Roles: {user.roles.join(', ')}</p>
      <p>Email:{user.email}</p>
    </div>
  )
}

export default Agent