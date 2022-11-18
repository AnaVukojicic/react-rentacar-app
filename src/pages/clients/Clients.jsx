import React, {useEffect, useState} from 'react';
import SearchField from "../../components/search/Search";
import {t} from 'react-switch-lang';
import Table from "../../components/table/Table";
import {useModal} from "../../contexts/ModalContext";
import ClientForm from "./clientForm/ClientForm";
import classes from "./Clients.module.scss";
import Button from "../../components/buttons/button/Button";
import {clientService} from "../../services/ClientService";
import TableButtonGroup from "../../components/buttons/tableButtonGroup/TableButtonGroup";
import {useQuery} from "react-query";
import DeleteForm from './deleteForm/DeleteForm';


const Clients = () => {
    const {open, close} = useModal()
    const [query, setQuery] = useState("")

    const {data: rows} = useQuery(['clients', query],
        () => clientService.getAll(query), {
        enabled: true,
            initialData: []
    })

    const openClientModal = (type, id = null) => {
        //type - add ,edit, preview
        //id - null or number

        console.log(type === 'add'
            ? t('clients.add-client')
            : type === 'edit'
                ? t('clients.edit-client')
                : t('common.preview'))

        open({
            title: type === 'add'
                ? t('clients.add-client')
                : type === 'edit'
                    ? t('clients.edit-client')
                    : t('common.preview'),
            content: <ClientForm type={type}
                                 id={id}
                                 cancel={close}/>
        })
    }

    const openDeleteModal=(id=null)=>{
        open({
            title: t('clients.delete.title'),
            content: <DeleteForm id={id} cancel={close}/>
        })
    }

    const headers = [
        {
            title: t('clients.name'),
            dataIndex: 'id',
            key: 'id',
            render: (text, record) => record.getFullName()
        },
        {
            title: t('clients.number'),
            dataIndex: 'idNumber',
            key: 'idNumber',
        },
        {
            title: t('clients.phone'),
            dataIndex: 'phone',
            key: 'phone',
        },
        {
            title: t('clients.email'),
            dataIndex: 'email',
            key: 'email',
        },
        {
            title: t('clients.note'),
            dataIndex: 'note',
            key: 'note',
        },
        {
            title: '',
            dataIndex: 'x',
            key: 'x',
            render: (text, record) => <TableButtonGroup
                onEdit={() => {
                    openClientModal("edit", record?.id)
                }}
                onDelete={() => {
                    openDeleteModal()
                }}
            />
        },
    ];


    return <>
        <div className={classes['page-head']}>
            <SearchField className={classes['search']} placeholder={t('clients.placeholder')} onSearch={(e) => {
                setQuery(e)
            }}/>
            <Button label={t('clients.add-client')} onClick={(e) => openClientModal('add')}/>
        </div>
        <div className={classes['table']}>
            <Table header={headers}
                   rows={rows}
                   onRowClick={(record) => openClientModal("preview", record?.id)}/>
        </div>
    </>
}

export default Clients;