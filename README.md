# Plan B Validator

A production-quality, multi-step career change validation wizard. It collects, sanitizes, and stress-tests transition conditions against real-life risk vectors, financial runways, and profile suitability, powered by active web research models and reasoning layers.

---

## 🛠️ System Configuration

The application is built with a React/Vite front-end proxied through an Express back-end to shield secrets and communicate securely.

### Server Routing & Environment Variable
To configure the target analytical engine api address, define the following variables in your local `.env` or system environment declarations:

```env
# Base URL for the upstream Plan B Validator REST API service
PLANB_API_URL="https://lymphangial-sharika-rockingly.ngrok-free.dev"
```

The Express server in `server.ts` will parse this variable and automatically proxy all client operations to avoid browser CORS/ngrok blocks by appending standard compatibility headers:
*   `ngrok-skip-browser-warning: "true"`

---

## 📋 Comprehensive Wizard Progression

The wizard contains **7 distinct configuration screens** followed by a finalized simulation dashboard:

1.  **Professional Profile**: Captures current industry, title chapter, years of experience, and geographical positioning. Supports selective bypass logic if loading a PDF resume on Step 6.
2.  **Financial Resilience**: Gathers monthly corporate income, savings limits, and liquid buffers. Performs immediate live calculations and assessments of career runways.
3.  **The Proposed Plan B**: Prominently manages alternative targets, timeline projections, expected monthly income progression steps (3m, 6m, 12m), and differentiates between a full resignation ("Quit") and side hustles.
4.  **Boundaries & Constraints**: Defines custom standards for success, maximum acceptable downsides, and assesses external family pressure metrics.
5.  **Stress Personality Index**: Fetches 10 dynamic psychological Likert scale metrics assessing ambiguity and financial stamina.
6.  **CV Attachments & Search**: Allows PDF resume upload (up to 10MB) and toggles active upstream web salary research.
7.  **Review & Confirm**: A rigid summary table listing every user value clearly. Flags soft indicators in amber and prevents submission if hard constraints are violated.

---

## 🔍 Validation Safeguards (Client-Side)

Our local compiler validates every input field against strict schema criteria prior to transit:
*   **Profile**: Blocked if required entries are empty (unless resume-skip option is toggled). Warns if experience exceeds 50 years.
*   **Financials**: Expenses must be strictly greater than 0. Warns if expenses or savings exceed reported income, or if liquid cash is zero.
*   **Roadmap Projections**: expected Month 12 income must exceed or equal preceding milestones. Warns if timeline is extremely aggressive (under 3 months for full quittings).
*   **Goal Deltas**: Warns if minimum salary target is higher than projects at Month 12.
*   **File Constraints**: Rejects resume attachments greater than 10 MB or featuring formats other than PDF.
