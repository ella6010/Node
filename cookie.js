// HTML 문서에서 ID가 'set_cookie'인 요소를 찾아서 setCookieButton 변수에 할당합니다.
// 이 요소는 아마도 "쿠키 설정" 버튼
const setCookieButton = document.querySelector('#set_cookie');

// HTML 문서에서 ID가 'delete_cookie'인 요소를 찾아서 deleteCookieButton 변수에 할당합니다.
// 이 요소는 아마도 "쿠키 삭제" 버튼
const deleteCookieButton = document.querySelector('#delete_cookie');

// axios의 기본 설정에 withCredentials를 true로 설정합니다.
// 이 설정은 브라우저가 교차 출처 요청(cross-origin requests)을 보낼 때
// 자동으로 쿠키, 인증 헤더 등의 자격 증명을 포함하도록 지시합니다.
// 쿠키를 사용한 세션 관리 등에서 필수적인 설정입니다.
axios.defaults.withCredentials = true;

// setCookieButton을 클릭했을 때 실행될 이벤트 핸들러를 정의합니다.
setCookieButton.onclick = () => {
  // http://localhost:3000으로 GET 요청을 보냅니다.
  // 이 요청은 서버(http://localhost:3000)에게 쿠키를 설정하라는 신호 역할을 할 것으로 예상됩니다.
  // 서버는 이 GET 요청에 대한 응답으로 'Set-Cookie' 헤더를 포함하여 쿠키를 브라우저에 설정하게 될 것입니다.
  axios.get('http://localhost:3000')
  .then(res => {
    // 요청이 성공적으로 완료되면 서버로부터 받은 응답(res) 객체를 콘솔에 출력합니다.
    // 응답 상태 코드나 데이터 등을 확인할 수 있습니다.
    console.log(res);
  })
  // .catch(...)를 추가하여 오류 처리 로직을 구현하는 것이 좋습니다.
  // 예: .catch(error => console.error('쿠키 설정 실패:', error));
}

// deleteCookieButton을 클릭했을 때 실행될 이벤트 핸들러를 정의합니다.
deleteCookieButton.onclick = () => {
  // http://localhost:3000으로 DELETE 요청을 보냅니다.
  // 이 요청은 서버(http://localhost:3000)에게 쿠키를 삭제하라는 신호 역할을 할 것으로 예상됩니다.
  // 서버는 이 DELETE 요청을 받고 해당 쿠키를 만료시키거나 삭제하는 로직을 수행해야 합니다.
  axios.delete('http://localhost:3000')
  .then(res => {
    // 요청이 성공적으로 완료되면 서버로부터 받은 응답(res) 객체를 콘솔에 출력합니다.
    // 응답 상태 코드 등을 확인할 수 있습니다.
    console.log(res);
  })
   // .catch(...)를 추가하여 오류 처리 로직을 구현하는 것이 좋습니다.
   // 예: .catch(error => console.error('쿠키 삭제 실패:', error));
}