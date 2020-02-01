import React, { useMemo, useCallback } from 'react';
import { get } from 'lodash';
import { Grid, Typography, TextField } from '@material-ui/core';

export default function Form({ form, data, onChange }) {

    function handleChange(d) {
        onChange(d);
    }

    return <Grid container direction="column">
        {form.map((props, index) => <Grid item key={index}>
            <Control {...props} data={data} onChange={handleChange}/>
        </Grid>)}
    </Grid>
}

function Control({ control, set, data, onChange, ...props }) {

    const handleChange = useCallback((v) => {
        onChange({
            ...data,
            [set]: v
         });
    }, [data, onChange, set]);

    return useMemo(() => {
        switch (control) {
            case 'message': 
                return <Message {...props}/>
            case 'text':
                return <TextField 
                    {...props} 
                    value={get(data, set) || ""}
                    onChange={ev => handleChange(ev.target.value)}
                    />
            default:
                return control;
        }
    }, [control, data, handleChange, props, set]);

}

function Message({ text }) {
    return <Typography gutterBottom>{text}</Typography>
}
