import React, { Component } from 'react';
import { Divider, Button } from '@material-ui/core';

import Header from './components/Header'
import Body from './components/Body'

import './App.css'

import firebase from "./firebase"
import StyledFirebaseAuth from "react-firebaseui/StyledFirebaseAuth"

class App extends Component {
  constructor(props) {
    super(props)
    this.state = {
      isSignedIn: false,
      isLoaded: false
    }
  }

  componentDidMount() {
    firebase.auth().onAuthStateChanged(user => {
      this.setState({
        isSignedIn: !!user,
        isLoaded: true
      })
    })
  }

  render() {
    let uiConfig = {
      signInFlow: "popup",
      signInOptions: [
        firebase.auth.GoogleAuthProvider.PROVIDER_ID
      ],
      callbacks: {
        signInSuccess: () => false
      }
    }
    const { isLoaded } = this.state
    return (
      isLoaded
      ? <div >
        { this.state.isSignedIn
        ? <React.Fragment> 
              <Button
                variant="contained"
                size="small"
                style={{ backgroundColor: '#F2F3F4', textTransform: 'none', color: '#353B51', float: 'left', margin: '0px 30px' }}
                onClick={() => firebase.auth().signOut()}
              > 
                Sign Out 
              </Button>
          <Header />
          <Divider style={{ backgroundColor: '#707070', height: '3px', marginTop: '20px' }} />
          <Body />
            </React.Fragment>
        : <StyledFirebaseAuth
          uiConfig={uiConfig}
          firebaseAuth={firebase.auth()} 
          />
        }
      </div>
      : null 
    );
  }
}

export default App;