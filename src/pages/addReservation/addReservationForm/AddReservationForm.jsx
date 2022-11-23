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
import { clientService } from '../../../services/ClientService';
import { cityService } from '../../../services/CityService';
import { useState } from 'react';
import { useEffect } from 'react';
import { vehicleService } from '../../../services/VehicleService';
import { reservationService } from '../../../services/ReservationService';
import { useNavigate } from 'react-router-dom';
import { routes } from '../../../routes/routes';

const AddReservationForm = ({id, cancel}) => {
    const navigate=useNavigate();
    const [dateFrom,setDateFrom]=useState(0);
    const [dateTo,setDateTo]=useState(0);
    const [price,setPrice]=useState(0);
    const [dateFromFormatted,setDateFromFormatted]=useState();

    const date=new Date();
    date.setHours(0, 0, 0, 0);
    const dateFormatted=date.getDate()+"."+(date.getMonth()+1)+"."+date.getFullYear();
    const datePlusSeven=new Date((date.getTime()+7*24*60*60*1000));
    const datePlusSevenFormatted=datePlusSeven.getDate()+"."+(datePlusSeven.getMonth()+1)+"."+datePlusSeven.getFullYear();

    const queryClient=useQueryClient();

    const add = useMutation((data) => reservationService.add(data)
        .then(r => {
            message.success('Succes');
            queryClient.invalidateQueries("reservations")
            cancel();
            navigate(`/${routes.RESERVATIONS.path}`);
        })
        .catch(err => {
            console.log(err?.response?.data)
            message.error(t('error-message.api'))
        }))

    const schema=yup.object().shape({
        clientsName: yup.string().trim().required(t('validation.required')),
        dateFrom: yup.date().required(t('validation.required'))
                .min(date,t('validation.min-date',{date:dateFormatted})),
        dateTo: yup.date().required(t('validation.required'))
                .min(dateFrom,t('validation.min-date',{date:dateFromFormatted})),
        pickUp: yup.string().trim().required(t('validation.required')),
        dropOff: yup.string().trim().required(t('validation.required'))
    })

    const getClients = () => {
        return clientService.getAll()
            .then(res => {
                return res.map(item => ({
                    label: item?.getFullName(),
                    value: item?.id
                }));
            })
            .catch(err => message.error(t('error-message.api')))
    }

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

    const getVehiclePrice=()=>{
        return vehicleService.getVehicleById(id)
            .then(res=> res?.price)
            .catch(err=>message.error(t('error-message-api')))
    }

    const setVehicleId=()=>{
        setValue('vehicleId',id);
    }

    const {data: clients} = useQuery(['clients'], () => getClients(), {
        enabled: true,
        initialData: []
    })

    const {data: cities} = useQuery(['cities'], () => getCities(), {
        enabled: true,
        initialData: []
    })

    useQuery(['vehicle-id'], () => setVehicleId(), {
        enabled: true,
        initialData: []
    })

    const {data : vehiclePrice} = useQuery(['vehicle-price'], () => getVehiclePrice(), {
        enabled: true,
        initialData: []
    })

    const {handleSubmit,control,reset,formState:{errors},setValue}=useForm({resolver:yupResolver(schema)});

    const onSubmit=(data)=>{
        add.mutate(data)
    }

    const onDateFromChange=(d,ds)=>{
        setDateFrom(d);
        setDateFromFormatted(d._d.getDate()+"."+d._d.getMonth()+"."+d._d.getFullYear())
    }

    const onDateToChange=(d,ds)=>{
        setDateTo(d);
    }

    useEffect(()=>{
        if(dateTo>dateFrom)
            setPrice((Math.floor((dateTo-dateFrom)/1000/60/60/24))*vehiclePrice)
    },[dateFrom,dateTo])

    useEffect(()=>{
        setValue('totalPrice',price)
    },[price])


    return <div>
        <form onSubmit={handleSubmit(onSubmit)}>
            <InputField
                label={""}
                name="vehicleId"
                control={control}
                placeholder={''}
                error={errors?.vehicleType?.message}
                disabled={true}
                type='hidden'
            />
            <SelectField
                label={t('reservations.clients-name')}
                name="clientsName"
                control={control}
                options={clients}
                placeholder={t('reservations.placeholders.client')}
                error={errors?.clientsName?.message}
                disabled={false}
            />
            <DateField 
                label={t('reservations.date-from')}
                name='dateFrom'
                error={errors?.dateFrom?.message}
                placeholder={dateFormatted}
                control={control}
                disabled={false}
                onChange={(d,ds)=>onDateFromChange(d,ds)}
            />
            <DateField 
                label={t('reservations.date-to')}
                name='dateTo'
                error={errors?.dateTo?.message}
                placeholder={datePlusSevenFormatted}
                control={control}
                disabled={false}
                onChange={(d,ds)=>onDateToChange(d,ds)}
            />
            <SelectField
                label={t('reservations.pick-up-location')}
                name="pickUp"
                control={control}
                options={cities}
                placeholder={t('reservations.placeholders.pick-up')}
                error={errors?.pickUp?.message}
                disabled={false}
            />
            <SelectField
                label={t('reservations.drop-off-location')}
                name="dropOff"
                control={control}
                options={cities}
                placeholder={t('reservations.placeholders.drop-off')}
                error={errors?.dropOff?.message}
                disabled={false}
            />
            <InputNumberField 
                label={t('reservations.total-price')}
                name="totalPrice"
                control={control}
                placeholder={t('reservations.placeholders.total-price')}
                error={errors?.totalPrice?.message}
                disabled={true}
                value={price}
                readOnly={true}
            />

            <FormButtonGroup
                onCancel={() => cancel()}
            />
        </form>
    </div>
}

export default AddReservationForm;