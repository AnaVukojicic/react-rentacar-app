import React from 'react';
import Button from "../button/Button";
import {t} from 'react-switch-lang';
import classes from "./TableButtonGroup.module.scss";

const TableButtonGroup = ({
    onEdit,
    onDelete
}) => {
    return <div className={classes['container']}>
        <Button label={t('common.edit')} onClick={(e) => {
            e.stopPropagation()
            onEdit(e)
        }}/>
        <Button label={t('common.delete')} color="red" onClick={(e) => {
            e.stopPropagation()
            onDelete(e)
        }}/>
    </div>
}

export default TableButtonGroup;