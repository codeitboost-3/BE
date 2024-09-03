# 🌌 기억 저장 및 공유 서비스, 조각집

조각집은 사용자가 그룹을 생성하고 추억을 공유하며, 서로의 추억에 공감을 표현할 수 있는 서비스입니다. 각 그룹은 자신만의 추억을 기록하고, 특정 조건을 만족하면 배지를 획득할 수 있습니다.

## 📜 주요 기능

- **그룹 생성 및 관리**: 그룹을 생성하고, 수정하고, 삭제할 수 있습니다. 그룹은 공개 또는 비공개로 설정할 수 있으며, 비공개 그룹은 비밀번호로 보호됩니다.
- **게시글(추억) 작성 및 관리**: 그룹 내에서 추억을 작성하고, 수정하고, 삭제할 수 있습니다. 각 추억은 이미지와 태그를 포함할 수 있습니다.
- **댓글 작성 및 관리**: 각 추억에 댓글을 달고 관리할 수 있습니다.
- **공감 기능**: 그룹과 게시글에 공감을 보내어 공감 수를 높일 수 있습니다.
- **배지 시스템**: 특정 조건을 만족하면 자동으로 배지를 획득할 수 있습니다.

## 🛠️ 기술 스택

- **Backend**: Node.js, Express.js
- **Database**: MongoDB, Mongoose
- **Environment Management**: dotenv
- **Others**: CORS 설정, RESTful API 설계

## 🏛️ 아키텍처 다이어그램

```plaintext
+------------------+           +--------------------+
|  Web/Mobile App  |  <--->    |  Express.js Server  |
+------------------+           +--------------------+
                                  |
                                  |
                         +----------------+
                         |  MongoDB       |
                         +----------------+
```

## 📄 프로젝트 구조
```plaintext
memory-sharing-service/
│
├── models/              # Mongoose 모델 정의
│   ├── groupModel.js
│   ├── postModel.js
│   └── commentModel.js
│
├── controllers/         # Express.js 컨트롤러
│   ├── groupController.js
│   ├── postController.js
│   └── commentController.js
│
├── routes/              # Express.js 라우트 정의
│   ├── groupRoute.js
│   ├── postRoute.js
│   └── commentRoute.js
│
├── .env                 # 환경 변수 설정 파일
├── app.js               # Express 서버 설정
├── package.json         # 프로젝트 종속성 및 스크립트
└── README.md            # 프로젝트 설명 파일
```
