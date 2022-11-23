import React from 'react';
import classes from './Forbidden.module.scss';

const Forbidden = () => {
    return( 
        <div className={classes['container']}>
            <p><span>403</span> Forbidden</p>
            <p>You cannot acces this page!</p>
        </div>
    );
}

export default Forbidden;