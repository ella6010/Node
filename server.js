const express = require('express')
const cors = require('cors')
const axios = require('axios')

const kakaoClientId = '7d91e2053ea405b28870316616b10058'
const redirectURI = 'http://127.0.0.1:5500'

const app = express()

app.use(cors({
    origin: ['http://localhost:5500','http://127.0.0.1:5500'],
    methods: ["OPTIONS", "POST", "DELETE"]
}))

app.use(express.json())

app.post('/kakao/login', (req, res) => {
    const authorizationCode = req.body.authorizationCode
    axios.post('https://kauth.kakao.com/oauth/token', {
        grant_type: 'authorization_code',
        client_id: kakaoClientId,
        redirect_uri: redirectURI,
        code: authorizationCode
    },
        {
            headers: {'Content-Type' : 'application/x-www-form-urlencoded;charset=utf-8'}
        }
    )
    .then(response => res.send(response.data.access_token))
})

app.post('/kakao/userinfo', (req, res) => {
    const { kakaoAccessToken } = req.body
    axios.get('https://kapi.kakao.com/v2/user/me', {
        headers: {
            Authorization: `Bearer ${kakaoAccessToken}`,
            'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8'
        }
    })
    .then(response => res.json(response.data.properties))
})

app.delete('/kakao/logout', (req, res) => {
    const { kakaoAccessToken } = req.body
    axios.post('https://kapi.kakao.com/v1/user/logout', {}, {
        headers: {Authorization: `Bearer ${kakaoAccessToken}`}
    })
    .then(response => res.send('로그아웃 성공'))
})

app.listen(3000, () => console.log('서버 열림!'))

