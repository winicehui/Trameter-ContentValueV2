import React, { Component } from 'react';
import { Container, Grid } from '@material-ui/core';

import JobCard from './jobCard'
import contentValues from '../static/content_list'

import firebase from '../firebase'

class Right extends Component {
    constructor(props) {
        super(props)
        this.state = {
            id: 0, 
            J_count: null,
            isLoaded: false
        }
    }

    update= (id) => {
        const postsRef = firebase.database().ref('/content');
        postsRef.on('value', (snapshot) => {
            let categories = snapshot.val();
            let J_count = {}
            for (let category in categories) {
                J_count[category] = 0 
                for (let id_index in categories[category]['J']) {
                    if (id_index === id) {
                        J_count[category]  = categories[category]['J'][id]
                    }
                }
            }
            this.setState({
                id: id,
                J_count: J_count,
                isLoaded: true
            })
        })
    }

    componentDidMount() {
        const { id } = this.props
        this.update(id)
    }

    static getDerivedStateFromProps(nextProps, prevState) {
        return (nextProps.id !== prevState.id)
            ? { id: nextProps.id, isLoaded: false }
            : null
    }

    componentDidUpdate(nextProps) {
        if (this.state.isLoaded === false) {
            this.update(this.state.id)
        }
    }

    render() {
        const { id, J_count } = this.state
        return (
            this.state.isLoaded ? 
            <Container >
                <h1 className="Title"> Job Done </h1>
                <Grid
                    container
                    alignItems='center'
                    justify='center'
                    spacing = {4}
                >
                    { contentValues.map((element, i) =>(
                        (element.content !== "All") 
                        ? <Grid item xs={4} sm={4} md={3} lg = {2} key={i} >
                            <JobCard 
                                content={element} 
                                id = {id} 
                                J = {J_count[element.content] || 0}/>
                          </Grid> 
                        : null
                    ))}
                </Grid>
            </Container>
            : null
        );
    }
}

export default Right;
