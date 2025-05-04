# Compatibility Checker 📝

Next‑JS + Tailwind CSS app that evaluates résumé ↔ job‑description compatibility, powered by **Ollama** running the *deepseek‑r1* model. Everything ships in one Docker Compose stack.

---

## Quick start

```bash
# clone and enter the project
git clone https://github.com/your‑org/compatibility‑checker.git
cd compatibility‑checker

# build images + pull deepseek‑r1:1.5b on first run
docker compose up -d --build

# watch the model download progress (first run only)
docker compose logs -f ollama

# open the app
open http://localhost:3000      # macOS
xdg-open http://localhost:3000  # Linux/Windows (or open manually)
```

*First boot downloads \~1 GB; later boots are instant because the model remains cached in the `ollama-data` volume.*

### Stop & clean

```bash
docker compose down       # stop containers (keep cache)
docker compose down -v    # also remove cached model & volume
```
