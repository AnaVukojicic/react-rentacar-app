import {requestInstance} from "../config/requestInstance";
import VehicleModel from "./models/VehicleModel";

class VehicleService {
    api = {
        vehicles: '/vehicles'
    }

    params = {
        search: 'search='
    }

    getVehicleById(id){
        return requestInstance.get(`${this.api.vehicles}/${id}`)
            .then(r => new VehicleModel(r?.data?.data))
            .catch(err => Promise.reject(err))
    }

    getAll(query){
        const queryParam = query?.length > 0 ? `?${this.params.search}${query}` : '';
        return requestInstance.get(`${this.api.vehicles}${queryParam}`)
            .then(r => query ? r?.data?.data?.map(item => new VehicleModel(item)) : r?.data.map(item=>new VehicleModel(item)))
            .catch(err => Promise.reject(err))
    }

    add(data){
        const formData = {
            "plate_number": data?.plates,
            "production_year": data?.year,
            "type": data?.type,
            "number_of_seats": data?.seats,
            "daily_rate": data?.price,
            "note": data?.note ? data?.note : null
        };
        return requestInstance.post(this.api.vehicles, formData)
            .then(r => new VehicleModel(r.data))
            .catch(err => Promise.reject(err))
    }

    edit(id,data){
        const formData = {
            "plate_number": data?.plates,
            "production_year": data?.year,
            "type": data?.type,
            "number_of_seats": data?.seats,
            "daily_rate": data?.price,
            "note": data?.note
        };
        return requestInstance.put(`${this.api.vehicles}/${id}`, formData)
            .then(r => new VehicleModel(r.data))
            .catch(err => Promise.reject(err))
    }

    delete(id){
        return requestInstance.delete(`${this.api.vehicles}/${id}`)
            .then(r => new VehicleModel(r.data))
            .catch(err => Promise.reject(err))
    }

}

export const vehicleService = new VehicleService();