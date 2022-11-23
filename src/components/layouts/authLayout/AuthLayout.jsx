import React from 'react';
import {Outlet} from "react-router-dom";
import Navigation from "../../navigation/Navigation";
import Sidebar from "../../sidebar/Sidebar";
import {useUser} from "../../../contexts/UserContext";
import {storageKeys, userRoles} from "../../../config/config";
import classes from './AuthLayout.module.scss';
import { storageService } from '../../../services/StorageService';

const AuthLayout = () => {
    // const {userData} = useUser();

    return(
        <div className={classes['container']}>
            <div className={classes['navbar']}>
                <Navigation/>
            </div>
            <div className={classes['content']}>
                {parseInt(storageService.get(storageKeys.ROLE)) === userRoles.EMPLOYEE &&
                    <Sidebar/>
                }
                <div className={classes['page']}>
                    <Outlet />
                </div>
            </div>
        </div>
    )
}

export default AuthLayout;
