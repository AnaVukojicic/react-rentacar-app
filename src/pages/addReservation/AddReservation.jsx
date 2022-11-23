import React, {useEffect, useState} from 'react';
import SearchField from "../../components/search/Search";
import {t} from 'react-switch-lang';
import Table from "../../components/table/Table";
import {useModal} from "../../contexts/ModalContext";
import classes from "../clients/Clients.module.scss";
import { useQuery } from 'react-query';
import { vehicleService } from '../../services/VehicleService';
import AddReservationForm from './addReservationForm/AddReservationForm';
import { useNavigate } from 'react-router-dom';
import { storageService } from '../../services/StorageService';
import { storageKeys, userRoles } from '../../config/config';


const AddReservation = () => {
    const navigate=useNavigate();
    const {open, close} = useModal()
    const [query, setQuery] = useState("")

    const {data: rows} = useQuery(['vehicles', query],
        () => vehicleService.getAll(query), {
            enabled: true,
            initialData: []
    })

    const openReservationModal = (id = null) => {
        open({
            title: t('reservations.create-reservation'),
            content: <AddReservationForm id={id} cancel={close}/>
        })
    }

    const headers = [
        {
            title: t('vehicles.plates'),
            dataIndex: 'plates',
            key: 'plates',
        },
        {
            title: t('vehicles.year'),
            dataIndex: 'year',
            key: 'year',
        },
        {
            title: t('vehicles.seats'),
            dataIndex: 'seats',
            key: 'seats',
        },
        {
            title: t('vehicles.price'),
            dataIndex: 'price',
            key: 'price',
        }
    ];

    useEffect(()=>{
        if(storageService.exists(storageKeys.ROLE) && parseInt((storageService.get(storageKeys.ROLE)))!==userRoles.EMPLOYEE){
            navigate('/forbidden');
        }
    },[])


    return <>
        <div className={classes['page-head']}>
            <SearchField className={classes['search']} placeholder={t('reservations.placeholder')} onSearch={(e) => { setQuery(e)}}/>
        </div>
        <div className={classes['table']}>
            <Table header={headers}
                   rows={rows}
                   onRowClick={(record) => openReservationModal(record?.id)}
            />
        </div>
    </>
}

export default AddReservation;