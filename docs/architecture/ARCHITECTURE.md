# FIFACoOS - System Architecture Document

## 1. Document Information
- **Version:** 1.0
- **Status:** Approved (Frozen)
- **Author:** Principal Architecture Team
- **Last Updated:** Architecture Synchronization Review
- **Depends On:** None
- **Supersedes:** None

## 2. Architecture Overview
FIFACoOS is a web-based, AI-enabled operational platform. The architecture follows a server-first, modular monolith pattern designed to cleanly separate presentation, business logic, artificial intelligence processing, and data ingestion. By treating the AI reasoning engine as an independent, loosely coupled subsystem, the architecture ensures that the platform remains highly deterministic and reliable while leveraging Generative AI strictly for complex synthesis and decision support.

## 3. Architectural Goals
- **Separation of Concerns:** Distinct boundaries between UI, domain logic, and AI reasoning.
- **Modularity:** Features are organized by domain (e.g., Incident Management, Wayfinding) to allow independent scaling and maintenance.
- **Testability:** Pure functions for domain logic and abstracted interfaces for AI, enabling high unit test coverage without relying on live LLM calls.
- **Security:** Strict boundary enforcement between anonymous public access (Fans) and authenticated operational access (Staff/Security).
- **Maintainability:** Code structured so that a new engineer can understand the request flow within hours.
- **Accessibility:** Architectural support for multilingual and accessible UIs from day one.

## 4. Guiding Principles
- **Deterministic First:** Use traditional, deterministic algorithms for routing, authentication, and state management. Reserve AI strictly for natural language understanding, synthesis, and decision recommendations.
- **Secure by Default:** All operational endpoints require authentication and authorization. Fan endpoints expose strictly non-sensitive data.
- **Single Responsibility Principle (SRP):** Each module or service handles one specific domain concern.
- **Dependency Inversion:** High-level policy (domain) should not depend on low-level details (database or specific LLM provider). Both should depend on abstractions.
- **Graceful Degradation:** The UI must function (e.g., display static maps and emergency contacts) even if the AI subsystem experiences an outage.

## 5. High-Level System Architecture
The system employs a layered architecture:
1. **Presentation (UI) Layer:** Renders the user interface. Responsible for state management at the client level and accessible HTML.
2. **Application (API) Layer:** Handles HTTP requests, enforces authentication (RBAC), validates input, and orchestrates domain services.
3. **Domain Layer:** Contains core business logic, policies, and operational rules. Completely independent of framework specifics.
4. **AI Subsystem Layer:** A specialized layer responsible for context retrieval, prompt construction, LLM execution, and output validation.
5. **Data & Infrastructure Layer:** Manages persistence, state stores, and external API simulations (telemetry).

*Rationale:* A layered architecture provides clear boundaries.
*Benefits:* Easy to test layers independently; swapping technologies (e.g., changing the database or LLM provider) requires minimal changes to the domain.
*Trade-offs:* Slight overhead in mapping data objects between layers compared to a tightly coupled architecture.

## 6. Major System Components
- **Fan Interface:** Mobile-optimized, anonymous entry point.
- **Ops Command Center:** Desktop-optimized, authenticated dashboard for real-time visualization.
- **Unified Intelligence Engine (UIE):** The central AI processing module handling all natural language requests and contextual synthesis.
- **Simulated Telemetry Engine:** Ingests and provides mock data (crowd density, queues, incidents) to simulate real-world stadium sensors.

## 7. User Roles & Entry Points
- **Fans:** Enter via a mobile web route. Unauthenticated. Access limited to public context (wayfinding, generic policies).
- **Venue Staff & Managers:** Enter via desktop web route. Authenticated (RBAC). Access to crowd density and staff deployment recommendations.
- **Volunteers & Security:** Enter via mobile/desktop routes. Authenticated. Access to policy knowledge base and emergency protocols.

## 8. Request Lifecycle
1. **Client Request:** User asks a question (e.g., "Where is the nearest medical tent?").
2. **Gateway / API:** Request is received, input is validated (Zod), and auth is checked (if applicable).
3. **Service Orchestration:** The API routes the request to the Unified Intelligence Engine.
4. **AI Processing:** UIE gathers context, prompts the LLM, and parses the response.
5. **Validation:** The AI output is validated against expected schemas to prevent malformed UI rendering.
6. **Response:** Data is returned to the client and rendered.

## 9. AI Reasoning Pipeline
The AI is treated as an independent, isolated subsystem.

- **Context Gathering:** 
  - *Action:* Fetching current stadium state, user role, and location. 
  - *Why AI/Deterministic:* **Deterministic**. The database/state store strictly defines the current reality.
- **Prompt Construction:** 
  - *Action:* Assembling the context, system instructions, and user query into a secure prompt.
  - *Why AI/Deterministic:* **Deterministic**. Prompts must be predictably structured to prevent injection.
- **AI Reasoning (LLM Invocation):** 
  - *Action:* Sending the prompt to the Generative AI model to synthesize information and generate a recommendation.
  - *Why AI/Deterministic:* **AI**. Generating natural language, summarizing unstructured incident reports, and inferring intent requires semantic understanding.
- **Recommendation Generation:** 
  - *Action:* The AI outputs structured data (JSON) representing its decision support alongside a natural language explanation.
