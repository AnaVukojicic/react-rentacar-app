import React from 'react';
import {t} from 'react-switch-lang';
import {useForm} from 'react-hook-form';
import classes from './DeleteForm.module.scss';
import { useMutation, useQueryClient } from 'react-query';
import { message } from 'antd';
import { clientService } from '../../services/ClientService';
import { vehicleService } from '../../services/VehicleService';
import FormButtonGroup from '../buttons/formButtonGroup/FormButtonGroup';
import { reservationService } from '../../services/ReservationService';

const DeleteForm = ({id,cancel,page}) => {
    const queryClient = useQueryClient();
    const { handleSubmit,reset,control } = useForm({});

    const deleteData = useMutation(() => 
            (page==='vehicles' ? vehicleService.delete(id) 
            : (page==='clients' ? clientService.delete(id) : reservationService.delete(id)))
        .then(r => {
            message.success('Success');
            queryClient.invalidateQueries(page)
            cancel()
        })
        .catch(err => {
            console.log(err?.response?.data)
            message.error(t('error-message.api'))
        }))

    const onSubmit = () => {
        deleteData.mutate()
    }

    return <div>
        <form onSubmit={handleSubmit(onSubmit)} className={classes['delete-form']}>
            <div>{
                    page==='reservations' ? t('reservations.delete.content') : 
                    (page==='clients' ? t('clients.delete.content') : t('vehicles.delete.content'))
            }</div>
            <FormButtonGroup onCancel={() => cancel()} deleteType={true}/>
        </form>
    </div>
}

export default DeleteForm;