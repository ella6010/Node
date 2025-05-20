const form = document.querySelector('form')
const idInput = document.querySelector('#user_id')
const passwordInput = document.querySelector('#user_password')
const loginButton = document.querySelector('#login_button')

const main = document.querySelector('main')
const userName = document.querySelector('#user_name')
const userInfo = document.querySelector('#user_info')
const logoutButton = document.querySelector('#logout_button')

// axios의 기본 설정으로, 모든 요청에 대해 자격 증명(쿠키, HTTP 인증 등)을 포함하도록 합니다.
// 이는 서버와의 세션 관리에 유용합니다.
axios.defaults.withCredentials = true;
let accessToken = '' // 로그인 성공 후 서버로부터 받은 accessToken을 저장할 변수입니다.

// 폼 제출 시 기본 동작(페이지 새로고침)을 막습니다.
form.addEventListener('submit', (e) => e.preventDefault())

// 로그인 함수: 사용자 ID와 비밀번호를 서버로 전송하여 로그인 요청을 보냅니다.
function login() {
  const userId = idInput.value // ID 입력 필드의 값
  const userPassword = passwordInput.value // 비밀번호 입력 필드의 값

  // 'http://localhost:3000'으로 POST 요청을 보냅니다.
  return axios.post('http://localhost:3000', { userId, userPassword })
  // 요청 성공 시, 서버 응답(res.data)을 accessToken 변수에 저장합니다.
  .then(res => accessToken = res.data)
}

// 로그아웃 함수: accessToken을 초기화하여 로그아웃 상태로 만듭니다.
// 실제 애플리케이션에서는 서버에도 로그아웃 요청을 보내 세션을 무효화하는 로직이 추가될 수 있습니다.
function logout() {
  accessToken = ''
}

// 사용자 정보 조회 함수: 저장된 accessToken을 사용하여 서버에 사용자 정보 요청을 보냅니다.
function getUserInfo() {
  return axios.get('http://localhost:3000', {
    // 요청 헤더에 Authorization 필드를 추가하고, Bearer 토큰 방식으로 accessToken을 전송합니다.
    headers: { 'Authorization' : `Bearer ${accessToken}`}
  })
}

// 사용자 정보를 화면에 렌더링하는 함수:
// 메인 섹션을 보이게 하고, 로그인 폼을 숨깁니다.
// 사용자 이름과 정보를 해당하는 요소에 표시합니다.
function renderUserInfo(user) {
  main.style.display = 'block' // 메인 섹션 표시
  form.style.display = 'none' // 로그인 폼 숨김
  userName.textContent = user.user_name // 사용자 이름 표시
  userInfo.textContent = user.user_info // 사용자 정보 표시
}

// 로그인 폼을 화면에 렌더링하는 함수:
// 메인 섹션을 숨기고, 로그인 폼을 보이게 합니다.
// 이전에 표시되던 사용자 이름과 정보를 초기화합니다.
function renderLoginForm() {
  main.style.display = 'none' // 메인 섹션 숨김
  form.style.display = 'grid' // 로그인 폼 표시 (CSS 그리드 레이아웃)
  userName.textContent = '' // 사용자 이름 초기화
  userInfo.textContent = '' // 사용자 정보 초기화
}

// 로그인 버튼 클릭 시 실행되는 이벤트 핸들러:
loginButton.onclick = () => {
  login() // 1. 로그인 함수 호출
    .then(() => getUserInfo()) // 2. 로그인 성공 시, 사용자 정보 조회 함수 호출
    .then(res => renderUserInfo(res.data)) // 3. 사용자 정보 조회 성공 시, 화면에 정보 렌더링
}

// 로그아웃 버튼 클릭 시 실행되는 이벤트 핸들러:
logoutButton.onclick = () => {
  logout() // 1. 로그아웃 함수 호출 (accessToken 초기화)
  renderLoginForm() // 2. 로그인 폼을 다시 화면에 표시
}