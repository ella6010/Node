const kakaoLoginButton = document.querySelector('#kakao')
const naverLoginButton = document.querySelector('#naver')
const userImage = document.querySelector('img')
const userName = document.querySelector('#user_name')
const logoutButton = document.querySelector('#logout_button')

function renderUserInfo(imgUrl = '', name = '') {
    userImage.src = imgUrl
    userName.textContent = name
}

const kakaoClientId = '7d91e2053ea405b28870316616b10058'
const redirectURI = 'http://127.0.0.1:5500'
let kakaoAccessToken = ''

// 카카오 로그인 버튼 클릭 시 로그인 페이지로 이동
kakaoLoginButton.onclick = () => {
    location.href = `https://kauth.kakao.com/oauth/authorize?client_id=${kakaoClientId}&redirect_uri=${redirectURI}&response_type=code`
}

// 페이지 로드 후 인증 코드가 있으면 로그인 처리
window.onload = () => {
    const url = new URL(location.href)
    const authorizationCode = url.searchParams.get('code')

    if (!authorizationCode) return  // 인증 코드 없으면 중단

    axios.post('http://localhost:3000/kakao/login', { authorizationCode })
        .then(res => {
            console.log('AccessToken 응답:', res)
            kakaoAccessToken = res.data
            return axios.post('http://localhost:3000/kakao/userinfo', { kakaoAccessToken })
        })
        .then(res => {
            const { profile_image, nickname } = res.data
            renderUserInfo(profile_image, nickname)
        })
        .catch(err => {
            console.error('카카오 로그인 에러:', err)
        })
}

// 로그아웃 버튼 클릭 시 처리
logoutButton.onclick = () => {
    axios.delete('http://localhost:3000/kakao/logout', {
        data: { kakaoAccessToken }
    })
    .then(res => {
        console.log('로그아웃 성공:', res.data)
        renderUserInfo('', '')
    })
    .catch(err => {
        console.error('로그아웃 에러:', err)
    })
}
