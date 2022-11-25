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
import { reservationService } from '../../services/ReservationService';
import { useQuery } from 'react-query';
import ReservationForm from './reservationForm/ReservationForm';
import { storageService } from '../../services/StorageService';
import { storageKeys, userRoles } from '../../config/config';
import { DatePicker } from 'antd';
import '../../components/formFields/dateField/DateField.scss'

const Reservations = () => {
    const {open, close} = useModal()
    const [query1, setQuery1] = useState("");
    const [query2,setQuery2]=useState("");
    const navigate=useNavigate();

    const {data: rows} = useQuery(['reservations', query1,query2],
        () => reservationService.getAll(query1,query2), {
            enabled: true,
            initialData: []
    })

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
            dataIndex: 'clientsName',
            key: 'clientsName',
            render: (text, record) => record.getClientsName()
        },
        {
            title: t('reservations.vehicles-plates'),
            dataIndex: 'vehiclePlates',
            key: 'vehiclesPlates',
            render: (text,record)=>record.getVehiclePlates()
        },
        {
            title: t('reservations.date-from'),
            dataIndex: 'dateFrom',
            key: 'dateFrom',
            render:(text,record)=>record?.getFormattedDateFrom()
        },
        {
            title: t('reservations.date-to'),
            dataIndex: 'dateTo',
            key: 'dateTo',
            render:(text,record)=>record?.getFormattedDateTo()
        },
        {
            title: t('reservations.pick-up-location'),
            dataIndex: 'pickUp',
            key: 'pickUp',
            render:(text,record)=>record?.getPickUpName()
        },
        {
            title: t('reservations.drop-off-location'),
            dataIndex: 'dropOff',
            key: 'dropOff',
            render:(text,record)=>record?.getDropOffName()
        },
        {
            title: t('reservations.total-price'),
            dataIndex: 'totalPrice',
            key: 'totalPrice',
        },
        {
            title: '',
            dataIndex: 'x',
            key: 'x',
            render: (text, record) => <TableButtonGroup
                onEdit={() => {
                    openReservationModal("edit",record?.id)
                }}
                onDelete={() => {
                    openDeleteModal(record?.id);
                }}
            />
        },
    ];

    useEffect(()=>{
        if(storageService.exists(storageKeys.ROLE) && parseInt((storageService.get(storageKeys.ROLE)))!==userRoles.EMPLOYEE){
            navigate('/forbidden');
        }
    },[])


    return <>
        <div className={classes['page-head']}>
            <DatePicker style={{ width: '100%' }} 
                        placeholder="Select date from"
                        onChange={(d,ds)=>setQuery1(ds)}
                        className={"__date_field"}
            />
            <DatePicker style={{ width: '100%' }} 
                        placeholder="Select date to"
                        onChange={(d,ds)=>setQuery2(ds)}
                        className={"__date_field"}
            />
            <Button label={t('reservations.add-reservation')} onClick={()=>navigate(`/${routes.RESERVATIONS.addPath}`)}/>
        </div>
        <div className={classes['table']}>
            <Table header={headers}
                   rows={rows}
                   onRowClick={(record) => openReservationModal("preview",record?.id)}
            />
        </div>
    </>
}

export default Reservations;