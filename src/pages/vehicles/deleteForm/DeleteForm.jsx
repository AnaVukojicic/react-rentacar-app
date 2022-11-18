import React from 'react';
import {t} from 'react-switch-lang';
import {useForm} from 'react-hook-form';
import FormButtonGroup from '../../../components/buttons/formButtonGroup/FormButtonGroup';
import classes from './DeleteForm.module.scss';

const DeleteForm = ({id,cancel}) => {

    const { handleSubmit } = useForm({});

    const onSubmit = (data) => {
        console.log(data)
        console.log('DELETE')
    }

    return <div>
        <form onSubmit={handleSubmit(onSubmit)} className={classes['delete-form']}>
            <div>{t('vehicles.delete.content')}</div>
            <FormButtonGroup onCancel={() => cancel()} deleteType={true}/>
        </form>
    </div>
}

export default DeleteForm;