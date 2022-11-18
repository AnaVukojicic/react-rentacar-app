import React, {useEffect, useState} from 'react';
import SearchField from "../../components/search/Search";
import {t} from 'react-switch-lang';
import Table from "../../components/table/Table";
import {useModal} from "../../contexts/ModalContext";
import classes from "../clients/Clients.module.scss";
import Button from "../../components/buttons/button/Button";
import TableButtonGroup from "../../components/buttons/tableButtonGroup/TableButtonGroup";
import { useNavigate } from 'react-router-dom';
import { routes } from '../../routes/routes';
import DeleteForm from './deleteForm/DeleteForm';
import ReservationForm from './reservationForm/ReservationForm';

const Reservations = () => {
    const {open, close} = useModal()
    const [query, setQuery] = useState("")
    const navigate=useNavigate();

    const openReservationModal = (type, id = null) => {
        open({
            title: type === 'edit' ? t('reservations.edit-reservation')
                    : t('common.preview'),
            content: <ReservationForm type={type} id={id} cancel={close}/>
        })
    }

    const openDeleteModal=(id=null)=>{
        open({
            title: t('reservations.delete.title'),
            content: <DeleteForm id={id} cancel={close}/>
        })
    }

    const headers = [
        {
            title: t('reservations.clients-name'),
            dataIndex: 'clients-name',
            key: 'clients-name',
        },
        {
            title: t('reservations.vehicles-plates'),
            dataIndex: 'vehicles-plates',
            key: 'vehicles-plates',
        },
        {
            title: t('reservations.date-from'),
            dataIndex: 'date-from',
            key: 'date-from',
        },
        {
            title: t('reservations.date-to'),
            dataIndex: 'date-to',
            key: 'date-to',
        },
        {
            title: t('reservations.pick-up-location'),
            dataIndex: 'pick-up-location',
            key: 'pick-up-location',
        },
        {
            title: t('reservations.drop-off-location'),
            dataIndex: 'drop-off-location',
            key: 'drop-off-location',
        },
        {
            title: t('reservations.total-price'),
            dataIndex: 'total-price',
            key: 'total-price',
        },
        {
            title: '',
            dataIndex: 'x',
            key: 'x',
            render: (text, record) => <TableButtonGroup
                onEdit={() => {
                    openReservationModal("edit")
                }}
                onDelete={() => {
                    openDeleteModal();
                }}
            />
        },
    ];


    return <>
        <div className={classes['page-head']}>
            <SearchField className={classes['search']} placeholder={t('reservations.placeholder')} onSearch={(e) => { setQuery(e)}}/>
            <Button label={t('reservations.add-reservation')} onClick={()=>navigate(`/${routes.RESERVATIONS.addPath}`)}/>
        </div>
        <div className={classes['table']}>
            <Table header={headers}
                   rows={[{
                    "id": 1,
                    "customer": {
                        "id": 7,
                        "email": "customer4@email.com",
                        "first_name": "Arden",
                        "last_name": "Hoeger",
                        "country": {
                            "id": 12,
                            "name": "Montserrat"
                        },
                        "passport_number": "469447439",
                        "phone_number": "323-772-2755",
                        "note": null,
                        "role": {
                            "id": 2,
                            "name": "User"
                        }
                    },
                    "vehicle": {
                        "plate_number": "ŽBXU40",
                        "production_year": 2018,
                        "type": "BMW",
                        "number_of_seats": "7",
                        "daily_rate": 21,
                        "note": null
                    },
                    "date_from": "2022-05-05",
                    "pickup_location": {
                        "id": 4,
                        "name": "Žabljak"
                    },
                    "drop_off_location": {
                        "id": 4,
                        "name": "Žabljak"
                    },
                    "price": "210",
                    "created_at": "2022-11-17T09:52:09.000000Z"
                }]}
                   onRowClick={(record) => openReservationModal("preview")}
            />
        </div>
    </>
}

export default Reservations;