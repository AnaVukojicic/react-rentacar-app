import React from 'react';
import {storageService} from "../../services/StorageService";
import {storageKeys} from "../../config/config";
import {useNavigate} from 'react-router-dom';
import {authService} from "../../services/AuthService";
import InputField from '../../components/formFields/inputField/InputField';
import PasswordField from '../../components/formFields/passwordField/PasswordField';
import { t } from 'react-switch-lang';
import classes from './Login.module.scss';
import Button from '../../components/buttons/button/Button';
import * as yup from 'yup';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { regex } from '../../utils/regex';
import { message } from 'antd';

const Login = () => {
    const navigate = useNavigate();

    const login = (email, password) => {
        authService.login(email, password)
            .then(r => {
                storageService.set(storageKeys.USER, r.getToken())
                storageService.set(storageKeys.ROLE,r.role_id)
                setTimeout(() => {
                    navigate('/')
                }, 300)
            })
            .catch(err => {
                console.log(err?.data)
                message.error(t('error-message.wrong-credentials'))
            })
    }

    const schema=yup.object().shape({
        email: yup.string().trim().required(t('validation.required'))
                .email(t('validation.invalid')),
        password: yup.string().trim().required(t('validation.required'))
                .min(4,t('validation.min',{number:4}))
                .max(12,t('validation.max',{number:12}))
                .matches(regex.PASSWORD,t('validation.invalid'))
    })

    const {handleSubmit,control,reset,formState:{errors}}=useForm({resolver:yupResolver(schema)});

    const onSubmit=(data)=>{
        console.log(data);
        login(data?.email,data?.password)
    }

    return( 
        <div className={classes['container']}>
            <div className={classes['form-wrapper']}>
                <h4 className={classes['title']}>Log In</h4>
                <form onSubmit={handleSubmit(onSubmit)}>
                    <InputField label={t('login.email')}
                                placeholder={t('login.placeholders.email')}
                                disabled={false}
                                name='email'
                                control={control}
                                error={errors?.email?.message}
                    />
                    <PasswordField label={t('login.password')}
                                placeholder={t('login.placeholders.password')}
                                disabled={false}
                                name='password'
                                control={control}
                                error={errors?.password?.message}
                    />
                    <Button type='submit' label={t('login.btn-label')} onClick={()=>{}}/> 
                </form>
            </div>
        </div>
    );
}

export default Login;