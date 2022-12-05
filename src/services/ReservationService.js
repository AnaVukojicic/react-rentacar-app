import {requestInstance} from "../config/requestInstance";
import ReservationModel from "./models/ReservationModel";

class ReservationService {
    api = {
        reservations: '/reservations'
    }

    params = {
        date_from: 'date_from=',
        date_to: 'date_to='
    }

    getReservationById(id){
        return requestInstance.get(`${this.api.reservations}/${id}`)
            .then(r => new ReservationModel(r?.data?.data))
            .catch(err => Promise.reject(err))
    }

    getAll(query1,query2){
        const queryParam1 = query1?.length > 0 ? `?${this.params.date_from}${query1}` : '';
        const queryParam2= query2?.length > 0 ? (queryParam1 !== '' ? '&' : '?')+`${this.params.date_to}${query2}` : '';
        return requestInstance.get(`${this.api.reservations}${queryParam1}${queryParam2}`)
            .then(r => r?.data?.data?.map(item => new ReservationModel(item)))
            .catch(err => Promise.reject(err))
    }

    getAllSorted(){
        return requestInstance.get(`${this.api.reservations}`)
            .then(r => r?.data?.data?.sort((r1,r2)=>{
                let date1=new Date(r1.date_from)
                let date2=new Date(r2.date_from)
                return date1-date2
            })?.map(item => new ReservationModel(item)))
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
            "vehicle_id":data?.vehicleId ? data?.vehicleId : "1",
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