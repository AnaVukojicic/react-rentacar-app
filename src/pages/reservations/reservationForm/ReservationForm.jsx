import { yupResolver } from '@hookform/resolvers/yup';
import { message } from 'antd';
import React from 'react';
import { useForm } from 'react-hook-form';
import { useMutation, useQuery, useQueryClient } from 'react-query';
import {t} from 'react-switch-lang';
import * as yup from 'yup';
import FormButtonGroup from '../../../components/buttons/formButtonGroup/FormButtonGroup';
import DateField from '../../../components/formFields/dateField/DateField';
import InputField from '../../../components/formFields/inputField/InputField';
import InputNumberField from '../../../components/formFields/inputNumberField/InputNumberField';
import SelectField from '../../../components/formFields/selectField/SelectField';
import { cityService } from '../../../services/CityService';
import { useState } from 'react';
import { useEffect } from 'react';
import { reservationService } from '../../../services/ReservationService';

const ReservationForm = ({type,id, cancel}) => {
    const [dateFrom,setDateFrom]=useState(0);
    const [dateTo,setDateTo]=useState(0);
    const [price,setPrice]=useState(0);
    const [dateFromFormatted,setDateFromFormatted]=useState();
    const [reservationChanged,setReservationChanged]=useState(0)

    const date=new Date();
    date.setHours(0, 0, 0, 0);
    const dateFormatted=date.getDate()+"."+(date.getMonth()+1)+"."+date.getFullYear();
    const datePlusSeven=new Date((date.getTime()+7*24*60*60*1000));
    const datePlusSevenFormatted=datePlusSeven.getDate()+"."+(datePlusSeven.getMonth()+1)+"."+datePlusSeven.getFullYear();

    const queryClient=useQueryClient();

    const edit = useMutation((data) => reservationService.edit(data)
        .then(r => {
            message.success('Success');
            queryClient.invalidateQueries("reservations")
            cancel()
        })
        .catch(err => {
            console.log(err?.response?.data)
            message.error(t('error-message.api'))
        }))

    const schema=yup.object().shape({
        dateFrom: yup.date().required(t('validation.required'))
                .min(date,t('validation.min-date',{date:dateFormatted})),
        dateTo: yup.date().required(t('validation.required'))
                .min(dateFrom,t('validation.min-date',{date:dateFromFormatted})),
        pickUp: yup.string().trim().required(t('validation.required')),
        dropOff: yup.string().trim().required(t('validation.required'))
    })

    const getCities = () => {
        return cityService.getAll()
            .then(res => {
                return res.map(item => ({
                    label: item?.name,
                    value: item?.id
                }));
            })
            .catch(err => message.error(t('error-message.api')))
    }

    const getReservationById=(id)=>{
        return reservationService.getReservationById(id)
            .then(res=>{
                setReservationChanged(prevState=>prevState+1); 
                reset({
                    id:id,
                    clientsName:res?.client?.first_name+" "+res?.client?.last_name,
                    vehiclePlates:res?.vehicle?.plate_number,
                    pickUp:res?.pickUp?.id,
                    dropOff:res?.dropOff?.id,
                    totalPrice:res?.totalPrice,
                    clientId:res?.client?.id,
                    vehicleId:res?.vehicle?.id,
                    vehicleYear:res?.vehicle?.production_year,
                    vehicleType:res?.vehicle?.type,
                    vehicleSeats:res?.vehicle?.number_of_seats,
                    vehiclePrice:res?.vehicle?.daily_rate,
                    idNumber:res?.client?.passport_number,
                    phoneNumber:res?.client?.phone_number,
                    email:res?.client?.email
                }); 
                return res
            })
            .catch(err=>message.error(t('error-message-api')))
    }

    const {data: cities} = useQuery(['cities'], () => getCities(), {
        enabled: true,
        initialData: []
    })

    const {data:reservation}=useQuery(['reservation-single'],()=>getReservationById(id),{
        enabled: Boolean(id),
        initialData: []
    })

    // const getVehicle=()=>{
    //     return getReservationById(id)
    //         .then(res=>res?.vehicle)
    //         .catch(err=>message.error(t('error-message-api')))
    // }

    // const getClient=()=>{
    //     return getReservationById(id)
    //         .then(res=>res?.client)
    //         .catch(err=>message.error(t('error-message-api')))
    // }

    // const getVehiclePrice=()=>{
    //     return getVehicle()
    //         .then(res=> res?.daily_rate)
    //         .catch(err=>message.error(t('error-message-api')))
    // }

    // const {data : vehicle} = useQuery(['vehicle-single'], () => getVehicle(), {
    //     enabled: true,
    //     initialData: []
    // })

    // const {data : client} = useQuery(['client-single'], () => getClient(), {
    //     enabled: true,
    //     initialData: []
    // })

    // const {data : vehiclePrice} = useQuery(['vehicle-price'], () => getVehiclePrice(), {
    //     enabled: true,
    //     initialData: []
    // })

    const {handleSubmit,control,reset,formState:{errors},setValue}=useForm({resolver:yupResolver(schema)});

    const onDateFromChange=(d,ds)=>{
        setDateFrom(d);
        setDateFromFormatted(d._d.getDate()+"."+d._d.getMonth()+"."+d._d.getFullYear())
    }

    const onDateToChange=(d,ds)=>{
        setDateTo(d);
    }

    useEffect(()=>{
        if(dateTo>dateFrom)
            setPrice((Math.floor((dateTo-dateFrom)/1000/60/60/24))*reservation?.vehicle?.daily_rate)
    },[dateFrom,dateTo])

    useEffect(()=>{
        setValue('totalPrice',price)
    },[price])

    useEffect(()=>{
        setValue('dateFrom','');
        setValue('dateTo','')
        console.log(reservation);
    },[reservationChanged])

    const onSubmit=(data)=>{
        if(type==='edit'){
            console.log(data)
            edit.mutate(data)
        }
    }

    return <div>
        <form onSubmit={handleSubmit(onSubmit)}>
            {type==='edit' && 
            <>
            <InputField
                label={""}
                name="id"
                control={control}
                placeholder={''}
                error={errors?.id?.message}
                type="hidden"
            />
            <InputField
                label={t('vehicles.plates')}
                name="vehiclePlates"
                control={control}
                placeholder={''}
                error={errors?.vehicleType?.message}
                disabled={true}
            />
            <InputField
                label={t('reservations.clients-name')}
                name="clientsName"
                control={control}
                placeholder={t('reservations.placeholders.client')}
                error={errors?.clientsName?.message}
                disabled={true}
            />
            </>}
            <DateField 
                label={t('reservations.date-from')}
                name='dateFrom'
                error={errors?.dateFrom?.message}
                placeholder={dateFormatted}
                control={control}
                disabled={type==='preview'}
                onChange={(d,ds)=>onDateFromChange(d,ds)}
            />
            <DateField 
                label={t('reservations.date-to')}
                name='dateTo'
                error={errors?.dateTo?.message}
                placeholder={datePlusSevenFormatted}
                control={control}
                disabled={type==='preview'}
                onChange={(d,ds)=>onDateToChange(d,ds)}
            />
            <SelectField
                label={t('reservations.pick-up-location')}
                name="pickUp"
                control={control}
                options={cities}
                placeholder={t('reservations.placeholders.pick-up')}
                error={errors?.pickUp?.message}
                disabled={type==='preview'}
            />
            <SelectField
                label={t('reservations.drop-off-location')}
                name="dropOff"
                control={control}
                options={cities}
                placeholder={t('reservations.placeholders.drop-off')}
                error={errors?.dropOff?.message}
                disabled={type==='preview'}
            />
            <InputNumberField 
                label={t('reservations.total-price')}
                name="totalPrice"
                control={control}
                placeholder={t('reservations.placeholders.total-price')}
                error={errors?.totalPrice?.message}
                value={price}
                readOnly={true}
            />
            {type==='preview' &&
            <>
            <InputField
                label={t('vehicles.plates')}
                name="vehiclePlates"
                control={control}
                placeholder={''}
                error={errors?.vehicleType?.message}
                disabled={true}
            />
            <InputField
                label={t('vehicles.year')}
                name="vehicleYear"
                control={control}
                placeholder={''}
                error={errors?.vehicleYear?.message}
                disabled={true}
            />
            <InputField
                label={t('vehicles.type')}
                name="vehicleType"
                control={control}
                placeholder={''}
                error={errors?.vehicleType?.message}
                disabled={true}
            />
            <InputField
                label={t('vehicles.seats')}
                name="vehicleSeats"
                control={control}
                placeholder={''}
                error={errors?.vehicleseats?.message}
                disabled={true}
            />
            <InputField
                label={t('vehicles.price')}
                name="vehiclePrice"
                control={control}
                placeholder={''}
                error={errors?.vehiclePrice?.message}
                disabled={true}
            />
            <InputField
                label={t('reservations.clients-name')}
                name="clientsName"
                control={control}
                placeholder={""}
                error={errors?.clientsName?.message}
                disabled={true}
            />
            <InputField
                label={t('clients.number')}
                name="idNumber"
                control={control}
                placeholder={""}
                error={errors?.idNumber?.message}
                disabled={true}
            />
            <InputField
                label={t('clients.phone')}
                name="phoneNumber"
                control={control}
                placeholder={""}
                error={errors?.phoneNumber?.message}
                disabled={true}
            />
            <InputField
                label={t('clients.email')}
                name="email"
                control={control}
                placeholder={""}
                error={errors?.email?.message}
                disabled={true}
            />
            </>}

            {type==='edit' && 
            <FormButtonGroup onCancel={() => cancel()}/>
            }
        </form>
    </div>
}

export default ReservationForm;