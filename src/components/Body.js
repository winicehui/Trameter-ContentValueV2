import React, { Component } from 'react';
import { Grid } from '@material-ui/core';

import Left from './Left'
import Right from './Right'

class Body extends Component {
    constructor(props) {
        super(props)
        this.state = {
            chosenIndex: 0,
        }
    }

    handleToggleIndex = (index) => {
        this.setState({ chosenIndex: index })
    }

    render() {
        return (
                <Grid 
                    container
                >
                    <Grid item xs={12} sm={6} 
                        style={{ 
                            maxHeight: '520px', 
                            borderRight: '3px solid #707070', 
                            margin: '0px', 
                            padding: '0px', 
                            overflowY: 'scroll'}}>
                        <Left handleToggleIndex={this.handleToggleIndex}/>
                    </Grid>
                    {/* <Divider orientation="vertical" flexItem /> */}
                    <Grid item xs={12} sm={6} style={{ borderLeft: '3px solid #707070'}}>
                        { this.state.chosenIndex !== 0 
                            ? <Right id = {this.state.chosenIndex} /> 
                            : null }
                    </Grid>
                </Grid>
        );
    }
}

export default Body;