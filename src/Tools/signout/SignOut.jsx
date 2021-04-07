import React, { useState } from 'react';
import logo from '../../Media/Doenet_Logo_Frontpage.png';
import Cookies from 'js-cookie';
import axios from 'axios';

export default function SignOut(props) {
  const [signedOutAttempts, setSignedOutAttempts] = useState(0);

  const phpUrl = '/api/signOut.php';
  const data = {};
  const payload = {
    params: data,
  };
  axios
    .get(phpUrl, payload)
    .then((resp) => {
      console.log(resp.data);
    })
    .catch((error) => {
      this.setState({ error: error });
    });

  const vanillaCookies = document.cookie.split(';');

  Cookies.remove('TrackingConsent', { path: '/', sameSite: 'strict' });
  // removeCookie('JWT_JS', { path: "/" })
  Cookies.remove('Stay', { path: '/', expires: 24000, sameSite: 'strict' });
  Cookies.remove('Device', { path: '/', expires: 24000, sameSite: 'strict' });

  console.log('>>>Cookies', Cookies.get(), vanillaCookies);
  if (vanillaCookies.length === 1 && vanillaCookies[0] === '') {
    return (
      <>
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
          <img style={{ width: '250px', height: '250px' }} src={logo} />
          <div>
            <h2>You are Signed Out!</h2>
          </div>
        </div>
      </>
    );
  }

  if (signedOutAttempts > 4) {
    return (
      <>
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
          <img style={{ width: '250px', height: '250px' }} src={logo} />
          <div>
            <h2>FAILED SIGN OUT</h2>
            <p>Please manually remove your cookies.</p>
          </div>
        </div>
      </>
    );
  }

  setTimeout(() => {
    setSignedOutAttempts(signedOutAttempts + 1);
  }, 100);

  return (
    <>
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
        <img style={{ width: '250px', height: '250px' }} src={logo} />
        <div>
          <h2>Signing you out...</h2>
        </div>
      </div>
    </>
  );
}
