# Database Schema - English Learning Website

## Tổng quan
Sơ đồ database cho ứng dụng học tiếng Anh với 7 models chính, hỗ trợ đầy đủ các tính năng học tập và tương tác.

## ERD (Entity Relationship Diagram)

```
┌─────────────┐    ┌─────────────┐    ┌─────────────┐
│    User     │    │   Course    │    │   Lesson    │
├─────────────┤    ├─────────────┤    ├─────────────┤
│ _id         │    │ _id         │    │ _id         │
│ username    │    │ title       │    │ title       │
│ email       │    │ description │    │ description │
│ password    │    │ level       │    │ content     │
│ fullName    │    │ category    │    │ courseId    │
│ role        │    │ createdBy   │    │ order       │
│ level       │    │ isPublished │    │ type        │
│ points      │    │ tags        │    │ materials   │
│ streak      │    │ difficulty  │    │ vocabulary  │
│ totalStudyTime│  │ rating      │    │ grammarPoints│
│ preferredTopics│  │ totalStudents│  │ exercises   │
│ avatar      │    │ price       │    │ isPublished │
│ isActive    │    │ lessonsCount│    │ createdBy   │
│ createdAt   │    │ createdAt   │    │ createdAt   │
│ lastLogin   │    │ updatedAt   │    │ updatedAt   │
│ lastStudyDate│   └─────────────┘    └─────────────┘
│ createdAt   │           │                   │
│ updatedAt   │           │                   │
└─────────────┘           │                   │
       │                  │                   │
       │                  │                   │
       │                  ▼                   ▼
       │           ┌─────────────┐    ┌─────────────┐
       │           │  Exercise   │    │UserProgress │
       │           ├─────────────┤    ├─────────────┤
       │           │ _id         │    │ _id         │
       │           │ title       │    │ userId      │
       │           │ description │    │ courseId    │
       │           │ type        │    │ lessonId    │
       │           │ difficulty  │    │ exerciseId  │
       │           │ points      │    │ status      │
       │           │ timeLimit   │    │ progress    │
       │           │ lessonId    │    │ score       │
       │           │ courseId    │    │ maxScore    │
       │           │ content     │    │ timeSpent   │
       │           │ blanks      │    │ attempts    │
       │           │ matchingPairs│   │ userAnswers │
       │           │ isPublished │    │ notes       │
       │           │ createdBy   │    │ feedback    │
       │           │ createdAt   │    │ createdAt   │
       │           │ updatedAt   │    │ updatedAt   │
       │           └─────────────┘    └─────────────┘
       │                   │                   │
       │                   │                   │
       │                   ▼                   │
       │           ┌─────────────┐             │
       │           │  Comment    │             │
       │           ├─────────────┤             │
       │           │ _id         │             │
       │           │ userId      │             │
       │           │ content     │             │
       │           │ contentType │             │
       │           │ contentId   │             │
       │           │ parentId    │             │
       │           │ replies     │             │
       │           │ likes       │             │
       │           │ dislikes    │             │
       │           │ isApproved  │             │
       │           │ isReported  │             │
       │           │ language    │             │
       │           │ translation │             │
       │           │ createdAt   │             │
       │           │ updatedAt   │             │
       │           └─────────────┘             │
       │                   │                   │
       │                   │                   │
       ▼                   ▼                   ▼
┌─────────────┐    ┌─────────────┐    ┌─────────────┐
│ Vocabulary  │    │  Comment    │    │UserProgress │
├─────────────┤    ├─────────────┤    ├─────────────┤
│ _id         │    │ _id         │    │ _id         │
│ word        │    │ userId      │    │ userId      │
│ phonetic    │    │ content     │    │ courseId    │
│ partOfSpeech│    │ contentType │    │ lessonId    │
│ definitions │    │ contentId   │    │ exerciseId  │
│ level       │    │ parentId    │    │ status      │
│ category    │    │ replies     │    │ progress    │
│ tags        │    │ likes       │    │ score       │
│ audioUrl    │    │ dislikes    │    │ maxScore    │
│ imageUrl    │    │ isApproved  │    │ timeSpent   │
│ synonyms    │    │ isReported  │    │ attempts    │
│ antonyms    │    │ language    │    │ userAnswers │
│ relatedWords│    │ translation │    │ notes       │
│ difficulty  │    │ createdAt   │    │ feedback    │
│ frequency   │    │ updatedAt   │    │ createdAt   │
│ usageCount  │    └─────────────┘    │ updatedAt   │
│ aiGenerated │                        └─────────────┘
│ aiConfidence│
│ createdBy   │
│ isApproved  │
│ createdAt   │
│ updatedAt   │
└─────────────┘
```

### Bổ sung: Post (Blog/Bài viết)

```
┌─────────────┐           ┌─────────────┐
│    User     │ 1       N │    Post     │
├─────────────┤───────────┤─────────────┤
│ _id         │           │ _id         │
│ username    │           │ authorId    │ → ref User._id
│ ...         │           │ title       │
└─────────────┘           │ slug        │ (unique)
                          │ excerpt     │
                          │ content     │ (rich text/HTML)
                          │ coverImage  │
                          │ tags        │
                          │ category    │
                          │ status      │ (draft|published)
                          │ language    │ (en|vi)
                          │ readingTime │ (minutes)
                          │ publishedAt │
                          │ views       │
                          │ likes       │
                          │ commentsCnt │
                          │ createdAt   │
                          │ updatedAt   │
                          └─────────────┘

Post (contentType = "post") liên kết với Comment qua bộ đôi `contentType` + `contentId`.
```

## Mối quan hệ (Relationships)

### 1. User ↔ Course (1:N)
- Một user có thể tạo nhiều courses (teacher/admin)
- Một course chỉ thuộc về một creator

