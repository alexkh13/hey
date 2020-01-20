import React from 'react';
import { Dialog } from '@material-ui/core';
import Collection from './Collection';
import { parseProps } from './Generic';

export default function Action({ open = false, snapshot, input, output, onClose }) {

    async function handleSelect(e) {
        if (output.insert) {
            snapshot.ref.collection(output.insert.path).add(parseProps(output.insert.data, e));
            onClose();
        }
    }

    return <Dialog open={open}>
        <Collection 
            path={input.select} 
            snapshot={snapshot}
            component={{
                type: "typography",
                // eslint-disable-next-line
                text: "${data.name}",
                onClick: handleSelect
            }} />
    </Dialog>
}
