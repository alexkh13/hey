import React from 'react';
import { Box } from "@material-ui/core";
import Center from './components/Center';

export default function Home() {
    return <Box p={2} className="fill" style={{
        backgroundImage: "url(https://firebasestorage.googleapis.com/v0/b/hey--x.appspot.com/o/background.jpeg?alt=media&token=268e97ea-2160-43c0-954d-d258c5ba601a)",
        backgroundSize: "cover",
        backgroundPosition: "center"
    }}>
        <Center>
            <img alt="logo" src="logo512.png" style={{opacity:.8}} width={100}/>
        </Center>
    </Box>
}