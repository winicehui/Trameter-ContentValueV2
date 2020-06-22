import React, { Component } from 'react';
import { Grid, Button, TextField, Container } from '@material-ui/core';
import { withRouter } from 'react-router-dom'

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
            editIndex: 0
        }
        this.handleOpen = this.handleOpen.bind(this);
    }

    handleOpen = (e, titleProps) => {
        const { isOpen } = this.state
        const newActive = !isOpen
        this.setState({ isOpen: newActive })
    }

    // Called when the Edit, Delete or Save Button is clicked
    // Toggles state varaibles : 0 when not editing, numeric when editing (with id of postCard being editted)
    handleToggleEditIndex = (index) => {
        const { editIndex } = this.state 
        // Case 1: Delete Button
        if (index === 0){
            this.setState({ editIndex: 0, chosenIndex: 0 })
            this.props.handleToggleIndex(0)
        }  // Case 2: Edit Button
        else if (editIndex === 0){
            this.setState({ editIndex: index, chosenIndex: index})
            this.props.handleToggleIndex(index)
        } // Case 3: Save Button 
        else if (editIndex === index){
            this.setState({ editIndex: 0, chosenIndex: index })
            this.props.handleToggleIndex(index)
        }
    }

    // Called when a postCard is selected 
    // Will only toggle to another postCardwhen another one is not being editted currently
    handleToggleIndex = (index) => {
        const { editIndex, chosenIndex } = this.state 
        if (editIndex === 0){
            if (index === chosenIndex) {
                this.setState({ chosenIndex: 0 })
                this.props.handleToggleIndex(0)
            } else{
                this.setState({ chosenIndex: index })
                this.props.handleToggleIndex(index)
            }
        }
    }

    componentDidMount() {
        console.log(this.props.location.pathname)

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
        const { classes, chosenIndex } = this.props;
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
                        <PostCard 
                            key={element.id} 
                            entry={element} 
                            chosenIndex={this.state.chosenIndex} 
                            editIndex={this.state.editIndex}
                            handleToggleIndex={this.handleToggleIndex} 
                            handleToggleEditIndex={this.handleToggleEditIndex} 
                        />                        
                    ))}
                </Container>
            : null
        );
    }
}

export default withRouter(withStyles(styles)(Left));
