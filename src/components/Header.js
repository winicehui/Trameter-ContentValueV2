import React, { Component } from 'react';
import axios from 'axios'
import { Container, Grid } from '@material-ui/core';

import ContentCard from './contentCard'
import contentValues from '../static/content'

import firebase from '../firebase'

class Header extends Component {
    constructor (props){
        super(props)
        this.state = {
            C_list: [], 
            J_list: [],
            isLoaded: false
        }
    }

    componentDidMount(){
        const postsRef = firebase.database().ref('/content');
        postsRef.on('value', (snapshot) => {
            let categories_C = snapshot.val();
            console.log(categories_C)
            let C_list = {};
            let J_list = {}
            let all_C = 0
            let all_J = 0
            for (let category in categories_C) {
                var count = 0
                var sum = 0
                for (let id in categories_C[category]['C']){
                    count = count + 1
                }
                for (let id in categories_C[category]['J']){
                    sum = sum + categories_C[category]['J'][id]    
                }
                
                C_list[category] = count
                J_list[category] = sum
                all_C = all_C + count 
                all_J = all_J + sum
                console.log(C_list)
                console.log(J_list)
            }

            C_list["All"] = all_C
            J_list["All"] = all_J

            this.setState({
                C_list: C_list,
                J_list: J_list
            })
        })
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
    
    render() {
        const { C_list, J_list } = this.state

        return (
            // this.state.isLoaded ?
            <Container>
                <h1 className = "Title"> Content Value </h1>
                <Grid 
                    container 
                    spacing={8}
                    >
                    {contentValues.map((element, i) =>
                        (<Grid item xs={4} sm={3} md={2} lg = {2} key = {i}>
                            <ContentCard content={element} C={C_list[element.content] || 0 } J={J_list[element.content] || 0}/>
                        </Grid>)
                    )}
                </Grid>
            </Container>
            // : null
        ) 
    }
}

export default Header;
