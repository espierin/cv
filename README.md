# Weekly Pure activities sync

This package adds a separate GitHub Actions workflow for public activities only.

## Files

- `scripts/fetch-pure-activities.mjs`
- `pure-activities-config.json`
- `.github/workflows/update-pure-activities.yml`
- `activities.json`

## Schedule

The workflow runs weekly on Sunday at 05:23 UTC:

```yaml
cron: "23 5 * * 0"
```

That is 07:23 during Dutch summer time and 06:23 during Dutch winter time.

It can also be run manually through:

**Actions → Refresh Pure activities → Run workflow**

## Discovery strategy

The script uses several best-effort sources:

1. previously known URLs already stored in `activities.json`;
2. manually configured seed URLs;
3. public sitemap URLs, when available;
4. Bing's RSS search results as an optional fallback.

It then requests only public UMC Utrecht Pure activity pages, waits between requests, checks `robots.txt`, and does not bypass a 403 response.

## Important limitation

This is not an official Pure API integration. `activities.json` is therefore a best-effort reconstruction. Completeness depends on the portal sitemap and search-engine indexing.

For guaranteed completeness, use a Pure export or an institutionally issued Pure API key.

## First run

1. Upload all files while preserving the folders.
2. Open GitHub Actions.
3. Select **Refresh Pure activities**.
4. Run it manually on `main`.
5. Inspect the generated `activities.json`.

Add any missing public activity URLs to `seedActivityUrls` in `pure-activities-config.json`. Those URLs will be retained and checked on all future runs.
