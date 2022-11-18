import React from 'react';
import {Outlet} from "react-router-dom";
import classes from './DefaultLayout.module.scss';
import DefaultNavigation from '../../navigation/defaultNavigation/DefaultNavigation.jsx';

const DefaultLayout = () => {
    return(
        <div className={classes['container']}>
            <div className={classes['navbar']}>
                <DefaultNavigation/>
            </div>
            <div className={classes['content']}>
                <Outlet/>
            </div>
        </div>
    );
}

export default DefaultLayout;