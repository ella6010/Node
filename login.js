const form = document.querySelector('form')
const idInput = document.querySelector('#user_id')
const passwordInput = document.querySelector('#user_password')
const loginButton = document.querySelector('#login_button')

const main = document.querySelector('main')
const userName = document.querySelector('#user_name')
const userInfo = document.querySelector('#user_info')
const logoutButton = document.querySelector('#logout_button')

// axios의 기본 설정으로, 모든 요청에 대해 자격 증명(쿠키, HTTP 인증 등)을 포함하도록 합니다.
// 이는 서버와의 세션 관리에 유용하며, 특히 서버에서 JWT를 쿠키로 관리하는 경우에 필요합니다.
axios.defaults.withCredentials = true;

// 폼 제출 시 기본 동작(페이지 새로고침)을 막습니다.
form.addEventListener('submit', (e) => e.preventDefault())

// 로그인 함수: 사용자 ID와 비밀번호를 서버로 전송하여 로그인 요청을 보냅니다.
// 이전 코드와 다르게 accessToken을 클라이언트에서 직접 저장하지 않고,
// 서버에서 세션 또는 쿠키를 통해 인증 상태를 관리하는 방식에 더 적합합니다.
function login() {
  const userId = idInput.value // ID 입력 필드의 값
  const userPassword = passwordInput.value // 비밀번호 입력 필드의 값

  // 'http://localhost:3000'으로 POST 요청을 보냅니다.
  return axios.post('http://localhost:3000', {userId, userPassword})
}

// 로그아웃 함수: 서버에 로그아웃 요청을 보냅니다.
// 서버는 이 요청을 받아 세션을 무효화하거나 인증 관련 쿠키를 삭제할 수 있습니다.
function logout() {
  return axios.delete('http://localhost:3000') // 'http://localhost:3000'으로 DELETE 요청을 보냅니다.
}

// 사용자 정보 조회 함수: 서버에 사용자 정보 요청을 보냅니다.
// `axios.defaults.withCredentials = true;` 설정 덕분에,
// 서버에서 설정한 인증 쿠키가 자동으로 요청에 포함되어 인증된 사용자 정보를 가져올 수 있습니다.
function getUserInfo() {
  return axios.get('http://localhost:3000') // 'http://localhost:3000'으로 GET 요청을 보냅니다.
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
    .then(() => getUserInfo()) // 2. 로그인 성공 시, 사용자 정보 조회 함수 호출 (이때 인증 쿠키가 사용됨)
    .then(res => renderUserInfo(res.data)) // 3. 사용자 정보 조회 성공 시, 화면에 정보 렌더링
    // TODO: 로그인 또는 사용자 정보 조회 실패 시 에러 처리를 추가해야 합니다.
    // .catch(error => console.error('Login or user info fetch failed:', error));
}

// 로그아웃 버튼 클릭 시 실행되는 이벤트 핸들러:
logoutButton.onclick = () => {
  logout() // 1. 로그아웃 함수 호출 (서버에 로그아웃 요청)
    .then(res => {
      console.log(res) // 로그아웃 요청의 응답을 콘솔에 출력합니다. (서버에서 성공/실패 메시지 등을 보낼 수 있음)
      renderLoginForm() // 2. 로그아웃 성공 시, 로그인 폼을 다시 화면에 표시
    })
    // TODO: 로그아웃 실패 시 에러 처리를 추가해야 합니다.
    // .catch(error => console.error('Logout failed:', error));
}