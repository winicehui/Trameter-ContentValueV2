import React, { Component } from 'react';
import { Paper, Grid } from '@material-ui/core';

class contentCard extends Component {
    render() {
        const { content, C, J } = this.props
        return (
            <Paper elevation = {1} square className = "ContentCard-Border">
                <p className="ContentCard-Label" style={{ backgroundColor: content.color }}> {content.content} </p>
                <Grid
                    container
                    spacing={0}
                    >
                    <Grid item xs={6} className = "ContentCard-BorderSplit">
                        <p className = "ContentCard-C-Label">C</p>
                        <p className = "ContentCard-Text">{C}</p>
                    </Grid>
                    <Grid item xs={6}>
                        <p className = "ContentCard-J-Label">J</p>
                        <p className = "ContentCard-Text">{J}</p>
                    </Grid>
                </Grid>
            </Paper>
        );
    }
}

export default contentCard;
