import React from 'react';
import { useState } from 'react';
import { useQuery } from 'react-query';
import {t} from 'react-switch-lang';
import { storageKeys, userRoles } from '../../config/config';
import { reservationService } from '../../services/ReservationService';
import { storageService } from '../../services/StorageService';
import ReservationCard from './reservationCard/ReservationCard';
import classes from './Dashboard.module.scss';
import ReservationForm from '../reservations/reservationForm/ReservationForm';
import { useModal } from '../../contexts/ModalContext';
import Button from '../../components/buttons/button/Button';

const Dashboard = () => {
    const {open,close}=useModal();
    const [data,setData]=useState(null);

    const {data: rows} = useQuery(['client-reservations'],
        () =>{
                return reservationService.getAllSorted()
                    .then(r=>{setData(r); return r})
        }, {
            enabled: true,
            initialData: []
    })


    const openReservationModal = (type, id = null) => {
        open({
            title: t('common.preview'),
            content: <ReservationForm type={type} id={id} cancel={close}/>
        })
    }

    const previous=()=>{
        setData(rows?.filter(r=>{
            const curr=new Date();
            const date1=new Date(r?.dateFrom);
            const date2=new Date(r?.dateTo);
            //Zakomentarisani dio bi trebao da se primijeni ali ne dobijam podatak o dateTo i zbog toga ne moze
            // return (date1<curr && date2<curr)
            return date1<curr
        }));
    }
    const current=()=>{
        setData(rows?.filter(r=>{
            const curr=new Date();
            const date1=new Date(r?.dateFrom);
            const date2=new Date(r?.dateTo);
            // return (date1<=curr && date2>=curr)
            return date1<=curr
        }));
    }
    const future=()=>{
        setData(rows?.filter(r=>{
            const curr=new Date();
            const date1=new Date(r?.dateFrom);
            const date2=new Date(r?.dateTo);
            // return (date1>curr && date2>curr)
            return date1>curr
        }));
    }
    const all=()=>{
        setData(rows);
    }


    return <div>
        {parseInt((storageService.get(storageKeys.ROLE)))===userRoles.EMPLOYEE ?
            t('dashboard.welcome')
        :
        <div className={classes['container']}>
            <h4 className={classes['dashboard-title']}>{t('client.title')}</h4>
            <div className={classes['buttons']}>
                <Button label={t('client.all')} onClick={()=>all()}/>
                <Button label={t('client.previous')} onClick={()=>previous()}/>
                <Button label={t('client.current')} onClick={()=>current()}/>
                <Button label={t('client.future')} onClick={()=>future()}/>
            </div>
            <div className={classes['card-container']}>
                {
                    data?.map(row=>{
                        return <ReservationCard
                                    dateFrom={row?.dateFrom.toString().slice(0,10)}
                                    dateTo={row?.dateTo?.toString().slice(0,10)}
                                    price={row?.totalPrice}
                                    pickUp={row?.pickUp?.name}
                                    dropOff={row?.dropOff?.name}
                                    onClick={()=>openReservationModal('client-preview',row?.id)}
                                />
                    })
                }
            </div>
        </div>
        }
    </div>
}

export default Dashboard;