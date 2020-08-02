import React, { Component } from 'react';
import { Grid } from '@material-ui/core';

import Left from './Left'
import Right from './Right'

import firebase from '../firebase'

class Body extends Component {
    constructor(props) {
        super(props)
        this.state = {
            chosenIndex: 0,
            numPosts: 0, 
            isLoaded: false
        }
    }

    handleToggleIndex = (index) => {
        this.setState({ chosenIndex: index })
    }

    componentDidMount() {
        const postsRef = firebase.database().ref('/posts');
        postsRef.on('value', (snapshot) => {
            let numPosts = snapshot.numChildren();
            this.setState({
                numPosts: numPosts, 
                isLoaded: true, 
                chosenIndex: 0
            })
        })
    }

    render() {
        return (
            this.state.isLoaded ? 
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
                    <Grid 
                        container
                        alignItems='center'
                        justify='center'>
                        <Grid item xs = {8}/>
                        <Grid item xs={4}> <p style={{ float: 'center', margin: '20px 0 20px 0' }}> Total # of posts: {this.state.numPosts}</p>
                    </Grid> 
                        
                    </Grid> 
                        <Left handleToggleIndex={this.handleToggleIndex}/>
                    </Grid>
                    <Grid item xs={12} sm={6} style={{ borderLeft: '3px solid #707070'}}>
                        { this.state.chosenIndex !== 0 
                            ? <Right id = {this.state.chosenIndex} /> 
                            : null }
                    </Grid>
                </Grid>
            : null 
        );
    }
}

export default Body;