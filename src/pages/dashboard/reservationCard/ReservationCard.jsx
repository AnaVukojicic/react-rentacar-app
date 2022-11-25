import React from 'react';
import { t } from 'react-switch-lang';
import classes from './ReservationCard.module.scss'

const ReservationCard=({dateFrom,dateTo,price,pickUp,dropOff,onClick})=>{
    return(
        <div className={classes['container']} onClick={()=>onClick()}>
            <p>{t("client.pickup")}{pickUp}</p>
            <p>{t("client.dropoff")}{dropOff}</p>
            <p>{t("client.dateFrom")}{dateFrom}</p>
            <p>{t("client.dateTo")}{dateTo}</p>
            <p>{t("client.price")}{price}</p>
        </div>
    )
}

export default ReservationCard;