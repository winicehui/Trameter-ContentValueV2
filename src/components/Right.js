import React, { Component } from 'react';
import { Container, Grid } from '@material-ui/core';

import Job from './Job'
import contentValues from '../static/content'

class Right extends Component {
    render() {
        return (
            <Container>
                <h1 className="Title"> Job Done </h1>
                <Grid
                    container
                >
                    {contentValues.map((element, i) =>(
                        (element.content !== "All") ? 
                        <Grid item xs={4} sm={3} md={2} key={i} style = {{margin: '10px'}}>
                            <Job content={element} />
                        </Grid> : null
                    )
                    )}
                </Grid>
            </Container>
        );
    }
}

export default Right;
