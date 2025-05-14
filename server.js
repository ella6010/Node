// Express 모듈을 불러옵니다. Express는 Node.js에서 웹 서버 및 API를 구축하기 위한 빠르고 유연한 프레임워크입니다.
const express = require('express');
// cors 모듈을 불러옵니다. cors는 Cross-Origin Resource Sharing (교차 출처 리소스 공유) 문제를 해결하기 위한 미들웨어입니다.
// 웹 브라우저 보안 정책에 따라 다른 도메인/포트에서 서버로 요청을 보낼 때 발생하는 CORS 오류를 방지해 줍니다.
const cors = require('cors');

// 간단한 TODO 목록 데이터를 저장할 배열을 선언합니다.
// 이 데이터는 서버가 실행되는 동안에만 메모리에 유지되며, 서버를 다시 시작하면 초기화됩니다.
let todo = [
  { id: 1, content: '더미데이터' },
  { id: 2, content: '터미네이터ㅋㅋ' }
];

// Express 애플리케이션 인스턴스를 생성합니다. 이 'app' 객체를 통해 서버 설정을 하고 라우트를 정의합니다.
const app = express();

// 미들웨어를 설정합니다. app.use()는 모든 요청에 대해 특정 함수(미들웨어)를 실행하도록 등록합니다.

// cors 미들웨어를 사용합니다.
app.use(cors({
  // 'origin' 옵션: 특정 출처(Origin)에서의 요청만 허용하도록 설정합니다.
  // 여기서는 http://127.0.0.1:9000 에서 온 요청만 허용합니다. 실제 서비스에서는 허용할 클라이언트의 URL을 명시합니다.
  origin: "http://127.0.0.1:9000",
  // 'methods' 옵션: 허용할 HTTP 메서드들을 지정합니다.
  // OPTIONS (CORS 사전 요청), GET (조회), POST (생성), PUT (수정), DELETE (삭제) 메서드를 허용합니다.
  methods: ['OPTIONS', 'GET', 'POST', 'PUT', 'DELETE']
}));

// express.json() 미들웨어: 클라이언트에서 JSON 형식으로 데이터를 보낼 경우,
// 요청 본문(request body)을 파싱하여 req.body 객체로 사용할 수 있게 해줍니다.
app.use(express.json());
// express.text() 미들웨어: 클라이언트에서 Text 형식으로 데이터를 보낼 경우,
// 요청 본문(request body)을 파싱하여 req.body 객체로 사용할 수 있게 해줍니다.
// NOTE: 보통 JSON이나 Text 중 하나만 사용하거나, 필요한 라우트에만 적용하는 것이 일반적입니다.
// 이 코드에서는 PUT, DELETE 라우트에서 req.body를 어떻게 사용하는지에 따라 이 미들웨어 설정이 중요합니다.
app.use(express.text());

// 라우트 핸들러를 정의합니다. 각 HTTP 메서드 및 경로에 따라 실행될 코드를 지정합니다.

// '/' 경로에 대한 OPTIONS 요청 처리:
// CORS 설정에 따라 브라우저는 실제 요청(POST, PUT, DELETE 등)을 보내기 전에 OPTIONS 메서드로 사전 요청(Preflight request)을 보냅니다.
// 여기서 '요청 보내세요.'라는 응답을 보내지만, 보통 cors 미들웨어가 이 부분을 자동으로 처리해 줍니다.
app.options('/', (req, res) => {
  console.log('OPTIONS 요청 받음'); // 확인을 위한 로그 추가
  return res.send('요청 보내세요.'); // 클라이언트에 응답 전송
});

// '/' 경로에 대한 GET 요청 처리: TODO 목록을 조회합니다.
app.get('/', (req, res) => {
  console.log('GET 요청 받음'); // 확인을 위한 로그 추가
  // 현재 todo 배열을 JSON 형식으로 변환하여 응답합니다.
  return res.json(todo);
});

