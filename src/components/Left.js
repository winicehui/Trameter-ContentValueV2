import React, { Component } from 'react';
import { withRouter } from 'react-router-dom'

import { Grid, Button, TextField, Container } from '@material-ui/core';
import InputAdornment from '@material-ui/core/InputAdornment'
import SearchIcon from '@material-ui/icons/Search';
import { withStyles } from "@material-ui/core/styles";

import Add from './Add'
import PostCard from './postCard'

import styles from '../static/LeftStyles'

import firebase from '../firebase'

class Left extends Component {
    constructor(props) {
        super(props)
        this.state = {
            data: [], 

            isOpen: false, 

            chosenIndex: 0, 
            editIndex: 0, 

            pathname: '/', 

            search: '',
            searched_data: [], 
            searched_dataLoaded: false, 
        }
        this.handleOpen = this.handleOpen.bind(this);
        this.handleSearch = this.handleSearch.bind(this);
    }

    handleOpen = (e, titleProps) => {
        const { isOpen } = this.state
        this.setState({ isOpen: !isOpen })
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

    update(){
        const pathname = this.props.location.pathname
        const postsRef = firebase.database().ref('/posts');
        postsRef.on('value', (snapshot) => {
            let posts = snapshot.val();
            let newPosts = [];
            for (let post in posts) {
            //     // firebase.database().ref('social').child(post).on('value', (snapshot) => {
            //     //     let socials = snapshot.val();
            //     //     for (let social in socials) {
            //     //         if (socials[social] === true)
            //     //             socialList.push(social)
            //     //     }
            //     // })
            //     // firebase.database().ref('content').child(post).on('value', (snapshot) => {
            //     //     let contents = snapshot.val();
            //     //     for (let content in contents) {
            //     //         if (contents[content] === true)
            //     //             contentList.push(content)
            //     //     }
            //     // })
                var time = new Date(posts[post].posting_date).toDateString()
                var socials = posts[post].socials || []
                var contents = posts[post].contents || []
                var add = (pathname === '/') ? true : (contents).includes(pathname.substring(1))
                if (add) {
                    newPosts.push({
                        id: post,
                        text: posts[post].text,
                        posting_date: time,
                        socials: socials,
                        contents: contents
                    })
                }
                newPosts.reverse()
            }
            this.setState({
                data: newPosts,
                chosenIndex: 0,
                editIndex: 0, 
                pathname: pathname,
                search: '', 
                searched_data: newPosts, 
                searched_dataLoaded: true
            })
            this.props.handleToggleIndex(0)
        })
    }

    componentDidMount() {
        this.update()
    }

    static getDerivedStateFromProps(nextProps, prevState) {
        return (nextProps.location.pathname!== prevState.pathname)
            ? { searched_dataLoaded: false }
            : null
    }

    componentDidUpdate(nextProps) {
        if (this.state.searched_dataLoaded === false) {
            this.update()
        }
    }

    handleSearch = (e) => {
        const search_text = e.target.value
        const { data } = this.state
        let filtered_results = [] 
        data.forEach( element => {
            const element_text = element.text.toLowerCase()
            if(element_text.indexOf(search_text) !== -1)
                filtered_results.push(element)
        })
        this.setState({ search: search_text, searched_data: filtered_results })
    }

    render() {
        const { classes } = this.props;
        const { text, searched_dataLoaded, searched_data, isOpen, chosenIndex, editIndex } = this.state
        return (    
            searched_dataLoaded ?
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
                                onChange={this.handleSearch}
                                value={text}
                            />
                            </Grid>

                        <Grid item xs={12} sm={12} md={7} lg={1} />
                    </Grid>

                    { isOpen 
                        ? <Add />
                        : null}

                    { searched_data.map((element, i) => (
                        <PostCard 
                            key={element.id} 
                            entry={element} 
                            chosenIndex={chosenIndex} 
                            editIndex={editIndex}
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