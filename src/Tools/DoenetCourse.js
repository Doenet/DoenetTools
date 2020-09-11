import React, { useState, useEffect} from "react";
// import { useParams } from "react-router";
import {
  HashRouter as Router,
  Switch,
  Route,
  Link,
  useParams
} from "react-router-dom";

// Params are placeholders in the URL that begin
// with a colon, like the `:id` param defined in
// the route in this example. A similar convention
// is used for matching dynamic segments in other
// popular web frameworks like Rails and Express.

console.log("Different Import")

function Child() {
  let { id } = useParams();
  console.log("This is id!", id);

  return(
    <p>This is {id}</p>
  )
}

function Post({match}) {
  console.log("This is match", match);
  console.log("This is params", match.params);
  let { id } = match.params;

  return(
    <p>Post: {id}</p>
  )
}

function ParamsPost() {
  const [name, setName] =useState("");

  useEffect(() => {
    let { id } = useParams();
    setName(id);
  })

  return(
    <p>ParamsPost: {name}</p>
  )
}

function Mounting({match}) {
  const [name, setName] = useState("");

  function onClick() {
    let { id } = useParams();
    setName(id);
  }

  return(
    <button onClick={onClick}>
      Currently Selected: {name}
    </button>
  )
}

export default function ParamsExample() {
  return (
    <Router>
      <div>
        <h2>Accounts</h2>

        <ul>
          <li>
            <Link to="/netflix">Netflix</Link>
          </li>
          <li>
            <Link to="/zillow-group">Zillow Group</Link>
          </li>
          <li>
            <Link to="/yahoo">Yahoo</Link>
          </li>
          <li>
            <Link to="/modus-create">Modus Create</Link>
          </li>
        </ul>

        <Switch>
          {/* <Route path="/:id" render={({match}) => <Post match={match}/>} /> */}
          {/* <Route path="/:id">
            <ParamsPost/>
          </Route> */}
          {/* <Route path="/:id" render={({match}) => <Mounting match={match}/>} /> */}
          <Route path="/:id" children={<Child/>} />
        </Switch>
      </div>
    </Router>
  );
}
