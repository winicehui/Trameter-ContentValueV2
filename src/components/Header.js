import React, { Component } from 'react';
import axios from 'axios'
import { Container, Grid } from '@material-ui/core';
import { withRouter } from "react-router";

import ContentCard from './contentCard'
import contentValues from '../static/content'

import firebase from '../firebase'

class Header extends Component {
    constructor (props){
        super(props)
        this.state = {
            C_list: [], 
            J_list: [],
            pathname: '', 
            isLoaded: false
        }
    }
    
    update(){
        const pathname = this.props.location.pathname.substring(1)
        console.log(pathname)
        const contentsRef = firebase.database().ref('/content');
        contentsRef.on('value', (snapshot) => {
            let categories_C = snapshot.val();
            let C_list = {};
            let J_list = {}
            let all_C = 0
            let all_J = 0
            for (let category in categories_C) {
                var count = 0
                var sum = 0
                for (let id in categories_C[category]['C']) {
                    count = count + 1
                }
                for (let id in categories_C[category]['J']) {
                    sum = sum + categories_C[category]['J'][id]
                }

                C_list[category] = count
                J_list[category] = sum
                all_C = all_C + count
                all_J = all_J + sum
            }

            C_list["All"] = all_C
            J_list["All"] = all_J

            this.setState({
                C_list: C_list,
                J_list: J_list,
                pathname: pathname, 
                isLoaded: true
            })
        })
    }

    componentDidMount(){
        this.update()
        // axios.all([
        //     axios({
        //         method: 'GET',
        //         url: `/api/contents/allC`,
        //     }), 
        //     axios({
        //         method: 'GET',
        //         url:`/api/contents/allJ`
        //     })
        // ])
        // .then(axios.spread( (C_response, J_response) =>{
        //     this.setState({
        //         C_list: C_response.data.data, 
        //         J_list: J_response.data.data,
        //         isLoaded: true
        //     })
        // }))
        // .catch(err =>
        //     console.log(err)
        // );
    }

    static getDerivedStateFromProps(nextProps, prevState) {
        return (nextProps.location.pathname.substring(1) !== prevState.pathname)
            ? { pathname: nextProps.location.pathname.substring(1), isLoaded: false }
            : null
    }
    
    componentDidUpdate(nextProps) {
        if (this.state.isLoaded === false) {
            this.update()
        }
    }

    render() {
        const { C_list, J_list, pathname } = this.state
        console.log(C_list)

        return (
            this.state.isLoaded ?
            <Container>
                <h1 className = "Title"> Content Value </h1>
                <Grid 
                    container 
                    spacing={8}
                    >
                    {contentValues.map((element, i) =>
                        (<Grid item xs={4} sm={3} md={2} lg = {2} key = {i}>
                            <ContentCard 
                                content={element} 
                                C={C_list[element.content] || 0 } 
                                J={J_list[element.content] || 0} 
                                pathname = {pathname}/>
                        </Grid>)
                    )}
                </Grid>
            </Container>
            : null
        ) 
    }
}

export default withRouter(Header);
