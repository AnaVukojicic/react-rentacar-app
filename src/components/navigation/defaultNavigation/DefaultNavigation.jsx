import React from 'react';
import { Menu } from 'antd';
import { t } from 'react-switch-lang';
import { useUser } from '../../../contexts/UserContext';
import Logo from "../../../img/Group 2732.svg";
import clsx from "clsx";
import '../Navigation.scss';

const DefaultNavigation = () => {
    const {setLanguage}=useUser();
    return(
        <Menu mode="horizontal" defaultSelectedKeys={['home']} className={"navigation-menu"}>
            <Menu.Item key="home" className={clsx("logo-item", "item")}>
                <img src={Logo} alt="away" className={"logo-img"}/>
            </Menu.Item>
            <Menu.Item key='en' className={"item"} onClick={() => setLanguage("en")}>{t('language.eng')}</Menu.Item>
            <Menu.Item key='me' className={"item"} onClick={() => setLanguage("me")}>{t('language.mne')}</Menu.Item>
        </Menu>
    )
}

export default DefaultNavigation;