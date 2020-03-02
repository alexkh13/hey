import React, { useMemo, Suspense, useState } from 'react';
import {each, reduce} from 'lodash';
import Spinner from './Spinner';
import { auth } from '../firebase';
import expr from 'expression-eval';

export default function Generic({ match, snapshot, style, def, disableLoading, context, debug }) {

    const data = snapshot.data();

    def = def || data.root;

    if (!def) {
        return <Projection 
            disableLoading={disableLoading}
            style={style}
            match={match}
            snapshot={snapshot} 
            props={data}
            context={context}/>
    }

    if (!Array.isArray(def)) {
        def = [def];
    }

    return def.map((props, key) => <Projection {...{
        disableLoading,
        key,
        match,
        style,
        snapshot,
        props,
        context,
    }}/>);
}

function evaluate(context, expression) {
    try {
        const ast = expr.parse(expression);
        return expr.eval(ast, context);
    } 
    catch(err) {
        console.error(err);
        return;
    }
}

export function parseProps(props, context, depth = 0) {
    if (depth > 2) {
        return props;
    }

    const newProps = {};

    context = {
        window,
        user: {
            ...auth.currentUser,
        },
        find: (s, f) => {
            return s && s.docs.find((d) => evaluate({ ...context, d }, f));
        },
        json: JSON.stringify,
        reduce: (s, f, m) => reduce(s, (m, d) => {
            return evaluate({ ...context, m, d }, f);
        }, m), 
        ...context,
    }

    each(props, (value, key) => {
        if (typeof key !== 'string') return;
        const res = { key, value };
        if (key.charAt(0) === '$') {
            res.key = key.substring(1);
        } else {
            res.value = (() => {
                if (key === 'contextAssign') return value;
                if (typeof value == 'string') {
                    if (value.match(/^\${.*}$/) && value.substring(2).indexOf('$') === -1) {
                        return evaluate(context, value.match(/\${(.*)}/)[1]);
                    }
                    return value.replace(/\${([^}]*)}/g, (_, expression) => evaluate(context, expression));
                } if (typeof value == 'function') {
                    return () => value(context);
                } else if (key !== 'children' && Array.isArray(value)) {
                    return value.map(v => parseProps(v, context));
                } else if (typeof value == 'object' && !Array.isArray(value)) {
                    return parseProps(value, context, depth + 1);
                } else {
                    return value;
                }
            })();
        }
        newProps[res.key] = res.value;
    });
    return newProps;
}

function Projection({ match, snapshot, style, props, disableLoading, context }) {

    const [loadingError, setLoadingError] = useState();

    const {type} = props;

    const data = snapshot.data();

    context = {
        ...context,
        data,
        snapshot,
        match,
    };

    const LoadableComponent = useMemo(() => React.lazy(() => {
        if (type) {
            return import('./' + snakeToCamel(type)).catch(err => {
                console.error(err);
                setLoadingError(err);
            });
        }
    }), [type]);

    if (!type) {
        return <div {...props}/>;
    }

    return <Suspense fallback={loadingError ? loadingError.message : (!disableLoading && <Spinner/>)}>
        <LoadableComponent 
            match={match} 
            style={style}
            snapshot={snapshot} 
            context={context}
            {...parseProps(props, context)}/>
    </Suspense>
}

function snakeToCamel(str) {
    return str.charAt(0).toUpperCase() + str.substring(1).replace(/_(.)/g, (a, b) => `${b.toUpperCase()}`)
}

export function getCollection(snapshot, path) {
    if (!path) {
        return;
    }
    let ref = snapshot.ref;
    while (path.startsWith("../")) {
        path = path.replace(/^\.\.\//, '')
        ref = ref.parent;
    }
    return ref.collection(path);
}