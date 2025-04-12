import React, { useRef, useState } from "react";
import "./container.css";
import { Link, useNavigate } from "react-router-dom";
import { TransitionGroup, CSSTransition } from 'react-transition-group';
import logo from './logo.png'
import Notiflix from "notiflix";
import UsersService from "../../services/Users.service";
import FilterGroup from "../../components/fillters/FilterGroup";
import FilterGroupAnime from "../../components/fillters/FilterGroupAnime";

function SignIn() {
  const navigate = useNavigate();
  const [username, setUsername] = useState('')
  const [pass, setPass] = useState('')
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

    

    await UsersService.getUserByUsername(username, pass).then((data) => {
        
        if(data){
          clearInput()
          //handle success
            Notiflix.Report.success(
              'Success',
              "Login Successful",
              'Okay',
          );
          navigate('/main');
        } else {
          Notiflix.Report.failure(
              'Login Failed',
              'Check your credentials again',
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
              <h2 id="form-title" >SIGNIN</h2>
            </div>
            <FilterGroupAnime links={links} onAnime={() => setInProp(true)} setInProp={setInProp} inProp={inProp}/>
          </div>

          <form onSubmit={onSignIn} id="demoUserForm">
          <main>
            <div>
                <small>Name</small>
                <input type="text" name="txt-uname"
                  value={username}
                  placeholder="Your Username"
                  onChange={(e)=> setUsername(e.target.value)}
                  onKeyUp={clearErrors}
                ></input>
            </div>
            <div>
                <small>Password</small>
                <input 
                    name="pass"
                    type="password" 
                    placeholder="Password*"
                    value={pass}
                    onChange={(e)=> setPass(e.target.value)}
                    onKeyUp={clearErrors}   
                />
            </div>
            <div className="">
              <Link to={'/main/forgot-password'} className="form-link">Forgot Password?</Link>
              <button id="submitBtn" type="submit" className="submit-button">SIGN IN</button>
              {localStorage.getItem('username')&&<button id="homeBtn" onClick={() => navigate('/main')} className="submit-button">TO HOME</button>}
            </div>
          </main>
          </form>

          </div>
          
        </div>
        </CSSTransition>
      </div>
  );
}

export default SignIn;