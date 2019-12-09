import React, { useState, useEffect}  from 'react';
import './App.css';

interface user {
  id: number;
  name: string;
}

enum serverState{
    ASKING,
    AVAILABLE,
    NOT_AVAILABLE
}

export const SubscribedUsers: React.FC = () => {
    let [isServerAvailable, setIsServerAvailable] = useState<serverState>(serverState.ASKING)
    let [errorMsg, setErrorMsg] = useState<String>("")
    let [users,setUsers] = useState<user[]>([])

    useEffect(() => {
      const getServerStatus = () =>
        fetch('/serverstatus')
        .then(response => response.json())
        .then(data =>
          {
            console.log(data)
            if (data.status === "OK")
            {
              setIsServerAvailable(serverState.AVAILABLE)
              fetchUsers();
            }
            else
            {
              setIsServerAvailable(serverState.NOT_AVAILABLE)
              setErrorMsg(data.msg)
            }
          })
        setInterval(() => {
           getServerStatus();
        }, 1000);
    },[])

    const fetchUsers = () =>
    {
      fetch('/users')
      .then(response => response.json())
      .then(data => setUsers(data))
    }

    const serverNotAvailableMsg = () =>
    {
      switch(isServerAvailable) {
        case serverState.ASKING:
          return <div>Loading...</div>
        case serverState.NOT_AVAILABLE:
          if (errorMsg)
            return <div>Server is not available with error: {errorMsg}</div>
          else
            return <div>Server is not available with unknown error</div>
        default:
            return null;
      }      
    }

    if (isServerAvailable !== serverState.AVAILABLE)
    {
      return serverNotAvailableMsg()
    }
    return ( <div>
        <h2>Subscribed Users:</h2>
        <ul>
        { users.map((user) => <li key={user['id']}> Id: {user['id']} | Name: {user['name']} </li>)}
        </ul>
      </div>
    );
  }

