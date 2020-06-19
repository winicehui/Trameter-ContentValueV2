import React, { Component } from 'react';
import { Grid, Button, TextField, Container } from '@material-ui/core';

import Add from './Add'
import PostCard from './postCard'

import { withStyles } from "@material-ui/core/styles";
import styles from '../static/FormStyles'

import InputAdornment from '@material-ui/core/InputAdornment'
import SearchIcon from '@material-ui/icons/Search';

import firebase from '../firebase'

class Left extends Component {
    constructor(props) {
        super(props)
        this.state = {
            isOpen: false, 
            data: [], 
            dataLoaded: false, 

            chosenIndex: 0, 
            edit_inprogress: false
        }
        this.handleOpen = this.handleOpen.bind(this);
    }

    handleOpen = (e, titleProps) => {
        const { isOpen } = this.state
        const newActive = !isOpen
        this.setState({ isOpen: newActive })
    }

    editInProgress = (bool) => {
        console.log("EDIT I PROGRESS")
        this.setState({ edit_inprogress: bool})
    }

    handleToggleIndex = (index) => {
        console.log("TOGGLE INDEX")
        console.log(index)
        const { edit_inprogress } = this.state 
        if (!edit_inprogress)
            this.setState({chosenIndex: index})

        // // clicking itself again 
        // if (index === chosenIndex) {
        //     this.setState({ chosenIndex: 0 })
        // }
        // // clicking another post
        // else if (chosenIndex !== 0 ){
        //     this.setState({ chosenIndex: index })
        // }
    }

    componentDidMount() {
        const postsRef = firebase.database().ref('/posts').orderByChild('posting_date');
        postsRef.on('value', (snapshot) => {
            let posts = snapshot.val();
            let newPosts = [];
            for (let post in posts) {
                // firebase.database().ref('social').child(post).on('value', (snapshot) => {
                //     let socials = snapshot.val();
                //     for (let social in socials) {
                //         if (socials[social] === true)
                //             socialList.push(social)
                //     }
                // })
                // firebase.database().ref('content').child(post).on('value', (snapshot) => {
                //     let contents = snapshot.val();
                //     for (let content in contents) {
                //         if (contents[content] === true)
                //             contentList.push(content)
                //     }
                // })
                var time = new Date(posts[post].posting_date).toDateString()
                newPosts.push({
                    id: post,
                    text: posts[post].text, 
                    posting_date: time,
                    socials: posts[post].socials || [],
                    contents: posts[post].contents || []
                })
            }
            this.setState({
                data: newPosts.reverse(),
                dataLoaded: true
            })
        })
    }

    // update() {
    //     axios({
    //         method: 'GET',
    //         url: `/api/posts/all`,
    //     })
    //         .then(result => {
    //             this.setState({
    //                 data: result.data.data,
    //                 dataLoaded: true
    //             })
    //         })
    //         .catch(err =>
    //             console.log(err)
    //         );
    // }

    // addNewEntry= (bool) => {
    //     if (bool) this.update()
    // }

    render() {
        const { classes } = this.props;
        console.log(this.state.chosenIndex)
        return (    
            this.state.dataLoaded ?
                <Container>
                    <Grid
                        container
                        alignItems = 'center'
                        justify= 'center'
                        style = {{padding: '20px'}}
                        spacing = {4}
                    >
                        <Grid item xs={12} sm={12} md={5} lg={4} >
                            <Button 
                                variant="outlined" 
                                fullWidth 
                                className = {classes.button} 
                                onClick = {this.handleOpen}
                            > 
                                Add Content </Button>
                        </Grid>

                        <Grid item xs={12} sm={12} md={7} lg={7} >
                            <TextField 
                                variant="outlined" 
                                fullWidth 
                                size="small" 
                                type="search" 
                                placeholder="Search" 
                                className = {classes.root}
                                InputProps={{
                                    startAdornment: (
                                        <InputAdornment>
                                            <SearchIcon/>
                                        </InputAdornment>
                                    ),
                                }}
                                />
                            </Grid>
                        <Grid item xs={12} sm={12} md={7} lg={1} />
                    </Grid>

                    {this.state.isOpen 
                        // ? <Add addNewEntry = {this.addNewEntry} />
                        ? <Add />
                        : null
                    }

                    {this.state.data.map((element, i) => (
                        <PostCard entry={element} key={element.id} chosenIndex={this.state.chosenIndex} handleToggleIndex={this.handleToggleIndex} editInProgress={this.editInProgress} />                        
                    ))}

                </Container>
            : null
        );
    }
}

export default withStyles(styles)(Left);
