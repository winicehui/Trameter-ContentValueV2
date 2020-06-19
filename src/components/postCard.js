import React, { Component } from 'react';
// import axios from 'axios';

import { Grid, TextField, Paper, Chip, Button, Fade } from '@material-ui/core';
import { withStyles } from "@material-ui/core/styles";
import EditIcon from '@material-ui/icons/Edit';

import socialList from '../static/social_list'
import contentList from '../static/content'

import firebase from '../firebase'

const styles = {
    button: {
        border: '1px solid #707070',
        color: '#353B51',
        height: '40px',
        '&:active': {
            border: '2px solid #707070',
            backgroundColor: '#F2F3F4'
        },
        '&:hover': {
            border: '1.5px solid #707070',
            backgroundColor: '#F2F3F4'
        },
    },
    iconButton:{
        cursor: 'pointer',
        margin: '0px',
        float: 'right', 
        padding: '0px',
        color: '#707070',
        '&:active': {
            color: '#353B51'
        },
        '&:hover': {
            color: '#353B51'
        },
    }, 
    canChoose_disabled: {
        cursor: 'pointer',
        "&:disabled": {
            color: "#707070"
        }
    },
    cantChoose_disabled: {
        cursor: 'auto',
        "&:disabled": {
            color: "#707070"
        }
    }
}

class postCard extends Component {
    constructor(props) {
        super(props)
        this.state = {
            charCount: 0,
            text: '',

            social: [],
            content: [],

            posting_date: null,
            id: null,

            isLoaded:false, 
            
            showShortenMessage: false,
            showNoMessage: false,

            edit: false,
            chosenIndex: 0
        }
        this.handleTextChange = this.handleTextChange.bind(this);
        this.toggleEdit = this.toggleEdit.bind(this);
        this.editPost = this.editPost.bind(this);
        this.choosePost = this.choosePost.bind(this);
    }

    componentDidMount(){
        const { id, text, socials, contents, posting_date } = this.props.entry;
        const { chosenIndex } = this.props.chosenIndex
        this.setState({
            charCount: text.length,
            text: text,
            social: socials,
            content: contents,
            posting_date: posting_date,
            id: id,
            isLoaded: true, 
            edit: false, 
            chosenIndex: chosenIndex

        })
    }

    handleTextChange = (e) => {
        const text = e.target.value
        this.setState({ text: text, charCount: text.length })
    }

    toggleEdit = () => {
        const { edit, id } = this.state
        const newEdit = !edit
        this.setState({ edit: newEdit, text: 'try' })

        this.props.handleToggleIndex(id)
        this.props.editInProgress(true)

    }

    editPost() {
        const { charCount } = this.state
        if (charCount === 0) {
            this.setState({ showNoMessage: true, showShortenMessage: false })
        } else if (charCount > 140) {
            this.setState({ showShortenMessage: true, showNoMessage: false })
        } else {
            const { id, text } = this.state
            firebase.database().ref('posts/'+ id).update({
                text: text, 
                posting_date:firebase.database.ServerValue.TIMESTAMP,
            })
            this.props.editInProgress(false)
            this.props.handleToggleIndex(id)
        //     axios({
        //         method: 'PUT',
        //         url: `/api/posts/editPost`,
        //         data: {
        //             id: id,
        //             text: text
        //         }
        //     })
        //         .then((response) => {
                    this.setState({
                        edit: false, 
                        showNoMessage: false,
                        showShortenMessage: false
                    })
        //         })
        //         .catch(err =>
        //             console.log(err)
        //         );
        }
    }

    choosePost(){
        const { edit, id, chosenIndex } = this.state
        this.props.handleToggleIndex(id)
        // if(!edit) {
        //     this.setState({ chosenIndex: id })
        // }

        // console.log(edit)
        // // clicking itself again 
        // if (edit === false){
            if (id === chosenIndex) {
                this.props.handleToggleIndex(0)
                // this.setState({ chosenIndex: 0})
            }
            // clicking another post
            else{
                this.props.handleToggleIndex(id)
                // this.setState({ chosenIndex: id })
            }
        // }   
    }

    static getDerivedStateFromProps(nextProps, prevState) {
        return (nextProps.chosenIndex !== prevState.chosenIndex)
            ? {chosenIndex: nextProps.chosenIndex}
            : null
    }


