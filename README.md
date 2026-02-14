# School Interior Rules Chatbot Website

A lightweight chatbot website you can host on **GitHub Pages**. It answers questions about school interior rules in the browser (no backend needed).

## Files

- `index.html` – page structure
- `styles.css` – visual styling
- `app.js` – chatbot logic and Excel/CSV import
- `rules-template.csv` – Excel-compatible template for your rules

## Run locally

Use any static web server. Example with Python:

```bash
python -m http.server 8000
```

Then open `http://localhost:8000`.

## Deploy to GitHub Pages

1. Push this repository to GitHub.
2. Go to **Settings → Pages**.
3. Set source to your main branch (root folder).
4. Save and wait for deployment.

## Use your rules from Excel

1. Download `rules-template.csv`.
2. Open it in Excel and edit/add rows.
3. Keep these column names exactly:
   - `title`
   - `keywords` (comma-separated)
   - `answer`
4. Save as `.xlsx` (or keep `.csv`).
5. Upload the file in the website under **Load Rules from Excel**.

When you share your real school rules, I can also pre-fill them for you.
