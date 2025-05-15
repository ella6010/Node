// express 모듈을 불러와 웹 서버를 구성하는 데 사용합니다.
const express = require('express');
// cors 모듈을 불러와 교차 출처 요청(Cross-Origin Requests)을 처리합니다.
// 클라이언트(예: localhost:9000)와 서버(localhost:3000)의 출처가 다르므로 필요합니다.
const cors = require('cors');
// cookie-parser 모듈을 불러와 요청 헤더의 쿠키를 파싱하고 응답에 쿠키를 설정하는 데 도움을 줍니다.
const cookieParser = require('cookie-parser');

// express 애플리케이션 인스턴스를 생성합니다.
const app = express();

// CORS 미들웨어를 애플리케이션에 적용합니다.
app.use(cors({
  // origin: 허용할 클라이언트 출처(Origin) 목록입니다. 클라이언트 코드가 실행되는 주소와 포트를 명시합니다.
  // 여기서는 127.0.0.1:9000 또는 localhost:9000에서 오는 요청만 허용합니다.
  origin: ['http://127.0.0.1:9000', 'http://localhost:9000'],
  // methods: 허용할 HTTP 메소드 목록입니다. 클라이언트에서 사용하는 GET, DELETE 메소드와 CORS preflight 요청을 위한 OPTIONS를 허용합니다.
  methods: ['GET', 'DELETE', 'OPTIONS'],
  // credentials: true 설정은 브라우저가 요청 시 쿠키나 인증 헤더 같은 자격 증명을 포함하도록 허용합니다.
  // 클라이언트와 서버 모두에서 이 설정을 true로 해야 쿠키 기반 통신이 정상적으로 동작합니다.
  credentials: true
}));

// cookie-parser 미들웨어를 적용합니다.
// 이 미들웨어는 들어오는 요청의 Cookie 헤더를 파싱하여 req.cookies 객체로 만들어주고,
// res.cookie(), res.clearCookie() 등의 메서드를 사용할 수 있게 해줍니다.
app.use(cookieParser());

// 루트 경로('/')에 대한 GET 요청을 처리하는 라우트를 정의합니다.
// 클라이언트의 '쿠키 설정' 요청을 여기서 처리합니다.
app.get('/', (req, res) => {
  // 'test-cookie'라는 이름으로 쿠키를 설정합니다.
  // 값은 'my cookie'입니다.
  // 옵션 설명:
  // maxAge: 쿠키의 최대 수명(밀리초)입니다. 100000ms(100초)로 설정됩니다.
  // httpOnly: true로 설정하면 클라이언트 측 JavaScript에서 document.cookie 등으로 쿠키에 접근할 수 없습니다. XSS 공격 방지에 도움이 되는 중요한 보안 설정입니다.
  // secure: true로 설정하면 HTTPS 연결에서만 쿠키가 전송됩니다. 로컬 환경(http://localhost)에서 테스트 시 secure: true이면 쿠키가 설정되지 않거나 전송되지 않을 수 있으니 주의하세요. 로컬 테스트 시에는 이 옵션을 제거하거나 false로 설정할 필요가 있습니다.
  res.cookie('test-cookie', 'my cookie', { maxAge: 100000, httpOnly: true, secure: true });

  // 클라이언트에 '쿠키 생성 완료' 메시지를 응답으로 보냅니다.
  res.send('쿠키 생성 완료');
});

// 루트 경로('/')에 대한 DELETE 요청을 처리하는 라우트를 정의합니다.
// 클라이언트의 '쿠키 삭제' 요청을 여기서 처리합니다.
app.delete('/', (req, res) => {
  // 'test-cookie'라는 이름의 쿠키를 삭제(무효화)합니다.
  // 실제로는 해당 쿠키의 만료일을 현재보다 과거로 설정하여 브라우저가 즉시 삭제하도록 지시합니다.
  res.clearCookie('test-cookie');

  // 클라이언트에 '쿠키 삭제 완료' 메시지를 응답으로 보냅니다.
  res.send('쿠키 삭제 완료');
});

// 3000번 포트에서 서버를 시작합니다.
app.listen(3000, () => {
  // 서버가 성공적으로 시작되면 콘솔에 메시지를 출력합니다.
  console.log('서버 실행!');
});