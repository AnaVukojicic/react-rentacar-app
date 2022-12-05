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
import dayjs from 'dayjs';

import weekday from "dayjs/plugin/weekday"
import localeData from "dayjs/plugin/localeData"
dayjs.extend(weekday)
dayjs.extend(localeData)

const ReservationForm = ({type,id, cancel}) => {
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
        dateFrom: yup.date().required(t('validation.required')),
        dateTo: yup.date().required(t('validation.required'))
                .when('dateFrom',(dateFrom,field)=>dayjs(dateFrom) ? field.min(dayjs(dateFrom),t('validation.min-date',{date:dayjs(dateFrom).format('DD.MM.YYYY.')})) : field),
                // .min(yup.ref("dateFrom"),({min})=>t('validation.min-date',{date:dayjs(min).format('DD.MM.YYYY.')})),
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
                    email:res?.client?.email,
                    dateFrom:dayjs(res?.dateFrom),
                    dateTo:dayjs(res?.dateTo)
                }); 
                return res
            })
            .catch(err=>message.error(t('error-message-api')))
    }

    const {data: cities} = useQuery(['cities'], () => getCities(), {
        enabled: true,
        initialData: []
    })

    const {data:reservation}=useQuery(['reservation-single',id],()=>getReservationById(id),{
        enabled: Boolean(id),
        initialData: []
    })

    const {handleSubmit,control,reset,formState:{errors},setValue,watch}=useForm({resolver:yupResolver(schema)});

    const dateFields=watch(['dateFrom','dateTo']);

    useEffect(()=>{
        if(dateFields[1]>=dateFields[0])
            setValue('totalPrice',(Math.floor((dateFields[1]-dateFields[0])/1000/60/60/24))*reservation?.vehicle?.daily_rate)
        else
            setValue('totalPrice',0)
    },[dateFields])

    const onSubmit=(data)=>{
        if(type==='edit'){
            edit.mutate(data)
        }
    }

    return <div>
        <form onSubmit={handleSubmit(onSubmit)}>
            {type==='edit' && 
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
                placeholder={dayjs(Date.now()).format('DD.MM.YYYY.')}
                control={control}
                disabled={type==='preview' || type==='client-preview'}
            />
            <DateField 
                label={t('reservations.date-to')}
                name='dateTo'
                error={errors?.dateTo?.message}
                placeholder={dayjs(Date.now()).add(7,'day').format('DD.MM.YYYY.')}
                control={control}
                disabled={type==='preview' || type==='client-preview'}
            />
            <SelectField
                label={t('reservations.pick-up-location')}
                name="pickUp"
                control={control}
                options={cities}
                placeholder={t('reservations.placeholders.pick-up')}
                error={errors?.pickUp?.message}
                disabled={type==='preview' || type==='client-preview'}
            />
            <SelectField
                label={t('reservations.drop-off-location')}
                name="dropOff"
                control={control}
                options={cities}
                placeholder={t('reservations.placeholders.drop-off')}
                error={errors?.dropOff?.message}
                disabled={type==='preview' || type==='client-preview'}
            />
            <InputNumberField 
                label={t('reservations.total-price')}
                name="totalPrice"
                control={control}
                placeholder={t('reservations.placeholders.total-price')}
                error={errors?.totalPrice?.message}
                readOnly={true}
            />
            {(type==='preview' || type==='client-preview') &&
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
            </>
            }
            {type==='preview' &&
            <>
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