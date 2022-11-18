import { yupResolver } from '@hookform/resolvers/yup';
import React from 'react';
import { useForm } from 'react-hook-form';
import {t} from 'react-switch-lang';
import * as yup from 'yup';
import FormButtonGroup from '../../../components/buttons/formButtonGroup/FormButtonGroup';
import DateField from '../../../components/formFields/dateField/DateField';
import InputField from '../../../components/formFields/inputField/InputField';
import InputNumberField from '../../../components/formFields/inputNumberField/InputNumberField';
import SelectField from '../../../components/formFields/selectField/SelectField';
import ClientForm from '../../clients/clientForm/ClientForm';
import VehicleForm from '../../vehicles/vehicleForm/VehicleForm';
import classes from './ReservationForm.module.scss';

const ReservationForm = ({type, id, cancel}) => {
    const date=new Date();
    date.setHours(0, 0, 0, 0);
    const dateFormatted=date.getDate()+"."+(date.getMonth()+1)+"."+date.getFullYear();
    const datePlusSeven=new Date((date.getTime()+7*24*60*60*1000));
    const datePlusSevenFormatted=datePlusSeven.getDate()+"."+(datePlusSeven.getMonth()+1)+"."+datePlusSeven.getFullYear();

    const schema=yup.object().shape({
        clientsName: yup.string().trim().required(t('validation.required')),
        dateFrom: yup.date().required(t('validation.required'))
                .min(date,t('validation.min-date',{date:dateFormatted})),
        dateTo: yup.date().required(t('validation.required'))
                .min(date,t('validation.min-date',{date:dateFormatted})),
        pickUp: yup.string().trim().required(t('validation.required')),
        dropOff: yup.string().trim().required(t('validation.required'))
    })

    const {handleSubmit,control,reset,formState:{errors}}=useForm({resolver:yupResolver(schema)});

    const onSubmit=(data)=>{
        console.log(data);
    }

    return <div>
        <form onSubmit={handleSubmit(onSubmit)}>
            {type==='preview' && <h4 className={classes['subtitle']}>Reservation</h4>}
            {type==='edit' &&
                <InputField
                    label={t('reservations.vehicle-type')}
                    name="vehicleType"
                    control={control}
                    placeholder={''}
                    error={errors?.vehicleType?.message}
                    disabled={true}
                />
            }
            {type!=='preview' &&
                <SelectField
                    label={t('reservations.clients-name')}
                    name="clientsName"
                    control={control}
                    options={[]}
                    placeholder={t('reservations.placeholders.client')}
                    error={errors?.clientsName?.message}
                    disabled={type !== 'add'}
                />
            }
            <DateField 
                label={t('reservations.date-from')}
                name='dateFrom'
                error={errors?.dateFrom?.message}
                placeholder={dateFormatted}
                control={control}
                disabled={type==='preview'}
            />
            <DateField 
                label={t('reservations.date-to')}
                name='dateTo'
                error={errors?.dateTo?.message}
                placeholder={datePlusSevenFormatted}
                control={control}
                disabled={type==='preview'}
            />
            <SelectField
                label={t('reservations.pick-up-location')}
                name="pickUp"
                control={control}
                options={[]}
                placeholder={t('reservations.placeholders.pick-up')}
                error={errors?.pickUp?.message}
                disabled={type==='preview'}
            />
            <SelectField
                label={t('reservations.drop-off-location')}
                name="dropOff"
                control={control}
                options={[]}
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
                disabled={true}
            />
            {type==='preview' &&
                <>
                    {type==='preview' && <h4 className={classes['subtitle']}>Vehicle</h4>}
                    <VehicleForm type={type} called={true}/>
                    {type==='preview' && <h4 className={classes['subtitle']}>Client</h4>}
                    <ClientForm type={type} called={true}/>
                </>
            }

            <FormButtonGroup
                onCancel={() => cancel()}
            />
        </form>
    </div>
}

export default ReservationForm;