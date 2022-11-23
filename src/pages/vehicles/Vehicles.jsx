import React, {useEffect, useState} from 'react';
import SearchField from "../../components/search/Search";
import {t} from 'react-switch-lang';
import Table from "../../components/table/Table";
import {useModal} from "../../contexts/ModalContext";
import classes from "../clients/Clients.module.scss";
import Button from "../../components/buttons/button/Button";
import TableButtonGroup from "../../components/buttons/tableButtonGroup/TableButtonGroup";
import VehicleForm from './vehicleForm/VehicleForm';
import DeleteForm from './deleteForm/DeleteForm';
import { vehicleService } from '../../services/VehicleService';
import { useQuery } from 'react-query';
import { storageService } from '../../services/StorageService';
import { storageKeys, userRoles } from '../../config/config';
import { useNavigate } from 'react-router-dom';


const Vehicles = () => {
    const navigate=useNavigate();
    const {open, close} = useModal()
    const [query, setQuery] = useState("")

    const {data: rows} = useQuery(['vehicles', query],
        () => vehicleService.getAll(query), {
            enabled: true,
            initialData: []
    })

    const openVehicleModal = (type, id = null) => {
        open({
            title: type === 'add' ? t('vehicles.add-vehicle')
                    : type === 'edit' ? t('vehicles.edit-vehicle')
                    : t('common.preview'),
            content: <VehicleForm type={type}
                                 id={id}
                                 cancel={close}
                     />
        })
    }

    const openDeleteModal=(id=null)=>{
        open({
            title: t('vehicles.delete.title'),
            content: <DeleteForm id={id} cancel={close}/>
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
            title: t('vehicles.type'),
            dataIndex: 'type',
            key: 'type',
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
        },
        {
            title: t('vehicles.note'),
            dataIndex: 'note',
            key: 'note',
        },
        {
            title: '',
            dataIndex: 'x',
            key: 'x',
            render: (text, record) => <TableButtonGroup
                onEdit={() => {
                    openVehicleModal("edit",record?.id)
                    console.log('edit');
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
            <SearchField className={classes['search']} placeholder={t('vehicles.placeholder')} onSearch={(e) => { setQuery(e);}}/>
            <Button label={t('vehicles.add-vehicle')} onClick={(e) => openVehicleModal('add')}/>
        </div>
        <div className={classes['table']}>
            <Table header={headers}
                   rows={rows}
                   onRowClick={(record) => openVehicleModal("preview",record?.id)}
            />
        </div>
    </>
}

export default Vehicles;