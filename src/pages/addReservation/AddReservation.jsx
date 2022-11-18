import React, {useEffect, useState} from 'react';
import SearchField from "../../components/search/Search";
import {t} from 'react-switch-lang';
import Table from "../../components/table/Table";
import {useModal} from "../../contexts/ModalContext";
import classes from "../clients/Clients.module.scss";
import { useNavigate } from 'react-router-dom';
import ReservationForm from '../reservations/reservationForm/ReservationForm';


const AddReservation = () => {
    const {open, close} = useModal()
    const [query, setQuery] = useState("")
    const navigate=useNavigate();

    const openReservationModal = (type,id = null) => {
        open({
            title: t('reservations.create-reservation'),
            content: <ReservationForm type={type} id={id} cancel={close}/>
        })
    }

    const headers = [
        {
            title: t('vehicles.plates'),
            dataIndex: 'plate_number',
            key: 'plates',
        },
        {
            title: t('vehicles.year'),
            dataIndex: 'production_year',
            key: 'year',
        },
        {
            title: t('vehicles.seats'),
            dataIndex: 'number_of_seats',
            key: 'seats',
        },
        {
            title: t('vehicles.price'),
            dataIndex: 'daily_rate',
            key: 'price',
        }
    ];


    return <>
        <div className={classes['page-head']}>
            <SearchField className={classes['search']} placeholder={t('reservations.placeholder')} onSearch={(e) => { setQuery(e)}}/>
        </div>
        <div className={classes['table']}>
            <Table header={headers}
                   rows={[{
                        "plate_number": "ŽBXU40",
                        "production_year": 2018,
                        "type": "BMW",
                        "number_of_seats": "7",
                        "daily_rate": 21,
                        "note": null
                    }]}
                   onRowClick={(record) => openReservationModal('add')}
            />
        </div>
    </>
}

export default AddReservation;