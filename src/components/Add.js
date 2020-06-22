import React, { Component } from 'react';
import axios from "axios";
import { Grid, TextField, Paper, Chip, Button } from '@material-ui/core';
import { withStyles } from "@material-ui/core/styles";

import socialList from '../static/social_list'
import contentList from '../static/content'

import firebase from '../firebase'

const styles = {
    button: {
        border: '1px solid #707070',
        color: '#353B51',
        '&:active': {
            border: '2px solid #707070',
            backgroundColor: '#F2F3F4'
        },
        '&:hover': {
            border: '1.5px solid #707070',
            backgroundColor: '#F2F3F4'
        },
    }
}

class Add extends Component {
    constructor(props) {
        super(props)
        this.state = {
            charCount: 0,
            text: '', 

            social: [],
            content: [],
            // showShortenMessage: false, 
            showNoMessage: false
        }
        this.handleTextChange = this.handleTextChange.bind(this);
        this.toggleSocial = this.toggleSocial.bind(this);
        this.toggleContent = this.toggleContent.bind(this);
        this.addPost = this.addPost.bind(this);
    }

    handleTextChange = (e) => {
        const text = e.target.value
        this.setState({ text: text, charCount: text.length })
    }

    toggleSocial = (social) => {
        const curr_socials = this.state.social
        const index = curr_socials.indexOf(social)
        if (index >= 0) {
            curr_socials.splice(index, 1)
        } else {
            curr_socials.push(social)
        }
        this.setState({social: curr_socials})
    }

    toggleContent = (content) => {
        const curr_contents = this.state.content
        const index = curr_contents.indexOf(content.content)
        if (index >= 0){
            curr_contents.splice(index, 1)
        } else{ 
            curr_contents.push(content.content)
        }
        this.setState({content: curr_contents})
    }

    addPost() {
        const { charCount } = this.state
        if ( charCount === 0){
            this.setState({ showNoMessage: true })
            // this.setState({ showNoMessage: true, showShortenMessage: false })
        // } else if ( charCount > 140) {
        //     this.setState({ showShortenMessage: true, showNoMessage: false})
        } else {
            const { text, social, content } = this.state
            const postsRef = firebase.database().ref('posts')
            const post = {
                text: text, 
                posting_date: firebase.database.ServerValue.TIMESTAMP,
                socials: social, 
                contents: content
            }
            var newPostKey = postsRef.push(post).key;
            
            const post_social = {}
            const post_content = {}

            socialList.forEach(element => {
                post_social[element] = social.includes(element)
            })

            contentList.forEach(element => {
                if(element.content !== "All")
                    post_content[element.content] = content.includes(element.content)
            })

            firebase.database().ref('social/' + newPostKey).set(post_social)
            firebase.database().ref('content_2/' + newPostKey).set(post_content)

            content.forEach(element => {
                firebase.database().ref('content/' + element + '/C/' + newPostKey).set(true)
            })
                
            
            // axios({
            //     method: 'POST',
            //     url: `/api/posts/writePost`,
            //     data:{
            //         text: text,
            //         socials: social,
            //         contents: content
            //     }
            // })
            // .then(
            //     this.props.addNewEntry(true)
            // )
            // .then((response) => {
                this.setState({
                    charCount: 0,
                    text: '',

                    social: [],
                    content: [],
                    // showShortenMessage: false,
                    showNoMessage: false
                })
            // })
            // .catch(err =>
            //         console.log(err)
            //     );  
        } 
    }

    render() {
        const { classes } = this.props;
        return (
            <Grid
                container
                alignItems='center'
                justify='center'
                style={{ marginBottom: '20px'}}
            >
                <Grid item xs={12} sm={12} md={10} lg={11} >
                    <Paper elevation={0} className= "Add-Paper">
                        <div style = {{padding: '10px'}}> 
                            <TextField fullWidth multiline rows={3} rowsMax={6} 
                                placeholder = "Content Title or Description" 
                                value = {this.state.text}
                                InputProps={{ disableUnderline: true }}
                                onChange = {this.handleTextChange}
                                inputProps={{ maxLength: 140 }}
                            />
                            <div> 
                                {/* {this.state.showShortenMessage ? <p className = "Shorten-Message"> Please shorten post to save. </p> : null } */}
                                {this.state.showNoMessage ? <p className="Shorten-Message"> You must provide text to save. </p> : null}
                                <p className = "Word-Count" style = {{color: (this.state.charCount >140 || this.state.showNoMessage) ? 'red' : 'black'}}>{this.state.charCount} /140 </p>
                            </div>
                        </div>

                        <Grid
                            container
                            alignItems='center'
                            justify='center'
                            className= "Add-LeftShadedColumn"
                        >
                            <Grid item xs={12} sm = {3} md = {3} lg = {2} >
                                <p className="ContentCard-Text"> Social </p>
                            </Grid>
                            <Grid item xs={12} sm={9} md={9} lg={10} className= "Add-RightColumn">
                                {socialList.map((element, i) =>
                                    (
                                        <Chip 
                                            variant="outlined" 
                                            size="small" 
                                            label={element} 
                                            onClick={() => this.toggleSocial(element)}
                                            style={{ 
                                                margin: '5px' ,
                                                backgroundColor: this.state.social.includes(element) ? '#353B51' : '#FFFFFF', 
                                                color: this.state.social.includes(element) ? '#FFFFFF' : '#707070'
                                            }}
                                            clickable 
                                            key = {i}/>
                                    )
                                )}
                            </Grid>
                        </Grid>

                        <Grid
                            container
                            alignItems='center'
                            justify='center'
                            className="Add-LeftShadedColumn"
                            style={{ borderRadius: '0 0 3px 3px ' }}
                        >
                            <Grid item xs={12} sm={3} md={3} lg={2} >
                                <p className="ContentCard-Text"> Content </p>
                            </Grid>
                            <Grid item xs={12} sm={9} md={9} lg={10} className="Add-RightColumn" style={{ borderRadius: '0 0 3px 0' }}>
                                {contentList.map((element, i) =>
                                    (   
                                        element.content !== "All" ?
                                        <Button 
                                            variant="outlined" 
                                            size="small" 
                                            style={{ 
                                                width: '85px', 
                                                margin: '5px', 
                                                textTransform: 'none', 
                                                fontFamily: 'Helvetica', 
                                                backgroundColor: this.state.content.includes(element.content) ? element.color : '#FFFFFF', 
                                                color: this.state.content.includes(element.content) ? '#FFFFFF' : '#707070' }} 
                                                key={i}
                                                onClick  = {() => this.toggleContent(element)}
                                        >
                                            {element.content}
                                        </Button>
                                        : null
                                    )
                                )}
                            </Grid>
                        </Grid>
                    </Paper>
                </Grid>

                <Grid item xs={2} sm={2} md={1} lg={1} style={{ margin: '10px 0 10px 0' }}>
                    <Button variant = "outlined" fullWidth className = {classes.button} onClick={this.addPost}> Save </Button>
                </Grid>
            </Grid>
        );
    }
}

export default withStyles(styles)(Add);