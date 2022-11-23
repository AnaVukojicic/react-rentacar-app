import React, {useEffect} from 'react';
import {t} from 'react-switch-lang';
import FormButtonGroup from "../../../components/buttons/formButtonGroup/FormButtonGroup";
import InputNumberField from '../../../components/formFields/inputNumberField/InputNumberField';
import TextAreaField from '../../../components/formFields/textAreaField/TextAreaField';
import InputField from '../../../components/formFields/inputField/InputField';
import { regex } from '../../../utils/regex';
import { useForm } from 'react-hook-form';
import * as yup from "yup";
import { yupResolver } from '@hookform/resolvers/yup';
import { useMutation, useQuery, useQueryClient } from 'react-query';
import { vehicleService } from '../../../services/VehicleService';
import { message } from 'antd';

const VehicleForm = ({type, id, cancel,called=false}) => {
    const date=new Date();

    const queryClient = useQueryClient();

    const add = useMutation((data) => vehicleService.add(data)
        .then(r => {
            message.success('Succes');
            queryClient.invalidateQueries("vehicles")
            cancel()
        })
        .catch(err => {
            console.log(err?.response?.data)
            message.error(t('error-message.api'))
        }))

    const edit = useMutation((data) => vehicleService.edit(data)
        .then(r => {
            message.success('Success');
            queryClient.invalidateQueries("vehicles")
            cancel()
        })
        .catch(err => {
            console.log(err?.response?.data)
            message.error(t('error-message.api'))
        }))

    const get = (id) => {
        return vehicleService.getVehicleById(id)
            .then(res => {
                reset(res)
            })
            .catch(err => message.error(t('error-message.api')))
    }

    const schema=yup.object().shape({
        plates: yup.string().trim().required(t('validation.required'))
                .matches(regex.PLATES,t('validation.invalid')),
        year: yup.number().integer().required(t('validation.required'))
                .min(2000,t('validation.min-year',{year:2000}))
                .max(date.getFullYear(),t('validation.max-year',{year:date.getFullYear()})),
        type: yup.string().trim().required(t('validation.required'))
                .min(2,t('validation.min',{number:2}))
                .max(255,t('validation.max',{number:255})),
        seats: yup.number().integer().required(t('validation.required'))
                .min(2,t('validation.min-seats',{number:2}))
                .max(15,t('validation.max-seats',{number:15})),
        price: yup.number().required(t('validation.required'))
                .min(0,t('validation.min-price',{number:0})),
        note: yup.string().nullable(true).default('/').max(255,t('validation.max',{number:255}))
    })

    const {handleSubmit,control,reset,formState:{errors}}=useForm({resolver:yupResolver(schema)});

    const onSubmit=(data)=>{
        console.log(data)
        if(type==='add'){
            add.mutate(data)
        }else{
            edit.mutate(data);
        }
    }

    useQuery(['vehicle-sigle', id], () => get(id), {
        enabled: Boolean(type !== 'add' && id)
    })

    useEffect(()=>{
        console.log(errors)
    },[errors])

    return <div>
        <form onSubmit={handleSubmit(onSubmit)}>
            <InputField 
                label={t('vehicles.plates')}
                name='plates'
                control={control}
                placeholder={t('vehicles.placeholders.plates')}
                disabled={type === 'preview'}
                error={errors?.plates?.message}
            />
            <InputNumberField 
                label={t('vehicles.year')}
                name="year"
                control={control}
                placeholder={t('vehicles.placeholders.year')}
                error={errors?.year?.message}
                disabled={type === 'preview'}
            />
            <InputField 
                label={t('vehicles.type')}
                name='type'
                control={control}
                placeholder={t('vehicles.placeholders.type')}
                disabled={type === 'preview'}
                error={errors?.type?.message}
            />
            <InputNumberField 
                label={t('vehicles.seats')}
                name="seats"
                control={control}
                placeholder={t('vehicles.placeholders.seats')}
                error={errors?.seats?.message}
                disabled={type === 'preview'}
            />
            <InputNumberField 
                label={t('vehicles.price')}
                name="price"
                control={control}
                placeholder={t('vehicles.placeholders.price')}
                error={errors?.price?.message}
                disabled={type === 'preview'}
                step='0.01'
            />
            {!called &&
                <TextAreaField 
                    label={t('vehicles.note')}
                    placeholder={t('vehicles.placeholders.note')}
                    disabled={type==='preview'}
                    control={control}
                    error={errors?.note?.message}
                    name='note'
                />
            }       
            {type && type !== 'preview' &&
            <FormButtonGroup
                onCancel={() => cancel()}
            />
            }
        </form>
    </div>
}

export default VehicleForm;