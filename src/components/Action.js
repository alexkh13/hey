import React, { useState, useEffect, useCallback } from 'react';
import { useHistory } from 'react-router-dom';
import { set, each } from 'lodash';
import { Dialog, DialogContent, DialogActions, Button } from '@material-ui/core';
import Generic, { parseProps, getCollection } from './Generic';
import Snackbar from '@material-ui/core/Snackbar';
import MuiAlert from '@material-ui/lab/Alert';
import { firebase } from '../firebase';
import Form from './Form';

export default function Action({ open, snapshot, input, output, component, trigger, match, context, onClose }) {

    const history = useHistory();
    const [ state, setStateRaw ] = useState({
        dialog: {
            open
        },
        snackbar: {
            open: false
        },
        inputData: input && input.data
    });

    const setState = useCallback((obj, v) => {
        let newState = {...state};
        if (typeof obj === 'string') {
            obj = {[obj]: v}
        }
        each(obj, (value, attr) => {
            newState = set(newState, attr, value);
        });
        setStateRaw(newState);
    }, [state]);

    const runActionCallback = useCallback(runAction);

    useEffect(() => {
        if (!state.dialog.open && open) {
            runActionCallback({});
        }
        if (state.dialog.open && !open) {
            setState('dialog.open', false);
        }
    }, [open, runActionCallback, setState, snapshot, state.dialog.open]);

    function handleTriggerEvent() {
        runAction({});
    }

    function handleSnackbarClose() {
        setState('snackbar.open', false);
    }

    async function runAction(ctx) {

        ctx = { 
            ...context,
            ...ctx
        }

        if ((!state.phase && input) || state.phase === 'input') {
            setState({
                'dialog.open': true,
                'phase': 'input',
                'inputData': parseProps(input && input.data, ctx)
            });
        }

        if (state.phase !== 'output' && !(state.phase || input)) {
            setState({
                ...state,
                'phase': 'output',
            });
            processOutput(ctx);
        }
    }

    async function processOutput(context) {

        context = {
            ...context,
            match,
            snapshot,
            data: snapshot.data(),
            firestore: firebase.firestore
        };

        if (output) {
            let self;
            if (output.insert) {
                self = await getCollection(snapshot, output.insert.path)
                    .add(parseProps(output.insert.data, context))
                    .catch(err => {
                        setState('snackbar', {
                            open: true,
                            severity: "error",
                            message: err.message
                        });
                    });
                onClose();
            }
            if (output.update) {
                self = await snapshot.ref.set(parseProps(output.update.data, context), { merge: true }).catch(err => {
                    setState('snackbar', {
                        open: true,
                        severity: "error",
                        message: err.message
                    });
                });
            }
            if (output.link) {
                const { link } =  parseProps({ link: output.link }, {
                    ...context,
                    self,
                });
                history.push(link);
            }
        }
    }

    function handleInputDataChange(inputData) {
        setState('inputData', inputData);
    }

    function handleClose() {
        onClose();
    }

    function handleFormButtonClick() {
        processOutput({
            input: state.inputData
        });
    }

    return <React.Fragment>
        {component && <span {...{
            ...(trigger === 'click') && {
                onClick: handleTriggerEvent
            }
        }}>
            <Generic snapshot={snapshot} def={component}/>
        </span>}
        {input && <Dialog 
            fullWidth 
            maxWidth="xs" 
            open={state.dialog.open} 
            onClose={handleClose}>
            <DialogContent>
                <Form form={input.form} data={state.inputData} onChange={handleInputDataChange}/>
            </DialogContent>
            <DialogActions>
                <FormButton {...input.button} onClick={handleFormButtonClick}/>
            </DialogActions>
        </Dialog>}
        <Snackbar open={!!state.snackbar.open} autoHideDuration={6000} onClose={handleSnackbarClose}>
            <Alert onClose={handleSnackbarClose} severity={state.snackbar.severity}>
            {state.snackbar.message}
            </Alert>
        </Snackbar>
    </React.Fragment>
}

function FormButton({ text, ...props }) {
    return <Button {...props}>{text}</Button>
}

function Alert(props) {
    return <MuiAlert elevation={6} variant="filled" {...props} />;
}