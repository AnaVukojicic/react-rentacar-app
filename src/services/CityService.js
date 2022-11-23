import {requestInstance} from "../config/requestInstance";
import CityModel from "./models/CityModel";

class CityService {
    api = {
        cities: '/cities'
    }

    getAll(){
        return requestInstance.get(this.api.cities)
            .then(r => r?.data?.data?.map(item => new CityModel(item)))
            .catch(err => Promise.reject(err))
    }


}

export const cityService = new CityService();