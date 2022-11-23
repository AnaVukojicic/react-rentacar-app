import React, {useEffect} from 'react';
import {t} from 'react-switch-lang';
import {useForm} from 'react-hook-form';
import FormButtonGroup from '../../../components/buttons/formButtonGroup/FormButtonGroup';
import classes from './DeleteForm.module.scss';
import { useMutation, useQuery, useQueryClient } from 'react-query';
import { clientService } from '../../../services/ClientService';
import { message } from 'antd';

const DeleteForm = ({id,cancel}) => {
    const queryClient = useQueryClient();
    const { handleSubmit,reset,control } = useForm({});

    const deleteClient = useMutation(() => clientService.delete(id)
        .then(r => {
            message.success('Success');
            queryClient.invalidateQueries("clients")
            cancel()
        })
        .catch(err => {
            console.log(err?.response?.data)
            message.error(t('error-message.api'))
        }))

    const onSubmit = () => {
        deleteClient.mutate()
    }

    return <div>
        <form onSubmit={handleSubmit(onSubmit)} className={classes['delete-form']}>
            <div>{t('clients.delete.content')}</div>
            <FormButtonGroup onCancel={() => cancel()} deleteType={true}/>
        </form>
    </div>
}

export default DeleteForm;