import React, { Component } from 'react';
import { Paper, Grid } from '@material-ui/core';
import { withRouter } from "react-router";

class contentCard extends Component {
    constructor(props) {
        super(props)
        this.state = {
            content: '',
            color: '',
            C: 0,
            J: 0,
            isLoaded: false, 
            pathname: ''
        }
    }

    componentDidMount() {
        const { content, J, C, pathname } = this.props
        console.log(this.props)
        this.setState({
            content: content.content,
            color: content.color,
            C: C,
            J: J,
            isLoaded: true,
            pathname: pathname
        })
        this.onClick = this.onClick.bind(this);
    }
    
    onClick (){
        const { content } = this.state 
        this.props.history.push({
            pathname: '/' + content
        })
    }

    static getDerivedStateFromProps(nextProps, prevState) {
        return (nextProps.pathname!== prevState.pathname)
            ? { pathname: nextProps.pathname }
            : null
    }

    render() {
        const { content, C, J, color, isLoaded, pathname } = this.state
        return (
            isLoaded ? 
            <div> 
            <Paper elevation = {1} square className = "ContentCard-Border"  style = {{cursor: 'pointer'}}>
                <p className="ContentCard-Label" style={{ backgroundColor: color }}> {content} </p>
                <Grid
                    container
                    spacing={0}
                    >
                    <Grid item xs={6} className = "ContentCard-BorderSplit">
                        <p className = "ContentCard-C-Label">C</p>
                        <p className = "ContentCard-Text">{C}</p>
                    </Grid>
                    <Grid item xs={6}>
                        <p className = "ContentCard-J-Label">J</p>
                        <p className = "ContentCard-Text">{J}</p>
                    </Grid>
                </Grid>
            </Paper>
            {pathname === content ? <p> PAth selected</p> : null }
            </div> 
            : null
        );
    }
}

export default withRouter(contentCard);;
