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

export default function Document({ snapshot, match, path, id, view }) {

  path = `${path}/${id}`;

  const context = useContext(mainContext);

  const document = useMemo(() => firestore.doc(path), [path]);

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

    return debug ? 
      ({ rawData, children }) => {

        function save() {
          const data = JSON.parse(rawData);
          document.set(data).then(() => {

          }).catch(err => {
            console.error(err);
          });
        }
        
        return <Grid container direction="column" className="fill" style={{ 
          position: 'relative',
        }}>
          <Grid item xs className="scroll">{children}</Grid>
          <Divider/>
          <Grid item xs className="scroll">
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
  }, [debug, document, theme]);

  return loading ? <Spinner/> : 
    error ? <Error message={`path=${path} error=${JSON.stringify(error)}`} />
    : s.exists 
      ? <mainContext.Provider value={snapshot ? {snapshot} : context}>
        <Wrapper rawData={raw}>
          <Generic match={match} snapshot={s} path={path} def={parseDef()}/>
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