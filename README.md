# Test site for Scout checks

A throwaway site for checking Scopeout's Scout end to end: a pull request, its check, the merge, the deploy and
the live page. Shipwatch is made up; nothing here is a real product, and the analytics on the page keep their
events in the page (nothing is sent).

- `index.html`: the home page, with the waitlist button, the "How it works" sentence and the film (a frame,
  far down the page, counted as `film_played` when focus moves into it).
- `pricing.html`: the second page.
- `film/player.html`: the film inside the frame (Play with sound, Video controls, Full screen).
- `.github/workflows/check.yml`: the pull-request check (`node scripts/check-site.mjs`).
- `.github/workflows/deploy.yml`: every push to `main` deploys to GitHub Pages.

Delete the repository when the checks are done; that also frees the Pages address.
