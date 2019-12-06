import { StyleSheet } from 'react-native'

export default StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center'
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
  },
  messageContainer: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    height: '64px',
    borderTopColor: 'grey',
    borderTopWidth: 1,
    flexDirection: 'row',
    alignItems: 'center'
  },
  input: {
    flex: 1,
    marginLeft: 8,
    marginRight: 8
  },
  message: {
    borderWidth: 1,
    borderColor: 'grey',
    borderRadius: 8,
    padding: 8,
    width: '80px',
    textAlign: 'center'
  }
})
