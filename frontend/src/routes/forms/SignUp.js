import React, { useRef, useState } from "react";
import "./container.css";
import { Link, useNavigate } from "react-router-dom";
import { TransitionGroup, CSSTransition } from 'react-transition-group';
import Notiflix from 'notiflix';
import UsersService from "../../services/Users.service";
import FilterGroup from "../../components/fillters/FilterGroup";
import FilterGroupAnime from "../../components/fillters/FilterGroupAnime";

function SignUp() {
    const navigate = useNavigate();
    const [username, setUsername] = useState('')
    const [name, setName] = useState('')
    const [phone, setPhone] = useState('')
    const [address, setAddress] = useState('')
    const [district, setDistrict] = useState('')
    const [role, setRole] = useState('Administrator')
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
        setName('')
        setRole('')
        setPhone('')
        setPass('')
        setCPass('')
    }

    const onSignUp = async (e) => {
        e.preventDefault();
        document.getElementById('submitBtn').disabled = true;
        document.getElementById('submitBtn').innerHTML = 'Loading...';
        // if(phone.length!==10) {
        //   Notiflix.Report.failure(
        //       'Incorect Phone Number',
        //       'Check your phone number and enter valid number',
        //       'Okay',
        //   );
        //   document.getElementById('submitBtn').disabled = false;
        //   document.getElementById('submitBtn').innerHTML = 'Try Again';
        //   return;
        // }
        if(pass===''||pass!==cpass) {
          Notiflix.Report.failure(
              'Password doesnt Math',
              'Check your password and confirm password',
              'Okay',
          );
          document.getElementById('submitBtn').disabled = false;
          document.getElementById('submitBtn').innerHTML = 'Try Again';
          return;
        }

        let obj = {
            username: username,
            fullName: name,
            contact: phone,
            address,
            district,
            role,
            password: pass
        }

        console.log(obj);

        await UsersService.addUser(obj).then(() => {
            clearInput()
            //handle success
            Notiflix.Report.success(
                'Success',
                "User Registration Successful",
                'Okay',
            );
            navigate('/main/sign-in');
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
      padding: 300,
      zIndex: 1999,
    }}>
        <CSSTransition nodeRef={nodeRef} in={inProp} timeout={200} classNames="my-node">
        <div className="cards fly-card-lg" ref={nodeRef}>
          <div>
          <div className="filters">
            <div className="popular">
              <h2 id="form-title" onClick={() => setInProp(true)}>SIGNUP</h2>
            </div>
            
            <FilterGroupAnime links={links} onAnime={() => setInProp(true)} setInProp={setInProp} inProp={inProp}/>
          </div>

          <form onSubmit={onSignUp} id="demoUserForm">
          <main>
            
            <div>
                <small>Username</small>
                <input type="text" name="txt-uname"
                  value={username}
                  onChange={(e)=> setUsername(e.target.value)}
                  onKeyUp={clearErrors}
                ></input>
            </div>
            
            <div>
                <small>Role</small>
                <select 
                  name="role"
                  placeholder="Select Your Role"
                  value={role}
                  onChange={(e)=> setRole(e.target.value)}
                  onKeyUp={clearErrors}   
                                    >
                    <option value={'Farmer'} selected>Farmer</option>
                    <option value={'Administrator'}>Administrator</option>
                    
                </select>
            </div>
            {role&&role==='Farmer'&&<>
            <div>
                <small>Full Name</small>
                <input type="text" name="txt-name"
                  value={name}
                  onChange={(e)=> setName(e.target.value)}
                  onKeyUp={clearErrors}
                ></input>
            </div>
            <div>
                <small>Contact Number</small>
                <input type="text" name="txt-phone"
                  value={phone}
                  onChange={(e)=> setPhone(e.target.value)}
                  onKeyUp={clearErrors}
                ></input>
            </div>
            <div>
                <small>District</small>
                <select 
                  name="role"
                  placeholder="Select Your District"
                  value={district}
                  onChange={(e)=> setDistrict(e.target.value)}
                  onKeyUp={clearErrors}   
                                    >
                    <option value={'Colombo'} selected>Colombo</option>
                    <option value={'Kalutara'}>Kalutara</option>
                    <option value={'Gampaha'}>Gampaha</option>
                    <option value={'Galle'}>Galle</option>
                    <option value={'Matara'}>Matara</option>
                    <option value={'Galle'}>Galle</option>
                    <option value={'Hambantota'}>Hambantota</option>
                    <option value={'Rathnapura'}>Rathnapura</option>
                    <option value={'Badulla'}>Badulla</option>
                    <option value={'Monaragala'}>Monaragala</option>
                    <option value={'Ampara'}>Ampara</option>
                    <option value={'Badulla'}>Badulla</option>
                    <option value={'NuwaraEliya'}>Nuwara Eliya</option>
                    <option value={'Kegalle'}>Kegalle</option>
                    <option value={'Kandy'}>Kandy</option>
                    <option value={'Matale'}>Matale</option>
                    <option value={'Kurunagala'}>Kurunagala</option>
                    <option value={'Puttalam'}>Puttalam</option>
                    <option value={'Anuradhapura'}>Anuradhapura</option>
                    <option value={'Polonnaruwa'}>Polonnaruwa</option>
                    <option value={'Batticola'}>Batticola</option>
                    <option value={'Trincomalee'}>Trincomalee</option>
                    <option value={'Mannar'}>Mannar</option>
                    <option value={'Vavuniya'}>Vavuniya</option>
                    <option value={'Mulaitivu'}>Mulaitivu</option>
                    <option value={'Kilinochchi'}>Kilinochchi</option>
                    <option value={'Jaffna'}>Jaffna</option>
                </select>
            </div>
            <div>
                <small>Address</small>
                <input type="text" name="txt-phone"
                  value={address}
                  onChange={(e)=> setAddress(e.target.value)}
                  onKeyUp={clearErrors}
                ></input>
            </div>
            </>}
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
              <button id="submitBtn" className="submit-button" type="submit">SIGN UP</button>
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

export default SignUp;