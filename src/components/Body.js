import React, { Component } from 'react';
import { Grid, Divider } from '@material-ui/core';
import Left from './Left'
import Right from './Right'

class Body extends Component {
    render() {
        return (
                <Grid 
                    container
                >
                    <Grid item xs={12} sm={6} 
                        style={{ maxHeight: '544px', borderRight: '3px solid #707070', margin: '0px', padding: '0px', overflowY: 'scroll'}}>
                        <Left />
                    </Grid>
                    {/* <Divider orientation="vertical" flexItem /> */}
                    <Grid item xs={12} sm={6} style={{ borderLeft: '3px solid #707070'}}>
                        <Right/>
                    </Grid>
                </Grid>
        );
    }
}

export default Body;
