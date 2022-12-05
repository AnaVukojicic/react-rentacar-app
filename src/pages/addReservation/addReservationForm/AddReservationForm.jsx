import { yupResolver } from '@hookform/resolvers/yup';
import { message } from 'antd';
import React from 'react';
import { useForm } from 'react-hook-form';
import { useMutation, useQuery, useQueryClient } from 'react-query';
import {t} from 'react-switch-lang';
import * as yup from 'yup';
import FormButtonGroup from '../../../components/buttons/formButtonGroup/FormButtonGroup';
import DateField from '../../../components/formFields/dateField/DateField';
import InputNumberField from '../../../components/formFields/inputNumberField/InputNumberField';
import SelectField from '../../../components/formFields/selectField/SelectField';
import { clientService } from '../../../services/ClientService';
import { cityService } from '../../../services/CityService';
import { useEffect } from 'react';
import { vehicleService } from '../../../services/VehicleService';
import { reservationService } from '../../../services/ReservationService';
import { useNavigate } from 'react-router-dom';
import { routes } from '../../../routes/routes';
import dayjs from 'dayjs';

const AddReservationForm = ({id, cancel}) => {
    const navigate=useNavigate();
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
                .min(dayjs(new Date(Date.now())).subtract(1,'day'),t('validation.min-date',{date:dayjs(new Date(Date.now())).format('DD.MM.YYYY.')})),
        dateTo: yup.date().required(t('validation.required'))
                .when('dateFrom',(dateFrom,field)=>dayjs(dateFrom) ? field.min(dayjs(dateFrom),t('validation.min-date',{date:dayjs(dateFrom).format('DD.MM.YYYY.')})) : field),
                // .min(yup.ref("dateFrom"),({min})=>t('validation.min-date',{date:dayjs(min).format('DD.MM.YYYY.')})),
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

    const {handleSubmit,control,reset,formState:{errors},setValue,watch}=useForm({resolver:yupResolver(schema)});

    const onSubmit=(data)=>{
        add.mutate(data)
    }

    const dateFields=watch(['dateFrom','dateTo']);

    useEffect(()=>{
        if(dateFields[1]>=dateFields[0])
            setValue('totalPrice',(Math.floor((dateFields[1]-dateFields[0])/1000/60/60/24))*vehiclePrice)
        else
            setValue('totalPrice',0)
    },[dateFields])

    return <div>
        <form onSubmit={handleSubmit(onSubmit)}>
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
                placeholder={dayjs(Date.now()).format('DD.MM.YYYY.')}
                control={control}
                disabled={false}
            />
            <DateField 
                label={t('reservations.date-to')}
                name='dateTo'
                error={errors?.dateTo?.message}
                placeholder={dayjs(Date.now()).add(7,'day').format('DD.MM.YYYY.')}
                control={control}
                disabled={false}
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
                readOnly={true}
            />

            <FormButtonGroup
                onCancel={() => cancel()}
            />
        </form>
    </div>
}

export default AddReservationForm;