import React, { Component } from 'react';
import { withRouter } from 'react-router-dom'

import { Grid, Button, TextField, Container } from '@material-ui/core';
import InputAdornment from '@material-ui/core/InputAdornment'
import SearchIcon from '@material-ui/icons/Search';
import { withStyles } from "@material-ui/core/styles";

import Add from './Add'
import PostCard from './postCard'

import styles from '../static/FormStyles'

import firebase from '../firebase'

class Left extends Component {
    constructor(props) {
        super(props)
        this.state = {
            isOpen: false, 
            data: [], 
            dataLoaded: false, 

            chosenIndex: 0, 
            editIndex: 0, 
            pathname: '/', 

            search: '',
            searched_data: []
        }
        this.handleOpen = this.handleOpen.bind(this);
        this.handleSearch = this.handleSearch.bind(this);
    }

    handleOpen = (e, titleProps) => {
        const { isOpen } = this.state
        const newActive = !isOpen
        this.setState({ isOpen: newActive })
    }

    // Called when the Edit, Delete or Save Button is clicked
    // Toggles state varaibles : 0 when not editing, numeric when editing (with id of postCard being editted)
    handleToggleEditIndex = (index) => {
        console.log("handleToggleEditIndex")
        console.log(index)
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
            console.log(index)
            this.setState({ editIndex: 0, chosenIndex: index })
            this.props.handleToggleIndex(index)
        }
    }

    // Called when a postCard is selected 
    // Will only toggle to another postCardwhen another one is not being editted currently
    handleToggleIndex = (index) => {
        console.log("handleToggleIndex")
        console.log(index)
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
        const { editIndex } = this.state
        if (editIndex === 0){
            const postsRef = firebase.database().ref('/posts').orderByChild('posting_date');
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
                    var add = (pathname === '/') ? true : (posts[post].contents).includes(pathname.substring(1))
                    if (add) {
                        newPosts.push({
                            id: post,
                            text: posts[post].text,
                            posting_date: time,
                            socials: posts[post].socials || [],
                            contents: posts[post].contents || []
                        })
                    }
                }
                this.setState({
                    data: newPosts.reverse(),
                    dataLoaded: true, 
                    pathname: pathname,
                    chosenIndex: 0,
                    editIndex: 0, 
                    search: '', 
                    searched_data: newPosts.reverse()
                })
                this.props.handleToggleIndex(0)
            })
        }
        // } else {
        //     console.log(pathname)
        //     const contentIDsRef = firebase.database().ref('content' + pathname + '/C');
        //     // let newPosts = [];
        //     // contentIDsRef.on('child_added', (snapshot) => {
        // snapshot.forEach((post_id) => {
        //     console.log(post_id)
        // })
        //     //     var postID = snapshot.key
        //     //     console.log(postID)
        //     //     firebase.database().ref('posts').child(postID).once('value', (postSnapShot) => {
        //     //         var post = postSnapShot.val()
        //     //         console.log(post)
        //     //         var time = new Date(post.posting_date).toDateString() 
        //     //         newPosts.push({
        //     //             id: postID, 
        //     //             text: post.text, 
        //     //             posting_date: time,
        //     //             socials: post.socials || [],
        //     //             contents: post.contents || []
        //     //         })
        //     //     });
        //     // })
        //     contentIDsRef.on('value', (snapshot) => {
        //         let newPosts = []
        //         let postIDs = snapshot.val()
        //         for (let postID in postIDs) {
        //             console.log(postID)
        //             firebase.database().ref('posts').child(postID).once('value', (postSnapShot) => {
        //                 var post = postSnapShot.val()
        //                 console.log(post)
        //                 var time = new Date(post.posting_date).toDateString() 
        //                 newPosts.push({
        //                     id: postID, 
        //                     text: post.text, 
        //                     posting_date: time,
        //                     socials: post.socials || [],
        //                     contents: post.contents || []
        //                 })
        //             });
        //         }
        //         console.log(newPosts)
        //         // this.setState({
        //         //     data: newPosts.reverse(),
        //         //     dataLoaded: true
        //         // })
        //         this.setState2(newPosts)
        //     })
        // }
    }

    componentDidMount() {
        this.update()
    }

    static getDerivedStateFromProps(nextProps, prevState) {
        return (nextProps.location.pathname!== prevState.pathname)
            ? { dataLoaded: false }
            : null
    }

    componentDidUpdate(nextProps) {
        if (this.state.dataLoaded === false) {
            this.update()
        }
    }

    handleSearch = (e) => {
        const search_text = e.target.value
        console.log(search_text)
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
                                onChange={this.handleSearch}
                                value={this.state.text}
                            />
                            </Grid>

                        <Grid item xs={12} sm={12} md={7} lg={1} />
                    </Grid>

                    { this.state.isOpen 
                        ? <Add />
                        : null}

                    { this.state.searched_data.map((element, i) => (
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