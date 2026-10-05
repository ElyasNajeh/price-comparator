# Price Comparator

Price Comparator is a small web application that searches Amazon and AliExpress listings and presents their prices in one responsive interface.

## Features

- Product search across Amazon and AliExpress
- Results sorted by price with store, rating, and product image details
- USD, ILS, and EUR display currencies
- Optional spelling suggestions and popular searches
- Partial results when one product provider is unavailable
- Responsive loading, empty, validation, and error states

## Technologies & Tools

- **HTML, CSS, and JavaScript:** Dependency-free frontend and responsive interface.
- **Python and FastAPI:** Backend API, input validation, and CORS handling.
- **Requests and python-dotenv:** External requests and backend-only environment configuration.
- **RapidAPI:** Access to Real-Time Amazon Data and AliExpress DataHub.
- **Frankfurter and LanguageTool:** Public currency conversion and spelling-assistance APIs.

## Prerequisites

- Git and Python 3.10 or newer
- RapidAPI subscriptions for Real-Time Amazon Data and AliExpress DataHub

## Environment Variables

- `AMAZON_API_KEY` — RapidAPI key used for Real-Time Amazon Data.
- `ALIEXPRESS_API_KEY` — RapidAPI key used for AliExpress DataHub.
- `ALLOWED_ORIGINS` — Optional comma-separated frontend origins. Defaults to the local frontend addresses on port `5500`.

## Getting Started

```powershell
git clone https://github.com/ElyasNajeh/price-comparator.git
cd price-comparator\PriceComparatorAPI
python -m venv .venv
.\.venv\Scripts\python.exe -m pip install -r requirements.txt
Copy-Item .env.example .env
```

Add the two RapidAPI keys to `PriceComparatorAPI/.env`, then start the application:

```powershell
.\.venv\Scripts\python.exe -m uvicorn main:app --reload
```

Open `http://127.0.0.1:8000`. FastAPI serves both the application and its API. For separate frontend development, port `5500` remains allowed through CORS.

## Project Structure

```text
PriceComparatorAPI/   FastAPI app, provider integrations, and Python dependencies
PriceComparatorUI/    Static frontend, organized into UI, service, and style modules
.gitignore            Repository-wide local and generated-file exclusions
```
## Contributors

- [Elyas Najeh](https://github.com/ElyasNajeh)
- [Hareth Shoman](https://github.com/hareth5)