// '/' 경로에 대한 POST 요청 처리: 새 TODO 항목을 추가합니다.
app.post('/', (req, res) => {
  console.log('POST 요청 받음', req.body); // 확인을 위한 로그 추가 (요청 본문 포함)
  // 새 TODO 객체를 생성합니다. ID는 현재 시간을 숫자로 변환하여 간단하게 생성합니다.
  // NOTE: req.body가 어떤 형식으로 올지 (JSON 또는 TEXT) express.json() 및 express.text() 미들웨어 설정과 연관됩니다.
  // 여기서는 content가 req.body로 바로 들어오는 것을 보니 express.text() 미들웨어가 처리하는 형태를 예상할 수 있습니다.
  // 만약 JSON으로 { "content": "새 할일" } 처럼 보낸다면 req.body.content로 접근해야 합니다.
  const newTodo = { id: Number(new Date()), content: req.body };
  // TODO 목록 배열에 새 항목을 추가합니다.
  todo.push(newTodo);
  console.log('TODO 추가 후:', todo); // 확인을 위한 로그 추가
  // 클라이언트에 응답을 보냅니다.
  return res.send('Todo가 추가됐습니다.');
});

// '/' 경로에 대한 PUT 요청 처리: 기존 TODO 항목을 수정합니다.
app.put('/', (req, res) => {
  console.log('PUT 요청 받음', req.body); // 확인을 위한 로그 추가 (요청 본문 포함)
  // 클라이언트에서 보낸 수정된 TODO 객체(req.body)를 이용해 목록을 업데이트합니다.
  // NOTE: 여기서는 req.body가 { id: ..., content: ... } 형태의 JSON 객체일 것으로 예상됩니다.
  // 이는 express.json() 미들웨어가 처리하는 형태입니다. POST 라우트와 req.body 처리 방식이 다릅니다.
  // map 함수를 사용하여 TODO 목록을 순회하며, ID가 일치하는 항목은 req.body로 교체하고 나머지는 그대로 유지합니다.
  todo = todo.map(el => {
    if (el.id === req.body.id) {
      return req.body; // ID가 일치하면 요청 본문의 객체로 교체
    } else {
      return el; // ID가 일치하지 않으면 기존 항목 유지
    }
  });
  console.log('TODO 수정 후:', todo); // 확인을 위한 로그 추가
  // 클라이언트에 응답을 보냅니다.
  return res.send('Todo가 수정됐습니다.');
});

// '/' 경로에 대한 DELETE 요청 처리: TODO 항목을 삭제합니다.
app.delete('/', (req, res) => {
  console.log('DELETE 요청 받음', req.body); // 확인을 위한 로그 추가 (요청 본문 포함)
  // 클라이언트에서 삭제할 TODO의 ID를 요청 본문으로 보낸다고 예상합니다.
  // NOTE: PUT 라우트에서는 req.body가 JSON 객체였는데, 여기서는 ID 값만 텍스트로 오는 것을 예상하는 듯 합니다.
  // req.body를 숫자로 변환하는 것으로 보아 express.text() 미들웨어가 처리하는 형태입니다.
  // API 일관성을 위해 삭제 요청도 JSON 형식으로 { "id": 5 } 처럼 받는 것을 고려해 볼 수 있습니다.
  const id = Number(req.body); // 요청 본문의 텍스트를 숫자로 변환 (삭제할 ID)
  // filter 함수를 사용하여 ID가 삭제할 ID와 다른 항목들만 남겨 새 배열을 만듭니다.
  todo = todo.filter(el => el.id !== id );
  console.log('TODO 삭제 후:', todo); // 확인을 위한 로그 추가
  // 클라이언트에 응답을 보냅니다.
  return res.send('Todo가 삭제됐습니다.');
});

// 설정된 포트(3000번)에서 서버를 시작하고 대기합니다.
app.listen(3000, () => {
  // 서버가 성공적으로 시작되면 콘솔에 메시지를 출력합니다.
  console.log('서버가 열렸어요! 포트: 3000');
});