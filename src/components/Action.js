import React, { useState, useEffect, useCallback } from 'react';
import { get } from 'lodash';
import { Dialog, Box, Typography } from '@material-ui/core';
import Collection from './Collection';
import Generic, { parseProps } from './Generic';
import Snackbar from '@material-ui/core/Snackbar';
import MuiAlert from '@material-ui/lab/Alert';
import { firebase } from '../firebase';

export default function Action({ open = false, snapshot, input, output, component, trigger, onClose }) {

    const [snackbar, setSnackbar] = useState({
        open: false,
    });

    const runActionCallback = useCallback(runAction);

    function handleSelect(e) {
        runAction(e);
    }

    useEffect(() => {
        if (open) {
            runActionCallback({
                data: snapshot.data(),
            });
        }
    }, [open, runActionCallback, snapshot]);

    function handleTriggerEvent() {
        runAction({
            data: snapshot.data(),
        });
    }

    function handleSnackbarClose() {
        setSnackbar({
            ...snackbar,
            open: false,
        });
    }

    async function runAction(context) {

        context = {
            ...context,
            firestore: firebase.firestore
        };

        if (output.insert) {
            getCollection(snapshot, output.insert.path).add(parseProps(output.insert.data, context)).catch(err => {
                setSnackbar({
                    open: true,
                    severity: "error",
                    message: err.message
                });
            });
            onClose();
        }
        if (output.update) {
            snapshot.ref.set(parseProps(output.update.data, context), { merge: true }).catch(err => {
                setSnackbar({
                    open: true,
                    severity: "error",
                    message: err.message
                });
            });
        }
    }

    return <React.Fragment>
        {component && <span {...{
            ...(trigger === 'click') && {
                onClick: handleTriggerEvent
            }
        }}>
            <Generic snapshot={snapshot} def={component}/>
        </span>}
        {input && <Dialog fullWidth maxWidth="xs" open={open} onClose={onClose}>
            <Box p={2}>
                {input.message && <Typography variant="body1" gutterBottom>{input.message}</Typography>}
                <Collection 
                    path={get(input, 'select.path', input.select)} 
                    snapshot={snapshot}
                    empty={get(input, 'select.empty')}
                    component={{
                        type: "typography",
                        // eslint-disable-next-line
                        text: "${data.name}",
                        onClick: handleSelect
                }} />
            </Box>
        </Dialog>}
        <Snackbar open={!!snackbar.open} autoHideDuration={6000} onClose={handleSnackbarClose}>
            <Alert onClose={handleSnackbarClose} severity={snackbar.severity}>
            {snackbar.message}
            </Alert>
        </Snackbar>
    </React.Fragment>
}

function Alert(props) {
    return <MuiAlert elevation={6} variant="filled" {...props} />;
}

function getCollection(snapshot, path) {
    let ref = snapshot.ref;
    while (path.startsWith("../")) {
        path = path.replace(/^\.\.\//, '')
        ref = ref.parent;
    }
    return ref.collection(path);
}