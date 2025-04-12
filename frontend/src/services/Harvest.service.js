import axios from 'axios';
import { vars } from '../environment/variables';
import {handleErrors} from './Error.Handling.service';
import EventEmitter from '../utils/EventEmitter';

const path = vars.SERVER_URL+"/harvest"; 
var harvest_list = [];

class HarvestService {

    async addHarvest(harvest){
        await axios.post(`${path}/add`, harvest).then((response)=>{
            
            
        }).catch(handleErrors);
        console.log("Harvest Entered!");
    }

    async getHarvests(){
        harvest_list = [];
        await axios.get(path).then((response)=>{
            harvest_list = [];
            response.data.forEach(doc=>{
                harvest_list.push(doc);
            });
        }).catch(handleErrors);
        return harvest_list;
    }

    async getHarvestsOfUser(user){
        harvest_list = [];
        await axios.get(path).then((response)=>{
            harvest_list = [];
            response.data.forEach(doc=>{
                if(doc.user===user)
                    harvest_list.push(doc);
            });
        }).catch(handleErrors);
        return harvest_list;
    }

    async getHarvest(id){
        var obj = null;
        await axios.get(`${path}/${id}`).then((response)=>{
            
            obj =  response.data;
        }).catch(handleErrors);
        return obj;
    }

    async deleteHarvest(id){
        await axios.get(`${path}/delete/${id}`).then((response)=>{

        }).catch(handleErrors);
    }

    
}

export default new HarvestService();