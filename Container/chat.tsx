import React, { Component } from 'react'
import { Text, View, FlatList, Button, TextInput, TouchableOpacity, StyleSheet } from 'react-native'
import * as firebase from 'firebase'
import { pathOr, append, sort } from 'ramda'

const styles = StyleSheet.create({
  messageContainer: {
    position: 'absolute', left: 0, right: 0, bottom: 0, height: '64px', borderTopColor: 'grey', borderTopWidth: 1, flexDirection: 'row', alignItems: 'center'
  },
  input: {
    flex: 1, marginLeft: 8, marginRight: 8
  },
  message: {
    borderWidth: 1, borderColor: 'grey', borderRadius: 8, padding: 8, width: '80px', textAlign: 'center'
  }
})

interface Message {
  user: string,
  time: Number,
  message: string
}
interface State {
  message?: string,
  allmessages?: [Message]
}

class chat extends Component {
  state: State
  messageRef = firebase.database().ref('message')

  componentDidMount() {
    this.messageRef.on('value', snapshot => {
      const values = snapshot.val()

      let initMessages: Message[]
      initMessages = []
      const messages: [Message] = Object.keys(values).reduce((acc, current, index, arr) => {
        const value = values[current]
        const message = value['message']
        const user = value['user']
        const time = value['time']
        if (message && user && time) {
          return append({ message, time, user }, acc)
        }
        return acc
      }, initMessages)
      this.setState({
        allmessages: sort((lhs, rhs) => lhs.time > rhs.time, messages)
      })
    })
  }

  onTextChange = (text) => {
    this.setState({
      message: text
    })
  }

  onSendPress = () => {
    const { message } = this.state
    if (message) {
      this.messageRef.push().set({
        message,
        time: new Date().getTime(),
        user: firebase.auth().currentUser.email
      })
    }
  }

  renderItem = ({ item }: { item: Message }) => {
    const myEmail = firebase.auth().currentUser.email
    const isMyMessage = myEmail === item.user
    return (
      <View style={{ flexDirection: isMyMessage ? 'row-reverse' : 'row' }}>
        <View style={{ margin: 8, padding: 8, borderWidth: 1, borderColor: 'grey', borderRadius: 8 }}>
          <Text>{item.user}:</Text>
          <Text>{item.message}</Text>
          <Text>time:{item.time}</Text>
        </View>
      </View>
    )
  }

  render() {
    const messages: [Message] = pathOr([], ['allmessages'], this.state)
    return (
      <View style={{ flex: 1 }}>
        <FlatList
          style={{ flex: 1, marginBottom: '64px' }}
          data={messages}
          renderItem={this.renderItem}
          scrollEnabled
        />
        <View style={styles.messageContainer}>
          <TextInput style={styles.input} placeholder={'Type message here!'} onChangeText={this.onTextChange} />
          <TouchableOpacity style={{ marginRight: 8 }} onPress={this.onSendPress}>
            <Text style={styles.message}>Send</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }
}

export default chat