import React from 'react';
import { DatePicker } from 'antd';
import Wrapper from "../wrapper/Wrapper";
import "./DateField.scss";
import { Controller } from 'react-hook-form';

const DateField = ({
                        label,
                        name,
                        error,
                        placeholder,
                        disabled = false,
                        control,
                        picker='date'
}) => {
    return( 
        <Wrapper label={label} error={error}>
        {control &&
            <Controller name={name} control={control} render={({ field }) => (
                <DatePicker
                    style={{ width: '100%' }}
                    picker={picker}
                    placeholder={placeholder}
                    status={error ? "error" : ''}
                    disabled={disabled}
                    className={"__date_field"}
                    {...field}
                />
            )}/>
        }
    </Wrapper>
    );
}

export default DateField;