    render() {
        const { text, social, content, posting_date, charCount, edit, id, chosenIndex } = this.state
        const choosePost = (chosenIndex === id)
        const { classes } = this.props;

        if (this.state.isLoaded) return (
            <React.Fragment>
            <Fade in = {this.state.isLoaded}> 
            
            <Grid
                container
                alignItems='center'
                justify='center'
                style={{ marginTop: '30px', marginBottom: '30px' }}
                spacing = {1}
            >
                <Grid item xs={12} sm={12} md={12} lg={11} >
                            <p> {id}</p>
                            <Paper elevation={0} className="Add-Paper" onClick={this.choosePost} style={{ cursor: !edit ? 'pointer' : 'auto', backgroundColor: choosePost ? '#F2F3F4' : 'white' }}>
                        <div style={{ padding: '10px' }}>
                            <Grid container>
                                <Grid item xs = {11}>
                                    <TextField 
                                        fullWidth 
                                        multiline 
                                        rows={3} 
                                        rowsMax={6}
                                        value={text}
                                        InputProps={{ disableUnderline: true, classes: { disabled: !edit ? classes.canChoose_disabled : classes.cantChoose_disabled } }}
                                        onChange={this.handleTextChange}
                                        disabled = {!edit}
                                    />
                                </Grid>
                                <Grid item xs={1}>
                                        {!edit ? 
                                            <EditIcon className={classes.iconButton}  onClick={this.toggleEdit} />
                                            : null}
                                </Grid>
                            </Grid>
                            
                                {this.state.showShortenMessage ? <p className="Shorten-Message"> Please shorten post to save. </p> : null}
                                {this.state.showNoMessage ? <p className="Shorten-Message"> You must provide text to save. </p> : null}
                            <div className = "Display-Message">
                                <p className = "Word-Count"> Last Updated: {posting_date.substring(0,10)} </p>
                                <p className="Word-Count" style={{ color: charCount > 140 ? 'red' : 'black' }}>{charCount} /140 </p>
                            </div>
                        </div>

                        <Grid
                            container
                            alignItems='center'
                            justify='center'
                            className="Add-LeftShadedColumn"
                        >
                            <Grid item xs={12} sm={3} md={3} lg={2} >
                                <p className="ContentCard-Text"> Social </p>
                            </Grid>
                                    <Grid item xs={12} sm={9} md={9} lg={10} className="Add-RightColumn" style={{ backgroundColor: choosePost ? '#F2F3F4' : 'white' }}>
                                {socialList.map((element, i) =>
                                    (
                                        <Chip 
                                            variant="outlined" 
                                            size="small" 
                                            label={element}
                                            style={{
                                                margin: '2.5px',
                                                backgroundColor: social.includes(element) ? '#353B51' : '#FFFFFF',
                                                color: social.includes(element) ? '#FFFFFF' : '#707070',
                                                cursor: !edit ? 'pointer' : 'auto'
                                            }} key={i} />
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
                                    <Grid item xs={12} sm={9} md={9} lg={10} className="Add-RightColumn" style={{ borderRadius: '0 0 3px 0', backgroundColor: choosePost ? '#F2F3F4' : 'white' }}>
                                {contentList.map((element, i) =>
                                    (
                                        element.content !== "All" ?
                                            <Button 
                                                variant="outlined" 
                                                size="small"
                                                disabled={true}
                                                style={{
                                                    width: '85px',
                                                    margin: '5px', 
                                                    textTransform: 'none', 
                                                    fontFamily: 'Helvetica',
                                                    backgroundColor: content.includes(element.content) ? element.color : '#FFFFFF',
                                                    color: content.includes(element.content) ? '#FFFFFF' : '#707070'
                                                }} 
                                                key={i}>
                                                {element.content}
                                            </Button>
                                            : null
                                    )
                                )}
                            </Grid>
                        </Grid>
                    </Paper>
                </Grid>

                <Grid item xs={12} sm={12} md={5} lg={1} >
                    {edit 
                    ? <Button variant="outlined" fullWidth className={classes.button} onClick={this.editPost}> Save </Button>
                    : null}
                </Grid>
            </Grid>
            </Fade>
            </React.Fragment>
        );
        else return null
    }
}

export default withStyles(styles)(postCard);