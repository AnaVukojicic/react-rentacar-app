import React from 'react';
import {t} from 'react-switch-lang';
import {get, useForm} from 'react-hook-form';
import FormButtonGroup from '../../../components/buttons/formButtonGroup/FormButtonGroup';
import classes from './DeleteForm.module.scss';
import { useMutation, useQuery, useQueryClient } from 'react-query';
import { message } from 'antd';
import { vehicleService } from '../../../services/VehicleService';

const DeleteForm = ({id,cancel}) => {
    const queryClient = useQueryClient();
    const { handleSubmit,reset,control } = useForm({});

    const deleteVehicle = useMutation(() => vehicleService.delete(id)
        .then(r => {
            message.success('Success');
            queryClient.invalidateQueries("vehicles")
            cancel()
        })
        .catch(err => {
            console.log(err?.response?.data)
            message.error(t('error-message.api'))
        }))

    const onSubmit = () => {
        deleteVehicle.mutate()
    }

    return <div>
        <form onSubmit={handleSubmit(onSubmit)} className={classes['delete-form']}>
            <div>{t('vehicles.delete.content')}</div>
            <FormButtonGroup onCancel={() => cancel()} deleteType={true}/>
        </form>
    </div>
}

export default DeleteForm;