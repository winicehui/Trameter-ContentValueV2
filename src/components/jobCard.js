import React, { Component } from 'react';
import { Paper, Grid } from '@material-ui/core';
import RemoveIcon from '@material-ui/icons/Remove';
import AddIcon from '@material-ui/icons/Add';
import firebase from '../firebase'

class jobCard extends Component {  
    constructor(props) {
        super(props)
        this.state = {
            content: '',
            color: '',
            id: 0,
            J: 0, 
            isLoaded: false
        }
    }

    componentDidMount() {
        const { content, id, J } = this.props
        this.setState({
            content: content.content,
            id: id, 
            color: content.color,
            J: J,
            isLoaded: true
        })
        this.increment = this.increment.bind(this);
        this.decrement = this.decrement.bind(this);
    }

    increment(){
        const { content, id, J } = this.state
        firebase.database().ref('/content/'+ content + '/J/' + id).set(
            firebase.database.ServerValue.increment(1)
        );
        // firebase.database().ref('/content/' + content + '/J/' + id)
        //     .transaction(function (counts) {
        //         return (counts || 0) + 1
        //     })
        this.setState({ J: J+1 })
    }

    decrement() {
        const { content, id, J } = this.state
        firebase.database().ref('/content/' + content + '/J/' + id).set(
            firebase.database.ServerValue.increment(-1)
        );
        this.setState({ J: J-1 })
    }

    render() {
        const { content, color, J, isLoaded } = this.state
        return (
            isLoaded ? 
            <Paper elevation={1} square className="ContentCard-Border">
                <p className="ContentCard-Label" style={{ backgroundColor: color }}> {content} </p>
                <Grid
                    container
                    spacing={0}
                    alignItems='center'
                    justify='center'
                >
                    <Grid item xs={3} className="ContentCard-BorderSplit" style = {{ height: '27px' }}>
                        <RemoveIcon style = {{float: 'center', cursor: 'pointer'}} onClick = {this.decrement} />
                    </Grid>
                    <Grid item xs={6} className="ContentCard-BorderSplit" style={{ height: '27px', backgroundColor: '#353B51', color: '#FFFFFF', }}>
                        <p style={{ margin: '4px', textAlign: 'center', verticalAlign: 'center'}}>{J}</p>
                    </Grid>
                    <Grid item xs={3} style={{ height: '27px' }}>
                        <AddIcon style={{ float: 'center', cursor: 'pointer' }} onClick = {this.increment} />
                    </Grid>
                </Grid>
            </Paper>
            : null
        );
    }
}

export default jobCard;