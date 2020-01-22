import React from 'react';
import { Box, useTheme, Grid, Fab, IconButton } from '@material-ui/core';

export default function ActionGroup({ snapshot, position, actions }) {
    const theme = useTheme();
    const [vertical, horizontal] = position.split(' ');
    return <Box style={{
        position: "absolute",
        [vertical]: theme.spacing(2),
        [horizontal]: theme.spacing(2)
    }}>
        <Grid container>
            {actions.map((action, i) => {
                const ActionButton = action.transparent ? IconButton : Fab;
                return <Grid key={i} item>
                    <ActionButton>
                        
                    </ActionButton>
                </Grid>
            })}
        </Grid>
    </Box>
}
