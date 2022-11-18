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


const Vehicles = () => {
    const {open, close} = useModal()
    const [query, setQuery] = useState("")

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
            dataIndex: 'plate_number',
            key: 'plates',
        },
        {
            title: t('vehicles.year'),
            dataIndex: 'production_year',
            key: 'year',
        },
        {
            title: t('vehicles.type'),
            dataIndex: 'type',
            key: 'type',
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
                    openVehicleModal("edit")
                    console.log('edit');
                }}
                onDelete={() => {
                    openDeleteModal();
                }}
            />
        },
    ];


    return <>
        <div className={classes['page-head']}>
            <SearchField className={classes['search']} placeholder={t('vehicles.placeholder')} onSearch={(e) => { setQuery(e);}}/>
            <Button label={t('vehicles.add-vehicle')} onClick={(e) => openVehicleModal('add')}/>
        </div>
        <div className={classes['table']}>
            <Table header={headers}
                   rows={[{
                    "id": 20,
                    "plate_number": "ŽBPY879",
                    "production_year": 2014,
                    "type": "Hyundai",
                    "number_of_seats": "5",
                    "daily_rate": 23,
                    "note": null,
                    "created_at": "2022-11-17T09:52:09.000000Z",
                    "updated_at": "2022-11-17T09:52:09.000000Z"
                }]}
                   onRowClick={(record) => openVehicleModal("preview")}
            />
        </div>
    </>
}

export default Vehicles;