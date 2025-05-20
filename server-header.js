const express = require('express') // Express 프레임워크를 가져옵니다. 웹 서버를 쉽게 구축할 수 있게 도와줍니다.
const cors = require('cors') // CORS 미들웨어를 가져옵니다. 다른 도메인에서의 요청을 허용/제한하는 데 사용됩니다.
const cookieParser = require('cookie-parser') // cookie-parser 미들웨어를 가져옵니다. (이 코드에서는 사용되지 않지만 포함되어 있습니다.)
const jwt = require('jsonwebtoken') // jsonwebtoken 라이브러리를 가져옵니다. JWT(JSON Web Token)를 생성하고 검증하는 데 사용됩니다.

// 임시 사용자 데이터 배열입니다. 실제 애플리케이션에서는 데이터베이스를 사용해야 합니다.
const users = [
  {
    user_id: 'test',
    user_password: '1234',
    user_name: '테스트 유저',
    user_info: '테스트 유저입니다'
  }
]

const app = express() // Express 애플리케이션 인스턴스를 생성합니다.

// CORS (Cross-Origin Resource Sharing) 설정입니다.
// 클라이언트가 다른 도메인에서 서버로 요청을 보낼 수 있도록 허용합니다.
app.use(cors({
  // `origin`: 요청을 보낼 수 있는 클라이언트의 도메인을 설정합니다.
  // 개발 환경에서는 'http://127.0.0.1:[사용중인 포트번호]' 또는 'http://localhost:[사용중인 포트번호]'를 사용합니다.
  origin: ['http://127.0.0.1:[사용중인 포트번호]', 'http://localhost:[사용중인 포트번호]'],
  // `methods`: 허용할 HTTP 요청 메서드를 설정합니다.
  methods: ['OPTIONS', 'POST', "GET", "DELETE"],
  // `credentials`: 클라이언트와 서버 간에 자격 증명(쿠키 등)을 주고받을 수 있도록 허용합니다.
  // 이 코드에서는 JWT를 쿠키가 아닌 `Authorization` 헤더로 주고받으므로, 이 설정은 필수는 아니지만,
  // 이전 코드와의 일관성을 위해 유지될 수 있습니다.
  credentials: true
}))

// `cookieParser` 미들웨어는 요청 헤더에 포함된 쿠키를 파싱하여 `req.cookies` 객체에 저장합니다.
// 현재 코드에서는 쿠키를 사용하지 않으므로 이 미들웨어는 필요하지 않습니다.
app.use(cookieParser())
// `express.json()` 미들웨어는 요청 본문에 JSON 형식의 데이터가 있을 경우 이를 파싱하여 `req.body` 객체에 저장합니다.
app.use(express.json())

// JWT 서명 및 검증에 사용될 비밀 키입니다.
// 실제 프로덕션 환경에서는 이 키를 환경 변수 등으로 관리하고, 더 길고 복잡하게 생성해야 합니다.
const secretKey = 'ozcodingschool'

// POST 요청 핸들러: 로그인 처리
app.post('/', (req, res) => {
  const { userId, userPassword } = req.body // 요청 본문에서 userId와 userPassword를 추출합니다.
  // 사용자 배열에서 제공된 ID와 비밀번호에 해당하는 사용자를 찾습니다.
  const userInfo = users.find(el => el.user_id === userId && el.user_password === userPassword)

  // 사용자를 찾지 못했거나 비밀번호가 일치하지 않을 경우
  if (!userInfo) {
    res.status(401).send('로그인 실패') // 401 Unauthorized 상태 코드와 메시지를 응답합니다.
  } else {
    // 사용자를 찾은 경우 JWT를 생성합니다.
    // `jwt.sign()`: JWT를 생성하는 함수입니다.
    // 첫 번째 인자: 페이로드 (JWT에 담을 데이터, 여기서는 사용자 ID)
    // 두 번째 인자: 비밀 키
    // 세 번째 인자: 옵션 (여기서는 토큰 만료 시간 10분)
    const accessToken = jwt.sign({ userId: userInfo.user_id }, secretKey, { expiresIn: 1000 * 60 * 10 })
    // 생성된 JWT를 클라이언트에 응답 본문으로 직접 전송합니다.
    // 이 방식은 클라이언트가 토큰을 localStorage나 sessionStorage에 저장하여 관리하게 됩니다.
    res.send(accessToken) // 생성된 토큰을 응답합니다.
  }
})

// GET 요청 핸들러: 사용자 정보 조회 (인증 필요)
app.get('/', (req, res) => {
  // `req.headers.authorization`: 클라이언트가 'Authorization' 헤더에 담아 보낸 토큰을 가져옵니다.
  // 보통 'Bearer [토큰]' 형식으로 오므로, 'Bearer ' 부분을 제외하고 실제 토큰만 추출합니다.
  const authHeader = req.headers.authorization;

  // Authorization 헤더가 없거나 'Bearer ' 형식으로 시작하지 않으면 에러 처리
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).send('인증 토큰이 제공되지 않았거나 형식이 올바르지 않습니다.');
  }

  const accessToken = authHeader.split(' ')[1]; // 'Bearer ' 다음에 오는 실제 토큰 문자열을 추출합니다.

  try {
    // `jwt.verify()`: JWT를 검증하고 페이로드(payload)를 디코딩합니다.
    // 첫 번째 인자: 검증할 JWT
    // 두 번째 인자: 비밀 키
    const payload = jwt.verify(accessToken, secretKey);
    // 페이로드에서 추출한 userId를 사용하여 사용자 배열에서 해당 사용자 정보를 찾습니다.
    const userInfo = users.find(el => el.user_id === payload.userId); 
    
    // 사용자 정보가 없으면 404 Not Found 응답을 보냅니다.
    if (!userInfo) {
      return res.status(404).send('사용자 정보를 찾을 수 없습니다.');
    }

    // 사용자 정보를 JSON 형태로 클라이언트에 응답합니다.
    return res.json(userInfo);
  } catch (error) {
    // JWT 검증 중 오류가 발생한 경우 (예: 토큰 만료, 잘못된 서명)
    if (error.name === 'TokenExpiredError') {
      return res.status(401).send('토큰이 만료되었습니다.'); // 토큰 만료 에러 처리
    }
    return res.status(401).send('유효하지 않은 토큰입니다.'); // 그 외 유효하지 않은 토큰 에러 처리
  }
})

// DELETE 요청 핸들러: 로그아웃 처리 (이 버전에서는 삭제됨)
// 이전 코드와 달리 DELETE 엔드포인트가 없습니다.
// JWT를 HTTP 헤더로 관리하는 방식에서는 클라이언트 측에서 토큰을 삭제하면 되므로,
// 서버 측에서 특별한 로그아웃 로직(예: 쿠키 삭제)이 필요 없을 수 있습니다.
// 하지만 서버 측에서 토큰 블랙리스트를 관리하는 경우에는 이 엔드포인트가 필요할 수 있습니다.

// 서버를 3000번 포트에서 실행합니다.
app.listen(3000, () => console.log('서버 실행!'))