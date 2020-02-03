import React, { useMemo, useEffect, useState, useContext } from 'react';
import { get } from 'lodash';
import { useDocument } from "react-firebase-hooks/firestore";
import SaveIcon from '@material-ui/icons/Save';
import { firestore } from '../firebase';
import { Typography, Grid, Divider, Fab, useTheme } from '@material-ui/core';
import Spinner from './Spinner';
import Center from './Center';
import Generic from './Generic';
import useStorageValue from '../hooks/withStorageValue';
import Editor from './Editor';
import mainContext from '../context';

function getDocument(snapshot, path, id) {
  if (snapshot) {
    return snapshot.ref.collection(path).doc(id);
  } else {
    return firestore.doc(`${path}/${id}`);
  }
}

export default function Document({ snapshot, match, path, id, view }) {

  const context = useContext(mainContext);
  const document = useMemo(() => getDocument(snapshot, path, id), [id, path, snapshot]);
  const [ s, loading, error ] = useDocument(document);
  const [ debug ] = useStorageValue('debug');
  const theme = useTheme();
  const [raw, setRaw] = useState();

  useEffect(() => {
    setRaw(s && JSON.stringify(s.data(), null, 2));
  }, [s]);

  function parseDef() {
    if (view) {
      if (typeof view == 'string') {
        return get(snapshot.data().views, view);
      } else {
        return view;
      }
    }
  }

  function onRawChange(v) {
    setRaw(v);
  }

  

  const Wrapper = useMemo(() => {

    return !context.depth && debug ? 
      ({ rawData, children }) => {

        function save() {
          const data = JSON.parse(rawData);
          document.set(data).then(() => {

          }).catch(err => {
            console.error(err);
          });
        }
        
        return <Grid container direction="row" className="fill" style={{ 
          position: 'relative',
        }}>
          <Grid item xs className="fill scroll" style={{
            maxWidth: 400,
            position:'relative'
          }}>{children}</Grid>
          <Divider/>
          <Grid item xs className="fill scroll">
            <Editor onChange={onRawChange} value={rawData}/>
            <Fab onClick={save} style={{
              position: 'absolute',
              bottom: theme.spacing(2),
              right: theme.spacing(2),
            }}>
              <SaveIcon/>
            </Fab>
          </Grid>
        </Grid> 
      }
      : ({ children }) => children
  }, [context.depth, debug, document, theme]);

  return loading ? <Spinner/> : 
    error ? <Error message={`path=${path} error=${JSON.stringify(error)}`} />
    : s.exists 
      ? <mainContext.Provider value={{
        ...context,
        depth: ((context && context.depth)||0) + 1
      }}>
        <Wrapper rawData={raw}>
          <Generic match={match} snapshot={s} def={parseDef()}/>
        </Wrapper>
      </mainContext.Provider>
      : <Error status={404}/>
}

function Error({ status, message }) {
  return <Center>
    <Grid container direction="column" alignItems="center">
    {(() => {
      switch (status) {
        case 404: 
          return <Typography variant="h1" color="textSecondary">404</Typography>
        default:
          return <Grid container direction="column" alignItems="center">
            <Typography variant="h6">Sh*t!@#$</Typography>
            <Typography variant="body2">{message}</Typography>
          </Grid>
      }
    })()}
    </Grid>
  </Center>;
}