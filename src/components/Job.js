import React, { Component } from 'react';
import { Paper, Grid } from '@material-ui/core';

class jobCard extends Component {
    render() {
        const { content } = this.props
        return (
            <Paper elevation={0} square className="ContentCard-Border">
                <p className="ContentCard-Label" style={{ backgroundColor: content.color }}> {content.content} </p>
                <Grid
                    container
                    spacing={0}
                >
                    <Grid item xs={3} className="ContentCard-BorderSplit">
                        <p className="ContentCard-Text">-</p>
                    </Grid>
                    <Grid item xs={6} className="ContentCard-BorderSplit">
                        <p style={{ backgroundColor: '#353B51', color: '#FFFFFF', margin: '0px', padding: '2px', textAlign: 'center'}}>100</p>
                    </Grid>
                    <Grid item xs={3}>
                        <p className="ContentCard-Text">+</p>
                    </Grid>
                </Grid>
            </Paper>
        );
    }
}

export default jobCard;
