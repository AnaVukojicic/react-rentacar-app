import React from 'react';
import './TextAreaField.scss';
import Wrapper from '../wrapper/Wrapper';
import { Input } from 'antd';
import { Controller } from 'react-hook-form';
const { TextArea } = Input;

const TextAreaField = ({
                        label,
                        name,
                        error,
                        placeholder,
                        disabled = false,
                        control,
                        rows='4'
}) => {
    return (
        <Wrapper label={label} error={error}>
            {control && 
                <Controller name={name} control={control} render={({field})=>(
                    <TextArea 
                        placeholder={placeholder}
                        status={error ? "error" : ''}
                        disabled={disabled}
                        className={"__textarea_field"}
                        rows={rows}
                        {...field}
                    /> 
                )}/>
            }   
        </Wrapper>
    )
}
export default TextAreaField;