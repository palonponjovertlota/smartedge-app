import * as React from 'react'
import { StyleSheet } from 'react-native'
import omit from 'lodash/omit'
import quizIcon from '@assets/png/icons/quiz.png'
import Button from '@components/Button'
import TextInput from '@components/TextInput'
import Master from '@components/Layouts/Master'
import { AuthContext } from '@contexts/AuthContext'
import api from '@helpers/api'

type Errors = {
  name?: string[]
  body?: string[]
}

export default function Create({ navigation }) {
  const { authToken } = React.useContext(AuthContext)
  const [name, setName] = React.useState('')
  const [body, setBody] = React.useState('')
  const [errors, setErrors] = React.useState<Errors>({})
  const [loading, setLoading] = React.useState(false)

  const handleSubmit = async () => {
    try {
      setLoading(true)
      const res = await api(
        '/subjects',
        {
          method: 'POST',
          body: JSON.stringify({
            name,
            body
          })
        },
        authToken
      )

      switch (res.status) {
        case 422:
          const { errors = {} } = await res.json()
          setErrors(errors)
          setLoading(false)
          break

        case 201:
          navigation.navigate('SubjectList', {
            refresh: true
          })
          break
      }
    } catch (error) {
      console.log(error)
    }
  }

  return (
    <Master
      navigation={navigation}
      withBack
      title="TAKE A QUIZ"
      titleIcon={quizIcon}
      titleIconPlacement="left"
    >
      <TextInput
        label="Subject Name"
        value={name}
        onChangeText={text => {
          setName(text)
          setErrors(omit(errors, ['name']))
        }}
        style={styles.inputContainer}
        error={errors.name}
      />

      <TextInput
        label="Subject Description"
        value={body}
        onChangeText={text => {
          setBody(text)
          setErrors(omit(errors, ['body']))
        }}
        style={{ ...styles.inputContainer }}
        multiline={true}
        numberOfLines={4}
        error={errors.body}
      />

      <Button
        title="Create"
        style={styles.button}
        onPress={handleSubmit}
        disabled={loading}
      />
    </Master>
  )
}

const styles = StyleSheet.create({
  inputContainer: {
    width: '100%',
    marginBottom: 10
  },
  button: {
    width: '100%'
  }
})
