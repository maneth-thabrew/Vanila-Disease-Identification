import React, { useRef, useState } from "react";
import "./container.css";
import { Link, useNavigate } from "react-router-dom";
import { TransitionGroup, CSSTransition } from 'react-transition-group';
import logo from './logo.png'
import Notiflix from "notiflix";
import UsersService from "../../services/Users.service";
import FilterGroup from "../../components/fillters/FilterGroup";
import FilterGroupAnime from "../../components/fillters/FilterGroupAnime";

function ForgotPassword() {
  const navigate = useNavigate();
  const [username, setUsername] = useState('')
  const [contact, setContact] = useState('')
  const [pass, setPass] = useState('')
  const [cpass, setCPass] = useState('')
  const [errors, setErrors] = useState([])
  const links = [
    { to: '/main/sign-in', name: 'Sign In' },
    { to: '/main/sign-up', name: 'Sign Up' }
  ];

  const [inProp, setInProp] = useState(false);
  const nodeRef = useRef(null);

  const clearErrors = () => {
    setErrors([])
}

const clearInput = () => {
    setUsername('')
    setPass('')
}

const onSignIn = async (e) => {
    e.preventDefault();
    document.getElementById('submitBtn').disabled = true;
    document.getElementById('submitBtn').innerHTML = 'Loading...';

    if((pass!==cpass)||(pass==='')) {
      Notiflix.Report.failure(
        'Invaid values',
        'Password need to match with retyped password while not being empty',
        'Okay',
    );
      return 
    }
    
    let obj = {
      username,
      contact,
      password: pass
    }
    await UsersService.getUserForForgetPassword(obj).then((data) => {
        
        if(data){
          clearInput()
          //handle success
            Notiflix.Report.success(
              'Success',
              "Password Updated",
              'Okay',
          );
          navigate('/main/sign-in');
        } else {
          Notiflix.Report.failure(
              'Activity Failed',
              'Password updating Failed',
              'Okay',
          );
          document.getElementById('submitBtn').disabled = false;
          document.getElementById('submitBtn').innerHTML = 'Try Again';
        }
        
    }).catch((error) => {
        const { response } = error;
        if(response.status === 500) {
            Notiflix.Report.failure(
                'An error occurred',
                response.data.message,
                'Okay',
            );
        }
    });
}
  return (
    <div style={{
      display: 'flex',
      position: 'fixed',
      top: 0,
      left: 0,
      width: '100%',
      height: '100%',
      backgroundColor: 'rgba(0, 0, 0, 0.5)',
      backdropFilter: 'blur(5px)',
      justifyContent: 'center',
      alignItems: 'center',
      zIndex: 1999,
    }}>
        <CSSTransition nodeRef={nodeRef} in={inProp} timeout={200} classNames="my-node">
        <div className="cards fly-card" ref={nodeRef}>
          {/* <div className="img-sect">

            
            <img src={logo} alt="logo"/>
            <br></br>
            <h3>Welcome</h3>
            <p>orem ipsum dolor sit amet, consectetur adipiscing elit. </p>
          </div> */}
          <div>

          <div className="filters">
            <div className="popular">
              <h2 id="form-title" >New Password</h2>
            </div>
            <FilterGroupAnime links={links} onAnime={() => setInProp(true)} setInProp={setInProp} inProp={inProp}/>
          </div>

          <form onSubmit={onSignIn} id="demoUserForm">
          <main>
            <div>
                <small>Provide Your Username</small>
                <input type="text" name="txt-uname"
                  value={username}
                  placeholder="Your Username"
                  onChange={(e)=> setUsername(e.target.value)}
                  onKeyUp={clearErrors}
                ></input>
            </div>
            <div>
                <small>Provide Your Phone Number</small>
                <input type="text" name="txt-contact"
                  value={contact}
                  placeholder="Your Phone Number"
                  onChange={(e)=> setContact(e.target.value)}
                  onKeyUp={clearErrors}
                ></input>
            </div>
            <div>
                <small>New Password</small>
                <input 
                    name="pass"
                    type="password" 
                    placeholder="New Password*"
                    value={pass}
                    onChange={(e)=> setPass(e.target.value)}
                    onKeyUp={clearErrors}   
                />
            </div>
            <div>
                <small>Confirm Password</small>
                <input 
                    name="pass"
                    type="password" 
                    placeholder="Confirm Password*"
                    value={cpass}
                    onChange={(e)=> setCPass(e.target.value)}
                    onKeyUp={clearErrors}   
                />
            </div>
            <div className="">
              <button id="submitBtn" type="submit" className="submit-button">CONFIRM NEW PASSWORD</button>
              <button id="homeBtn" onClick={() => navigate('/main/sign-in')} className="submit-button">BACK</button>
            </div>
          </main>
          </form>

          </div>
          
        </div>
        </CSSTransition>
      </div>
  );
}

export default ForgotPassword;