import React, { Component } from 'react';
import { Paper, Grid, Divider } from '@material-ui/core';
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
        this.onClick = this.onClick.bind(this);
    }

    componentDidMount() {
        const { content, C, J, pathname } = this.props
        this.setState({
            content: content.content,
            color: content.color,
            C: C,
            J: J,
            isLoaded: true,
            pathname: pathname
        })
    }
    
    onClick (){
        const { content } = this.state 
        const pathname = (content === "All") ? "" : content
        this.props.history.push({
            pathname: '/' + pathname
        })
    }

    static getDerivedStateFromProps(nextProps, prevState) {
        return (nextProps.pathname!== prevState.pathname || nextProps.C !== prevState.C || nextProps.J !== prevState.J)
            ? { pathname: nextProps.pathname, C: nextProps.C, J: nextProps.J }
            : null
    }

    render() {
        const { content, C, J, color, isLoaded, pathname } = this.state
        return (
            isLoaded ? 
            <div> 
                <Paper elevation = {1} square className = "ContentCard-Border" style = {{cursor: 'pointer'}} onClick = {this.onClick}>
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
                {pathname === content || (pathname.length === 0 && content === "All") 
                    ? <Divider style={{ backgroundColor: '#707070', height: '8px', marginTop: '15px' }} /> 
                    : null }
            </div> 
            : null
        );
    }
}

export default withRouter(contentCard);;
