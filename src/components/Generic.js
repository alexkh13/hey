import React, { useMemo, Suspense } from 'react';
import {mapValues,get} from 'lodash';
import Spinner from './Spinner';
import Center from './Center';

export default function Generic({ match, path, snapshot, def }) {

    const data = snapshot.data();

    def = def || data.root;

    if (!def) {
        return <Projection path={path} snapshot={snapshot} props={data}/>
    }

    if (!Array.isArray(def)) {
        def = [def];
    }

    return def.map((props, key) => <Projection {...{
        key,
        path,
        match,
        snapshot,
        props,
    }}/>);
}

export function parseProps(context, props) {
    return mapValues(props, (value, key) => {
        if (typeof value == 'string') {
            return value.replace(/\${(.*)}/g, (match, path) => get(context, path));
        } else {
            return value;
        }
    });
}

function Projection({ match, path, snapshot, props }) {

    const {type} = props;

    const data = snapshot.data();

    const LoadableComponent = useMemo(() => React.lazy(() => {
        if (type) {
            return import('./' + (type.charAt(0).toUpperCase() + type.substring(1)));
        }
    }), [type]);

    if (!type) {
        return <Center>
            {`data=${JSON.stringify(data)}`}
        </Center>;
    }

    return <Suspense fallback={<Spinner/>}>
        <LoadableComponent match={match} path={path} snapshot={snapshot} {...parseProps(data, props)}/>
    </Suspense>
}