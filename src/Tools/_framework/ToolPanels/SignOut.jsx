import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useSetRecoilState } from 'recoil';
import { pageToolViewAtom } from '../NewToolRoot';
import Button from '../../../_reactComponents/PanelHeaderComponents/Button';

export default function SignOut() {
  const [signOutAttempted, setSignOutAttempted] = useState(false);
  const setPageToolView = useSetRecoilState(pageToolViewAtom);

  useEffect(() => {
    localStorage.clear(); //Clear out the profile
    indexedDB.deleteDatabase('keyval-store'); //Clear out the rest of the profile

    axios
      .get('/api/signOut.php', {params: {}})
      .then((resp) => {
      // console.log(">>>signout resp",resp)
      setSignOutAttempted(true);
      })
      .catch((error) => {
        this.setState({ error: error });
      });
  }, []);

  const vanillaCookies = document.cookie.split(';');

  if (vanillaCookies.length === 1 && vanillaCookies[0] === '') {
    return (
      <div>
        <div
          style={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            margin: '20',
          }}
        >
          <img
            style={{ width: '250px', height: '250px' }}
            src={'/media/Doenet_Logo_Frontpage.png'}
            alt={
              'Chocolate glazed donut on a white cartoon cloud, sitting on a sky blue circle background'
            }
          />
          <div style={{display: 'flex', flexDirection: 'column', alignItems: 'center'}}>
            <h2>You are Signed Out!</h2>
            <Button value="Homepage" onClick={() => {setPageToolView({page: 'home', tool: '', view: ''})}}/>
          </div>
        </div>
      </div>
    );
  }

  if (signOutAttempted) {
    return (
      <div>
        <div
          style={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            margin: '20',
          }}
        >
          <img
            style={{ width: '250px', height: '250px' }}
            src={'/media/Doenet_Logo_Frontpage.png'}
            alt={
              'Chocolate glazed donut on a white cartoon cloud, sitting on a sky blue circle background'
            }
          />
          <div>
            <h2>FAILED SIGN OUT</h2>
            <p>Please manually remove your cookies.</p>
          </div>
        </div>
      </div>
    );
  }


  return (
    <div>
      <div
        style={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          margin: '20',
        }}
      >
        <img
          style={{ width: '250px', height: '250px' }}
          src={'/media/Doenet_Logo_Frontpage.png'}
          alt={
            'Chocolate glazed donut on a white cartoon cloud, sitting on a sky blue circle background'
          }
        />
        <div>
          <h2>Signing you out...</h2>
        </div>
      </div>
    </div>
  );
}
