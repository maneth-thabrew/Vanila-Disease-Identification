import axios from 'axios';
import { vars } from '../environment/variables';
import {handleErrors} from './Error.Handling.service';
import EventEmitter from '../utils/EventEmitter';

// import user from '../models/Patient';


const path = vars.SERVER_URL+"/users"; 
var user_list = [];

class UserService {

    async addUser(user){

        await axios.post(`${path}/sign-up`, user).then((response)=>{
            console.log(response);
            if(response.data){
                EventEmitter.emit("registerCompleted", {registered: true});
            } else {
                alert("Error Occured check your Email which should be uniq");
            }
            
        }).catch(handleErrors);
        console.log("User Entered!");
    }

    async getUserByUsername(username, password){
        let res = false;
        await axios.post(`${path}/sign-in`, {username, password}).then((response)=>{
            console.log(response);
            if(response.data.accessToken){

                // Load Session
                localStorage.setItem('username', username);
                if(response.data.session&&response.data.session.user&&response.data.session.user.data){
                    localStorage.setItem('role', response.data.session.user.data.role);
                    localStorage.setItem('user', JSON.stringify(response.data.session.user.data));
                    localStorage.setItem('district', response.data.session.user.data.district);
                }
                else {
                    localStorage.setItem('role', "User");
                    localStorage.setItem('user', JSON.stringify({}));
                }
                EventEmitter.emit("login", {logged: true});

                res = true;

            } else {
                res = false;
            }
        }).catch(handleErrors);
        return res;
    }

    async getUsers(){
        user_list = [];
        await axios.get(path).then((response)=>{
            user_list = [];
            response.data.forEach(doc=>{
                user_list.push(doc);
            });
        }).catch(handleErrors);
        return user_list;
    }

    async getUser(id){
        var obj = null;
        await axios.get(`${path}/${id}`).then((response)=>{
            
            obj =  response.data;
        }).catch(handleErrors);
        return obj;
    }

    async getUserForLogin(user){
        var obj = null;
        await axios.post(`${path}/login`, user).then((response)=>{
            obj =  response.data;
            console.log(obj);
        }).catch(handleErrors);
        return obj;
    }

    async getUserForForgetPassword(user){
        var obj = null;
        await axios.post(`${path}/forgot-password`, user).then((response)=>{
            obj =  response.data;
            console.log(obj);
        }).catch(handleErrors);
        return obj;
    }

    async uploadAvatar(id, user){
        var obj = null;
        console.log(user);
        await axios.post(`${path}/${id}/uploadImage`, user).then((response)=>{
            obj =  response.data;
            console.log(obj);
        }).catch(handleErrors);
        return obj;
    }



    async updateUser(id, user){
        await axios.post(`${path}/update/${id}`, user).then((response)=>{

        }).catch(handleErrors);
        alert("Selected User Updated");
    }

    async deleteUser(id){
        await axios.get(`${path}/delete/${id}`).then((response)=>{

        }).catch(handleErrors);
        alert("Selected User Removed");
    }

    
}

export default new UserService();