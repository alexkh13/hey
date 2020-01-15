import React from 'react';
import AddIcon from '@material-ui/icons/Add';
import { Grid, Box, List, ListItem, ListItemText, Fab } from '@material-ui/core';
import Collection from './Collection';

export default function Index({ path, snapshot }) {

    return <Grid container direction="column" alignItems="center" justify="center">
        
        <Box style={{ height: '50vh', width: '100vw' }}>
            
        </Box>

        <Box p={3} style={{ position: 'fixed', bottom: 0, right: 0 }}>
            <Grid container spacing={1}>
                <Grid item>
                    <Fab>
                        <AddIcon/>
                    </Fab>
                </Grid>
            </Grid>
        </Box>
                    
        <Box mt={5} mb={5}>
            <ItemsCollection path={path}>
                {snap => <ItemsList list={snap.docs}/>}
            </ItemsCollection>
        </Box>

    </Grid>
}

function ItemsList({ list }) {
    return <List>
        {list.map((item, i) => <ListItem key={i}>
            <ListItemText primary={item.id}/>
        </ListItem>)}
    </List>
}

function ItemsCollection({ path, ...props }) {
    return <Collection 
        parent={path}
        path="/main"  
        orderBy="createTime desc"
        limit={50} 
        {...props}>
    </Collection>
}