- **Response Validation:** 
  - *Action:* Validating the AI's JSON output strictly matches the required schema.
  - *Why AI/Deterministic:* **Deterministic**. We cannot trust the AI output implicitly. If the output fails validation, the system falls back to a safe default.
- **User Presentation:** 
  - *Action:* Sending the validated response to the UI.

*Rationale:* This pipeline isolates the non-deterministic nature of AI between strict deterministic boundaries (Context Gathering and Response Validation).

## 10. Data Flow
- **Telemetry Flow:** Simulated sensors -> Simulated Telemetry Engine -> Central State Store.
- **User Flow:** Client UI -> API Layer -> Domain/AI Layer -> reads from Central State Store -> Response.
- *Security Note:* Fan requests to the State Store are filtered at the API layer to exclude sensitive operational telemetry.

## 11. Core Domain Modules
- **Identity & Access Management (IAM):** Handles RBAC for staff and volunteers.
- **Stadium Operations (Ops):** Manages queues, crowd densities, and incident reports.
- **Wayfinding & Navigation:** Manages points of interest (POIs) and routing logic.
- **Policy & Knowledge:** Manages standard operating procedures (SOPs) and FAQs.

## 12. Cross-Cutting Concerns
- **Logging & Observability:** All requests, especially AI interactions, are logged with correlation IDs. AI prompts and responses must be logged for auditing (stripping PII).
- **Localization (i18n):** User interfaces and AI prompts are injected with the user's selected locale (EN, ES, FR, HI).
- **Telemetry:** Application performance monitoring (APM) to track LLM latency and UI render times.

## 13. Security Architecture
- **Authentication:** JWT or session-based auth for operational roles.
- **Authorization:** Strict RBAC enforced at the API route level.
- **AI Security (Prompt Injection):** User input is sanitized. System prompts heavily constrain the AI's role ("You are a stadium operational assistant..."). The AI is granted zero execution authority.
- **Data Segregation:** The AI context-gathering phase for a Fan query is strictly denied access to security incident data.

## 14. Error Handling Philosophy
- **Client-Side:** Never expose internal stack traces or LLM error messages to the user. Show contextual, localized error states.
- **Server-Side:** Catch exceptions at the boundary. Use standard HTTP status codes.
- **AI-Side:** If the LLM times out or hallucinates (fails validation), the system catches the error and returns a predefined deterministic fallback (e.g., "I'm having trouble connecting to live data. Please proceed to the nearest Information Desk.").

## 15. Observability & Logging Philosophy
- Use structured logging (JSON format).
- Track `ai_latency`, `token_usage`, and `validation_failures` as core system metrics.

## 16. Performance Considerations
- **Streaming:** Where possible, AI text responses should be streamed to the client to reduce perceived latency.
- **Caching:** Static queries (e.g., "What time does the stadium open?") should bypass the LLM and hit a deterministic cache.
- **Edge Computing:** UI assets and static configurations should be served via CDN.

## 17. Scalability Strategy
- The application layer must be entirely stateless, allowing horizontal scaling.
- The Simulated Telemetry Engine operates asynchronously to prevent blocking the main request threads.
- The AI Subsystem is designed to handle API rate limits gracefully with backoff strategies.

## 18. Accessibility Considerations
- **UI Architecture:** Built using semantic HTML and headless accessible components.
- **State Management:** Focus management is handled globally for dynamic AI responses (e.g., moving focus to the AI response when it finishes generating).
- **Routing:** Wayfinding logic requires an `accessible: boolean` flag in the domain model to ensure wheelchair-friendly routing.

## 19. Future Extensibility
- **Provider Agnostic:** The AI subsystem depends on an `AIGateway` interface, not a specific SDK (e.g., OpenAI, Gemini), allowing easy swapping.
- **Sensor Plugins:** The Telemetry ingestion layer uses a standard data contract, allowing real cameras and turnstiles to replace simulated generators without domain changes.

## 20. Architecture Constraints
- **Time/Scope (MVP):** Complex event-driven architectures (like Kafka) are excluded in favor of simpler synchronous API calls and state polling to ensure project delivery.
- **Simulation Limits:** Data generation will run on a deterministic cron/interval rather than a complex physics engine to save engineering cycles.

## 21. Risks & Trade-offs
- **Trade-off:** Using real-time LLM generation for Fan queries vs. pre-computed decision trees. 
  - *Decision:* We use LLMs to handle complex, multi-intent queries, but trade off raw speed. We mitigate this via streaming.
- **Risk:** LLM hallucinating a dangerous route during an emergency.
  - *Mitigation:* The AI is strictly barred from answering emergency routing questions dynamically. Emergency intents trigger a deterministic SOP override.

## 22. Architecture Review Checklist
*Self-Review performed by Principal Architect:*

- [x] **Architectural Strengths:** Strong separation of AI from deterministic logic. Clear boundaries ensuring security between Fans and Ops. Highly testable.
- [x] **Potential Weaknesses:** Relying on polling for dashboard updates may not scale to millions of users, though sufficient for an MVP and easily upgradable to WebSockets later.
- [x] **Areas Intentionally Deferred:** Specific UI framework selection, Database schema, API definitions, and folder structures.
- [x] **PRD Consistency:** Confirmed. Matches MVP scope, user roles, simulated data approach, and AI decision support constraints defined in the PRD.
