# SmartLibrary refactor - what changed and how to run it

This extends your existing project rather than replacing it. Summary of the work:

## Backend (`backend-server/library`)
- Split the single `LibraryController` into `AuthController`, `BookController`,
  `CategoryController`, `ExchangeController`, `ReadingListController`, `AiController`,
  each backed by a `service/` class (`AuthService`, `BookService`, `ExchangeService`,
  `ReadingListService`, `service/ai/AiService` + `GroqService`).
- Added `dto/` (request/response shapes - e.g. `UserResponse` never leaks the password)
  and `exception/` (`ApiException` + a `@RestControllerAdvice` for consistent error JSON).
- **New AI endpoints**, all under `/api/ai`:
  - `GET /api/ai/recommendations?userId=&limit=` - recommends books based on the
    user's reading list, using Groq when a key is configured, and a
    category-similarity fallback when it isn't (so the app still works without a key).
  - `POST /api/ai/translate` - translates a book's summary (by `bookId`) or raw text
    into `targetLanguage`.
  - `POST /api/ai/chat` - chatbot endpoint; conversation history is persisted in
    `chat_messages` so context carries across turns.
- **New Book Exchange messaging**: `GET/POST /api/exchanges/{id}/messages`.
- **Fixed pre-existing bugs**: the frontend was already calling `/api/wishlist` and
  `PUT /api/requests/approve/{id}`, but neither existed on the backend - both are now
  implemented (`ReadingListController`, `ExchangeController#approve`). The `Exchange`
  entity's fields were also widened to match what the exchange form actually submits
  (`bookTitleHave`/`bookTitleWant` instead of a single `bookTitle`).
- CORS previously disagreed between `WebConfig` (:5173) and `LibraryController`'s
  `@CrossOrigin` (:5174) - now a single `app.cors.allowed-origins` property.
- Uploaded PDFs are now served at `/uploads/<filename>` (added a resource handler),
  so the new PDF reader modal can actually load them.

### Configure the Groq key
```
export GROQ_API_KEY=gsk_...
```
`groq.model` defaults to `llama-3.3-70b-versatile` (see `application.properties`).
Groq exposes an OpenAI-compatible API, so the request/response handling in
`GroqService` is nearly identical to a plain OpenAI integration - only the base
URL, auth header, and model name differ. Without a key set, recommendations/
translation/chat still respond, just with simple fallbacks instead of real AI
output - useful for running the rest of the app without billing.

### Known TODO (flagged, not fixed, per your call)
Login/register compare plain-text passwords and return no session token. See the
`TODO` comments in `AuthService` - swap in `BCryptPasswordEncoder` + JWT before any
real deployment.

## Database
- `sql/schema.sql` - full reference schema for a clean install.
- `sql/migration_v2.sql` - incremental ALTERs to bring your existing
  `dump-smart_library-*.sql` database up to date (new `exchange_messages`,
  `reading_list`, `chat_messages` tables + widened `exchanges` columns).
- Since `spring.jpa.hibernate.ddl-auto=update` is already on, Hibernate will also
  create/adjust these automatically the next time the backend boots - the SQL files
  are for review/manual environments.

## Frontend (`library-frontend`)
- Added Tailwind (was listed in your stack but not wired in) - `tailwind.config.js`,
  `postcss.config.js`, directives in `index.css`. New components use Tailwind
  classes; older ones still use inline styles - both work together fine.
- `src/services/apiClient.js` - one axios instance (base URL from
  `VITE_API_BASE_URL`, defaults to `localhost:8080`) instead of hardcoding
  `http://localhost:8080` in every component.
- `src/services/aiService.js` + `src/components/ai/`:
  - `ChatbotWidget.jsx` - floating chat button, mounted once in `DashboardLayout`.
  - `RecommendationsPanel.jsx` - "Recommended for you" strip on `UserDashboard`.
  - `TranslateSummary.jsx` - language picker + translate button, dropped into the
    Discover quick-view modal.
- `src/components/books/PdfReaderModal.jsx` - full-screen reader mode (toolbar with
  open-in-new-tab/download/close), wired into `UserDashboard`'s "Read Pdf" button.
- `src/components/exchange/ExchangeMessages.jsx` - message thread per exchange
  listing, wired into `BookExchangeContent`.
- Landing page nav/section renamed `features` -> `AI Tools` (Home / AI Tools /
  Categories / Contact, per the brief) with a real description of what's behind
  the login wall.
- Fixed the reading-list/wishlist and admin-approval components to call the
  endpoints above with the required `userId`, instead of failing silently.

## Running it
```
# backend
cd backend-server/library
export GROQ_API_KEY=gsk_...   # optional
./mvnw spring-boot:run

# frontend
cd library-frontend
npm install
npm run dev
```
