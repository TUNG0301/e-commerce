import React from 'react'
import {TextField, Grid} from '@material-ui/core'
import { useFormContext, Controller} from 'react-hook-form'

function InputForm({name, label}) {
    const { control } = useFormContext();
                  
    return (
        <Grid item xs={12} sm={6}>
            <Controller defaultValue="" control={control} name={name} render = {({ field }) => (
                <TextField {...field} fullWidth label={label} required/>
            )} />
        </Grid>
    )
}

export default InputForm