### 2. Course ↔ Lesson (1:N)
- Một course có nhiều lessons
- Mỗi lesson thuộc về một course

### 3. Lesson ↔ Exercise (1:N)
- Một lesson có nhiều exercises
- Mỗi exercise thuộc về một lesson

### 4. User ↔ UserProgress (1:N)
- Một user có nhiều progress records
- Mỗi progress record thuộc về một user

### 5. Course ↔ UserProgress (1:N)
- Một course có nhiều progress records
- Mỗi progress record thuộc về một course

### 6. User ↔ Comment (1:N)
- Một user có thể viết nhiều comments
- Mỗi comment thuộc về một user

### 7. Comment ↔ Comment (1:N - Self-referencing)
- Một comment có thể có nhiều replies
- Mỗi reply thuộc về một parent comment

### 8. User ↔ Vocabulary (1:N)
- Một user có thể tạo nhiều vocabulary items
- Mỗi vocabulary item thuộc về một creator

### 9. User ↔ Post (1:N)
- Một user (tác giả) có thể tạo nhiều bài viết
- Mỗi bài viết có một `authorId` tham chiếu về User

### 10. Post ↔ Comment (1:N)
- Một bài viết có nhiều comments
- Mỗi comment trỏ tới bài viết qua `contentType = "post"` và `contentId = post._id`

## Indexes

### User Collection
- `username` (unique)
- `email` (unique)
- `role`
- `level`

### Course Collection
- `category`, `level`, `isPublished` (compound)
- `createdBy`
- `tags`

### Lesson Collection
- `courseId`, `order` (compound)
- `courseId`, `isPublished` (compound)
- `createdBy`

### Exercise Collection
- `lessonId`, `type` (compound)
- `courseId`, `difficulty` (compound)
- `createdBy`

### UserProgress Collection
- `userId`, `courseId` (compound)
- `userId`, `lessonId` (compound)
- `userId`, `exerciseId` (compound)
- `status`, `userId` (compound)

### Comment Collection
- `contentType`, `contentId` (compound)
- `userId`
- `parentId`
- `isApproved`, `isReported` (compound)

### Vocabulary Collection
- `word` (unique)
- `level`, `category` (compound)
- `tags`
- `difficulty`, `frequency` (compound)
- `createdBy`, `isApproved` (compound)

### Post Collection
- `slug` (unique)
- `authorId`
- `status`, `publishedAt` (compound)
- `category`, `tags` (compound)
- `language`
- `views`

## Data Types

### String Fields
- **Short text**: username, title, word (max 30-200 chars)
- **Long text**: description, content (max 500-1000 chars)
- **Email**: email (with regex validation)
- **URL**: audioUrl, imageUrl, videoUrl

### Number Fields
- **Integer**: points, streak, attempts, order
- **Float**: rating, progress, score
- **Time**: timeSpent (seconds), duration (minutes)

### Date Fields
- **Timestamps**: createdAt, updatedAt
- **User activity**: lastLogin, lastStudyDate
- **Progress**: startTime, completedAt, lastAttemptAt

### Boolean Fields
- **Status**: isActive, isPublished, isApproved, isReported
- **Flags**: aiGenerated

### Array Fields
- **Strings**: tags, preferredTopics, grammarPoints
- **Objects**: definitions, vocabulary, userAnswers
- **References**: exercises, replies, likes, dislikes

### Enum Fields
- **Role**: student, teacher, admin
- **Level**: beginner, intermediate, advanced
- **Category**: grammar, vocabulary, listening, speaking, reading, writing, general
- **Type**: video, text, interactive, quiz (for lessons)
- **Exercise Type**: multiple-choice, fill-blank, matching, true-false, writing, speaking, listening
- **Status**: not-started, in-progress, completed, failed
- **Language**: en, vi
- **Post Status**: draft, published

## Validation Rules

### Required Fields
- Tất cả models đều có `createdAt`, `updatedAt`
- User: username, email, password, fullName
- Course: title, description, level, category, createdBy
- Lesson: title, description, content, courseId, order, type, createdBy
- Exercise: title, description, type, difficulty, points, lessonId, courseId, createdBy
- Post: title, slug, content, authorId, status

### Unique Constraints
- User: username, email
- Vocabulary: word
- Course: title (có thể thay đổi nếu cần)

### Min/Max Values
- Password: min 6 characters
- Username: min 3, max 30 characters
- Title: max 200 characters
- Description: max 500-1000 characters
- Progress: 0-100%
- Difficulty: 1-5 scale
- Rating: 0-5 scale
 - ReadingTime: min 1 minute

## Performance Considerations

### Indexing Strategy
- Compound indexes cho các query patterns phổ biến
- Index trên foreign keys để tối ưu joins
- Index trên status fields để filter nhanh
 - Index cho `Post.slug` để tra cứu bài viết theo URL

### Query Optimization
- Sử dụng projection để chỉ lấy fields cần thiết
- Pagination cho large datasets
- Aggregation pipelines cho complex queries
 - Sử dụng `lean()` cho các truy vấn Post dạng danh sách

### Caching Strategy
- Redis cache cho user sessions
- Cache cho course metadata
- Cache cho vocabulary lookups
 - Cache danh sách bài viết phổ biến (views cao) và bài viết mới (`publishedAt`)

## Security Features

### Data Protection
- Password hashing với bcrypt
- JWT tokens cho authentication
- Role-based access control
- Input validation và sanitization

### Privacy
- User data encryption (có thể thêm)
- GDPR compliance (có thể thêm)
- Data retention policies

## Scalability

### Horizontal Scaling
- MongoDB sharding cho large datasets
- Load balancing cho API servers
- CDN cho static content

### Vertical Scaling
- Database connection pooling
- Memory optimization
- Query performance tuning
