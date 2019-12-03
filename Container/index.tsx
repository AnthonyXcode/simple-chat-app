import React, { Component } from 'react';
import { Alert, StyleSheet, Text, View, TextInput, Button } from 'react-native';
import * as firebase from 'firebase'
import Chat from './chat'

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  paper: {
    backgroundColor: '#eeeeee',
    width: '280px',
    height: '150px'
  },
  rowContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    padding: '8px'
  },
  textInput: {
    backgroundColor: '#ffffff',
    flex: 1,
    height: '32px'
  }
});

const firebaseConfig = {
  apiKey: "AIzaSyCiEya5cPfSTBrvYjC7g3MzKQEXASWpSpg",
  authDomain: "simple-chat-app-7eb60.firebaseapp.com",
  databaseURL: "https://simple-chat-app-7eb60.firebaseio.com",
  projectId: "simple-chat-app-7eb60",
  storageBucket: "simple-chat-app-7eb60.appspot.com",
  messagingSenderId: "1047190397359",
  appId: "1:1047190397359:web:11e4be7b18b3dbeb5dcf5a",
  measurementId: "G-RGHR8ZDMMX"
}
firebase.initializeApp(firebaseConfig)

interface State {
  email?: string,
  password?: string,
  loginError?: string,
  isLoggedIn: boolean
}

class index extends Component {
  state: State = {
    email: null,
    password: null,
    loginError: null,
    isLoggedIn: false
  }

  onEmailChange = (text) => {
    this.setState({
      email: text
    })
  }

  onPasswordChange = (text) => {
    this.setState({
      password: text
    })
  }

  onOkPress = () => {
    const {email, password} = this.state
    firebase.auth().signInWithEmailAndPassword(email, password).then(result => {
      this.setState({
        loginError: null,
        isLoggedIn: true
      })
    }).catch(error => {
      this.setState({
        loginError: error.message
      })
    })
  }

  renderLogin = () => {
    return (
      <View style={styles.container}>
        <View style={styles.paper}>
          <View style={styles.rowContainer}>
            <Text style={{marginRight: '8px'}}>E-mail:</Text>
            <TextInput style={styles.textInput} onChangeText={this.onEmailChange}/>
          </View>
          <View style={styles.rowContainer}>
            <Text style={{marginRight: '8px'}}>Password:</Text>
            <TextInput style={styles.textInput} onChangeText={this.onPasswordChange}/>
          </View>
          <Button title={'OK'} onPress={this.onOkPress}/>
        </View>
        <Text style={{margin: '8px', fontSize: 18, color: 'red'}}>{this.state.loginError}</Text>
      </View>
    );
  }

  render() {
    if (this.state.isLoggedIn) {
      return (
        <View style={{position: 'absolute', left: 0, right: 0, bottom: 0, top: 0}}>
          <Chat/>
        </View>
    )
    } else {
      return this.renderLogin()
    }
  }
}

export default index
