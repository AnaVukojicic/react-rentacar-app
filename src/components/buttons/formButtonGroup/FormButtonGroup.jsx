import React from 'react';
import Button from "../button/Button";
import {t} from 'react-switch-lang';
import classes from "./FormButtonGroup.module.scss";

const FormButtonGroup = ({onCancel,deleteType=false}) => {
    return <div className={classes['container']}>
        <Button type="reset" label={t('common.cancel')} onClick={(e) => {
            onCancel()
        }}/>
        <Button type="submit" label={deleteType ? t('common.delete') : t('common.save')} color="green" onClick={() => {}}/>
    </div>
}

export default FormButtonGroup;