import React, { useMemo, Suspense } from 'react';
import {mapValues,get} from 'lodash';
import Spinner from './Spinner';
import Center from './Center';

export default function Generic({ match, path, snapshot, style, def }) {

    const data = snapshot.data();

    def = def || data.root;

    style = style || {
        height: "100%"
    };

    if (!def) {
        return <Projection 
            path={path} 
            style={style}
            snapshot={snapshot} 
            props={data}/>
    }

    if (!Array.isArray(def)) {
        def = [def];
    }

    return def.map((props, key) => <Projection {...{
        key,
        path,
        match,
        style,
        snapshot,
        props,
    }}/>);
}

export function parseProps(context, props) {
    return mapValues(props, (value, key) => {
        if (typeof value == 'string') {
            if (value.match(/^\${.*}$/) && value.substring(2).indexOf('$') === -1) {
                return get(context, value.match(/\${(.*)}/)[1]);
            }
            return value.replace(/\${([^}]*)}/g, (match, path) => get(context, path));
        } else {
            return value;
        }
    });
}

function Projection({ match, path, snapshot, style, props }) {

    const {type} = props;

    const data = snapshot.data();

    const context = {
        data,
        snapshot,
    };

    const LoadableComponent = useMemo(() => React.lazy(() => {
        if (type) {
            return import('./' + snakeToCamel(type));
        }
    }), [type]);

    if (!type) {
        return <Center>
            {`data=${JSON.stringify(data)}`}
        </Center>;
    }

    return <Suspense fallback={<Spinner/>}>
        <LoadableComponent 
            match={match} 
            style={style}
            path={path} 
            snapshot={snapshot} 
            {...parseProps(context, props)}/>
    </Suspense>
}

function snakeToCamel(str) {
    return str.charAt(0).toUpperCase() + str.substring(1).replace(/_(.)/g, (a, b) => `${b.toUpperCase()}`)
}