import React from 'react';
import { Input } from 'antd';
import Wrapper from "../wrapper/Wrapper";
import {Controller} from 'react-hook-form';
import "./PasswordField.scss";

const InputField = ({
                        label,
                        name,
                        placeholder,
                        error,
                        disabled = false,
                        control
}) => {
    return <Wrapper label={label} error={error}>
        {control &&
        <Controller
            name={name}
            control={control}
            render={({ field }) => (
                <Input.Password
                placeholder={placeholder}
                status={error ? "error" : ''}
                disabled={disabled}
                className={"__password_field"}
                {...field}
                />
            )}
        />
        }
    </Wrapper>
}

export default InputField;