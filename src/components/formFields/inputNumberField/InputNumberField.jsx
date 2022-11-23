import React from 'react';
import { InputNumber } from 'antd';
import Wrapper from "../wrapper/Wrapper";
import "./InputNumberField.scss";
import { Controller } from 'react-hook-form';

const InputNumberField = ({
                        label,
                        error,
                        name,
                        control,
                        placeholder,
                        disabled = false,
                        step='1',
                        readOnly=false
}) => {
    return( 
        <Wrapper label={label} error={error}>
            {control &&
                <Controller name={name} control={control} render={({ field }) => (
                    <InputNumber
                        placeholder={placeholder}
                        status={error ? "error" : ''}
                        disabled={disabled}
                        className={"__input_number_field"}
                        step={step}
                        style={{width:'100%'}}
                        readOnly={readOnly}
                        {...field}
                    />
                )}/>
            }
        </Wrapper>
    );
}

export default InputNumberField;