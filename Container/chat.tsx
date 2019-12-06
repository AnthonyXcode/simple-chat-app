import React, { Component } from 'react'
import {
  Text,
  View,
  FlatList,
  TextInput,
  TouchableOpacity
} from 'react-native'
import * as firebase from 'firebase'
import { pathOr, append, sort } from 'ramda'
import styles from './styles'

interface Message {
  user: string
  time: Number
  message: string
}
interface State {
  message?: string
  allmessages?: [Message]
}

class chat extends Component {
  state: State
  messageRef = firebase.database().ref('message')
  flatlist: FlatList<Message>

  componentDidMount() {
    this.messageRef.on('value', snapshot => {
      const values = snapshot.val()

      let initMessages: Message[]
      initMessages = []
      const messages: [Message] = Object.keys(values).reduce(
        (acc, current, index, arr) => {
          const value = values[current]
          const message = value['message']
          const user = value['user']
          const time = value['time']
          if (message && user && time) {
            return append({ message, time, user }, acc)
          }
          return acc
        },
        initMessages
      )
      this.setState({
        allmessages: sort((lhs, rhs) => lhs.time > rhs.time, messages)
      }, () => {
        setTimeout(() => {
          this.flatlist.scrollToEnd()
        }, 500)
      })
    })
  }

  onTextChange = text => {
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
      this.setState({
        message: ''
      })
    }
  }

  renderItem = ({ item }: { item: Message }) => {
    const myEmail = firebase.auth().currentUser.email
    const isMyMessage = myEmail === item.user
    return (
      <View style={{ flexDirection: isMyMessage ? 'row-reverse' : 'row' }}>
        <View
          style={{
            margin: 8,
            padding: 8,
            borderWidth: 1,
            borderColor: 'grey',
            borderRadius: 8
          }}
        >
          <Text>{item.user}:</Text>
          <Text>{item.message}</Text>
          <Text>time:{item.time}</Text>
        </View>
      </View>
    )
  }

  render() {
    const messages: [Message] = pathOr([], ['allmessages'], this.state)
    const message = pathOr(null, ['message'], this.state)
    return (
      <View style={{ flex: 1 }}>
        <FlatList
          style={{ flex: 1, marginBottom: '64px' }}
          data={messages}
          renderItem={this.renderItem}
          scrollEnabled
          ref={ref => { this.flatlist = ref }}
        />
        <View style={styles.messageContainer}>
          <TextInput
            value={message}
            style={styles.input}
            placeholder={'Type message here!'}
            onChangeText={this.onTextChange}
          />
          <TouchableOpacity
            style={{ marginRight: 8 }}
            onPress={this.onSendPress}
          >
            <Text style={styles.message}>Send</Text>
          </TouchableOpacity>
        </View>
      </View>
    )
  }
}

export default chat
