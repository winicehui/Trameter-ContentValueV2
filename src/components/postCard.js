import React, { Component } from 'react';

import { Grid, TextField, Paper, Chip, Button, Fade } from '@material-ui/core';
import { withStyles } from "@material-ui/core/styles";
import EditIcon from '@material-ui/icons/Edit';
import DeleteIcon from '@material-ui/icons/Delete';

import socialList from '../static/social_list'
import contentList from '../static/content_list'
import styles from '../static/PostCardStyles'

import firebase from '../firebase'

class postCard extends Component {
    constructor(props) {
        super(props)
        this.state = {
            id: null,
            text: '',
            charCount: 0,

            social: [],
            content: [],

            posting_date: null,

            isLoaded: false, 
            
            showNoMessage: false,
            showNoSocial: false,
            showNoContent: false,

            edit: false,

            chosenIndex: 0, 
            editIndex: 0
        }
        this.handleTextChange = this.handleTextChange.bind(this);
        this.toggleEdit = this.toggleEdit.bind(this);
        this.editPost = this.editPost.bind(this);
        this.choosePost = this.choosePost.bind(this);
        this.deletePost = this.deletePost.bind(this);
        this.toggleSocial = this.toggleSocial.bind(this);
    }

    componentDidMount(){
        const { id, text, socials, contents, posting_date } = this.props.entry;
        const { chosenIndex, editIndex } = this.props
        this.setState({
            id: id, 
            text: text, 
            charCount: text.length,
            social: socials,
            content: contents,
            posting_date: posting_date,
            isLoaded: true, 
            edit: false, 
            chosenIndex: chosenIndex,
            editIndex: editIndex
        })
    }

    handleTextChange = (e) => {
        const text = e.target.value
        this.setState({ text: text, charCount: text.length })
    }

    toggleEdit = (e) => {
        e.stopPropagation()
        const { edit, id, editIndex} = this.state
        const newEdit = !edit
        if(editIndex === 0){
            this.setState({ edit: newEdit })
            this.props.handleToggleEditIndex(id)
        }        
    }

    editPost() {
        const { charCount, text, id, social, content } = this.state
        if (charCount === 0 || social.length === 0 || content.length === 0) {
            this.setState({ showNoMessage: charCount===0, showNoSocial: social.length === 0, showNoContent: content.length === 0 })
        } else {
            firebase.database().ref('posts/'+ id).update({
                text: text, 
                posting_date:firebase.database.ServerValue.TIMESTAMP,
                socials: social
            })

            this.setState({
                edit: false, 
                showNoMessage: false,
                showNoSocial: false,
                showNoContent: false
            })
        }
    }

    deletePost = (e) => {
        e.stopPropagation()
        const { id } = this.state
        firebase.database().ref('posts/' + id).remove()
        const contentsRef = firebase.database().ref('/content');
        contentsRef.once('value', (snapshot) => {
            let categories = snapshot.val();
            for (let category in categories) {
                for (let id_index in categories[category]['C']) {
                    if (id_index === id){
                        firebase.database().ref('content/' + category + '/C/' + id).remove()
                    }
                }
                for (let id_index in categories[category]['J']) {
                    if (id_index === id) {
                        firebase.database().ref('content/' + category + '/J/' + id).remove()
                    }
                }
            }
        })
        this.props.handleToggleEditIndex(0)
    }

    choosePost(){
        const { id } = this.state    
        this.props.handleToggleIndex(id)    
    }

    toggleSocial = (e, social) => {
        e.stopPropagation()
        const curr_socials = this.state.social
        const index = curr_socials.indexOf(social)
        if (index >= 0) {
            curr_socials.splice(index, 1)
        } else {
            curr_socials.push(social)
        }
        this.setState({ social: curr_socials })
    }

    static getDerivedStateFromProps(nextProps, prevState) {
        return (nextProps.chosenIndex !== prevState.chosenIndex || nextProps.editIndex !== prevState.editIndex)
            ? {chosenIndex: nextProps.chosenIndex, editIndex: nextProps.editIndex}
            : null
    }

    render() {
        const { text, social, content, posting_date, charCount, edit, id, chosenIndex, showNoMessage, showNoContent, showNoSocial } = this.state
        // choosePost is true when the chosenIndex is equal to the postCard's id
        const choosePost = (chosenIndex === id)
        const { classes } = this.props;

        return (
            this.state.isLoaded ?
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
                        <Paper  elevation={2} 
                                className="Add-Paper" 
                                onClick={this.choosePost} 
                                style={{ 
                                    cursor: !edit ? 'pointer' : 'auto', 
                                    backgroundColor: choosePost ? '#F2F3F4' : 'white' }}>
                            <div style={{ padding: '10px' }}>
                                <Grid container>
                                    <Grid item xs = {11}>
                                        <TextField 
                                            fullWidth 
                                            multiline 
                                            rows={3} 
                                            rowsMax={6}
                                            value={text}
                                            InputProps={{ 
                                                disableUnderline: true, 
                                                classes: { disabled: !edit ? classes.canChoose_disabled : classes.cantChoose_disabled }
                                            }}
                                            onChange={this.handleTextChange}
                                            disabled = {!edit}
                                            inputProps = {{ maxLength: 140}}
                                            autoFocus
                                        />
                                    </Grid>
                                    <Grid item xs={1}>
                                            {edit 
                                                ? <DeleteIcon className={classes.iconButton} onClick = {this.deletePost} /> 
                                                : <EditIcon className={classes.iconButton}  onClick={this.toggleEdit} />}
                                    </Grid>
                                </Grid>
                                
                                {showNoMessage ? <p className="Shorten-Message"> You must provide text to save. </p> : null}
                                {showNoContent ? <p className="Shorten-Message"> You must choose at least 1 content to save. </p> : null}
                                {showNoSocial ? <p className="Shorten-Message"> You must choose at least 1 social to save. </p> : null}
                                <div className = "Display-Message">
                                    <p className = "Word-Count"> Last Updated: {posting_date} </p>
                                    <p className="Word-Count" style={{ color: showNoMessage ? 'red' : 'black' }}>{charCount} /140 </p>
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
                                                    cursor: 'pointer'
                                                }}
                                                onClick = {edit ? (e) => {this.toggleSocial(e, element)} : null} 
                                                key={i} />
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
            : null 
        );
    }
}

export default withStyles(styles)(postCard);