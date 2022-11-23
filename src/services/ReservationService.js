import {requestInstance} from "../config/requestInstance";
import ReservationModel from "./models/ReservationModel";

class ReservationService {
    api = {
        reservations: '/reservations'
    }

    params = {
        search: 'search='
    }

    getReservationById(id){
        return requestInstance.get(`${this.api.reservations}/${id}`)
            .then(r => new ReservationModel(r?.data?.data))
            .catch(err => Promise.reject(err))
    }

    getAll(query){
        const queryParam = query?.length > 0 ? `?${this.params.search}${query}` : '';
        return requestInstance.get(`${this.api.reservations}${queryParam}`)
            .then(r => r?.data?.data?.map(item => new ReservationModel(item)))
            .catch(err => Promise.reject(err))
    }

    add(data){
        const formData = {
            "customer_id": data?.clientsName,
            "vehicle_id": data?.vehicleId,
            "date_from": data?.dateFrom,
            "date_to": data?.dateTo,
            "pickup_location": data?.pickUp,
            "drop_off_location": data?.dropOff,
            'price':data?.totalPrice
        };
        return requestInstance.post(this.api.reservations, formData)
            .then(r => new ReservationModel(r.data))
            .catch(err => Promise.reject(err))
    }

    edit(data){
        const formData = {
            "customer_id":data?.clientId,
            "vehicle_id":data?.vehicleId,
            "date_from": data?.dateFrom,
            "date_to": data?.dateTo,
            "pickup_location": data?.pickUp,
            "drop_off_location": data?.dropOff,
            "price":data?.totalPrice
        };
        return requestInstance.put(`${this.api.reservations}/${data?.id}`, formData)
            .then(r => new ReservationModel(r?.data?.data))
            .catch(err => Promise.reject(err))
    }

    delete(id){
        return requestInstance.delete(`${this.api.reservations}/${id}`)
            .then(r => new ReservationModel(r.data))
            .catch(err => Promise.reject(err))
    }

}

export const reservationService = new ReservationService();