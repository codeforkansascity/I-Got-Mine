# I-Got-Mine Preview and Production Deployment Process

The safest workflow is to treat the original repository as the authoritative source and use `I-Got-Mine-preview` only to publish a review copy.

That distinction is important:

```text
Original repository
codeforkansascity/I-Got-Mine
├── gh-pages       Current production
└── gh-pages-v2    New version being developed

Preview repository
codeforkansascity/I-Got-Mine-preview
└── preview-site   Deployment copy with CNAME removed
```

Do not develop independently in the preview repository.

Make changes on `gh-pages-v2` in the original repository, then merge them into the preview deployment branch. After approval, merge `gh-pages-v2` into production.

## Current Local State

- Current branch: `fixed`
- It started from production `gh-pages`
- Four repaired files are uncommitted
- Production remote: `origin`
- `CNAME` currently contains `igotmineinkc.org`

---

## 1. Commit the Repaired Version

From Terminal:

```bash
cd /Users/paulbarham/Projects/code4kc/I-Got-Mine
git status
```

You should see:

```text
modified: index.html
modified: js/l10n.js
modified: js/somemap.js
untracked: js/sheets.js
```

Rename the current `fixed` branch to the more descriptive `gh-pages-v2`:

```bash
git branch -m gh-pages-v2
```

Stage the repaired files:

```bash
git add index.html js/l10n.js js/somemap.js js/sheets.js
```

Review what will be committed:

```bash
git diff --cached --stat
git status
```

Commit it:

```bash
git commit -m "Repair Google Sheets and map integrations"
```

Push the development branch to the original repository:

```bash
git push -u origin gh-pages-v2
```

At this point:

- `origin/gh-pages` remains unchanged and continues serving production.
- `origin/gh-pages-v2` contains the proposed new version.
- `gh-pages-v2` still contains the production `CNAME`, which is correct because it is in the original repository and is not yet the active Pages branch.

You can verify it:

```bash
git show gh-pages-v2:CNAME
```

Expected output:

```text
igotmineinkc.org
```

---

## 2. Create the Preview Repository

Someone with permission to create repositories in the Code for Kansas City organization should:

1. Open:
   <https://github.com/organizations/codeforkansascity/repositories/new>
2. Set the repository name to:
   `I-Got-Mine-preview`
3. Make it public.
4. Do not add a README.
5. Do not add a `.gitignore`.
6. Do not add a license.
7. Click **Create repository**.

Creating it empty is important because it avoids introducing an unrelated initial commit.

---

## 3. Add the Preview Repository as Another Remote

Your existing `origin` continues to point to production:

```text
git@github.com:codeforkansascity/I-Got-Mine.git
```

Add the new repository under the remote name `preview`:

```bash
git remote add preview git@github.com:codeforkansascity/I-Got-Mine-preview.git
```

Verify both remotes:

```bash
git remote -v
```

You should see something like:

```text
origin   git@github.com:codeforkansascity/I-Got-Mine.git
preview  git@github.com:codeforkansascity/I-Got-Mine-preview.git
```

Do not replace or rename `origin`.

---

## 4. Create the Preview-Only Deployment Branch

Make sure you are on the new-version branch:

```bash
git switch gh-pages-v2
```

Create a separate branch for the preview deployment:

```bash
git switch -c preview-site
```

The branches initially contain identical files, including `CNAME`.

Now remove `CNAME` from only the `preview-site` branch:

```bash
git rm CNAME
git commit -m "Remove production domain from preview deployment"
```

This does not remove `CNAME` from `gh-pages-v2` or production. Git branches keep separate versions of files.

Verify that `CNAME` is absent from the current preview branch:

```bash
git status
ls CNAME
```

The `ls` command should report that `CNAME` does not exist.

Now verify that it still exists in the new-version branch:

```bash
git show gh-pages-v2:CNAME
```

Expected:

```text
igotmineinkc.org
```

Verify that it still exists in production:

```bash
git show gh-pages:CNAME
```

Expected:

```text
igotmineinkc.org
```

The important state is now:

| Branch | CNAME |
|---|---|
| `gh-pages` | Present |
| `gh-pages-v2` | Present |
| `preview-site` | Absent |

---

## 5. Push the Preview Deployment

Push `preview-site` to the preview repository:

```bash
git push -u preview preview-site
```

Notice that the command uses `preview`, not `origin`.

- `preview` is the repository destination.
- `preview-site` is the branch being pushed.

---

## 6. Enable GitHub Pages for the Preview

Open:

<https://github.com/codeforkansascity/I-Got-Mine-preview/settings/pages>

Under **Build and deployment**:

1. Set **Source** to **Deploy from a branch**.
2. Select `preview-site`.
3. Select `/(root)`.
4. Click **Save**.

The preview should become available at:

<https://codeforkansascity.github.io/I-Got-Mine-preview/>

GitHub says a Pages deployment can take up to ten minutes. Watch the preview repository's **Actions** tab for the deployment status.

GitHub Pages publishing documentation:

<https://docs.github.com/en/pages/getting-started-with-github-pages/configuring-a-publishing-source-for-your-github-pages-site>

No DNS changes are needed for this preview address.

---

## 7. Verify That the Preview Did Not Claim Production's Domain

Open the preview repository's Pages settings and confirm the **Custom domain** field is empty.

Also inspect the preview branch on GitHub:

<https://github.com/codeforkansascity/I-Got-Mine-preview/tree/preview-site>

Confirm there is no `CNAME` file.

Then test both sites.

### Production

<https://igotmineinkc.org>

### Preview

<https://codeforkansascity.github.io/I-Got-Mine-preview/>

The production website should remain unchanged.

---

## 8. Make Changes Requested by the Reviewer

Make all requested changes on `gh-pages-v2` in the original repository—not directly on `preview-site`.

Switch back:

```bash
git switch gh-pages-v2
```

Edit and test the files, then commit them:

```bash
git add <files-you-changed>
git commit -m "Address preview review feedback"
git push origin gh-pages-v2
```

Now update the preview deployment branch:

```bash
git switch preview-site
git merge gh-pages-v2
git push preview preview-site
```

Because `CNAME` was deleted and committed on `preview-site`, merging ordinary code changes from `gh-pages-v2` should leave it deleted.

Confirm before every preview push:

```bash
git status
ls CNAME
```

Again, `ls CNAME` should say the file does not exist.

You can also inspect exactly what the next push contains:

```bash
git log --oneline preview/preview-site..preview-site
```

After pushing, wait for the preview Pages deployment to finish and ask the reviewer to refresh the preview site.

Repeat this process as needed:

```text
Change gh-pages-v2
        ↓
Commit and push to origin
        ↓
Merge gh-pages-v2 into preview-site
        ↓
Push preview-site to preview
        ↓
Reviewer checks preview site
```

---

## 9. Record Approval

The reviewer should approve a specific commit, not merely say:

> The website looks good.

Find the approved commit:

```bash
git switch gh-pages-v2
git log --oneline -5
```

Have the reviewer record something like:

```text
Approved gh-pages-v2 commit abc1234 for production.
```

This can be recorded in:

- A pull request review
- A GitHub issue comment
- Your project's normal approval system

A pull request from `gh-pages-v2` into `gh-pages` is the strongest option because it keeps the comparison, discussion, checks, and approval together.

Create that pull request at:

<https://github.com/codeforkansascity/I-Got-Mine/compare/gh-pages...gh-pages-v2>

Set:

```text
base: gh-pages
compare: gh-pages-v2
```

Do not create the production pull request from the preview repository.

---

## 10. Check Whether Production Changed During Review

Before deployment, update your knowledge of the remote repository:

```bash
git fetch origin
```

Check whether anyone changed production while the preview was being reviewed:

```bash
git log --oneline gh-pages-v2..origin/gh-pages
```

If this prints no commits, production has not moved ahead.

If it prints commits, merge the latest production changes into the new version:

```bash
git switch gh-pages-v2
git merge origin/gh-pages
```

Resolve any conflicts, test again, and update the preview:

```bash
git push origin gh-pages-v2

git switch preview-site
git merge gh-pages-v2
git push preview preview-site
```

That updated version should be reviewed again before production deployment.

---

## 11. Create a Production Rollback Point

After approval, update the local production branch:

```bash
git fetch origin
git switch gh-pages
git pull --ff-only origin gh-pages
```

Create a descriptive tag at the currently deployed production commit:

```bash
git tag production-before-v2-2026-08-15
git push origin production-before-v2-2026-08-15
```

The tag preserves an easy-to-identify reference to the old production version.

Confirm the tag:

```bash
git show --stat production-before-v2-2026-08-15
```

---

## 12. Merge the Approved Version into Production

While on `gh-pages`, merge the approved original-repository branch:

```bash
git merge --no-ff gh-pages-v2 -m "Deploy approved v2 repairs"
```

The `--no-ff` option creates a dedicated deployment merge commit. This makes rollback straightforward.

Verify that production still has the custom-domain file:

```bash
cat CNAME
```

Expected:

```text
igotmineinkc.org
```

Check the files going into production:

```bash
git status
git log --oneline --decorate -5
git diff production-before-v2-2026-08-15..HEAD --stat
```

Test locally one final time:

```bash
python3 -m http.server 8000
```

Open:

<http://localhost:8000>

Stop the server with `Ctrl+C`.

Push production:

```bash
git push origin gh-pages
```

GitHub Pages will deploy the new `gh-pages` commit.

Monitor:

<https://github.com/codeforkansascity/I-Got-Mine/actions>

The production URL remains:

<https://igotmineinkc.org>

You do not need to change the production Pages branch setting or DNS.

---

## 13. Roll Back if Necessary

Because the deployment used a merge commit, rollback should use `git revert`.

**Do not use `git reset --hard` or force-push production.**

Find the production merge commit:

```bash
git switch gh-pages
git pull --ff-only origin gh-pages
git log --oneline --merges -5
```

It should have the message:

```text
Deploy approved v2 repairs
```

Copy its commit ID and run:

```bash
git revert -m 1 <merge-commit-id>
```

For example:

```bash
git revert -m 1 abc1234
```

Then push:

```bash
git push origin gh-pages
```

This creates a new commit that reverses the v2 deployment while preserving repository history.

GitHub Pages will redeploy the restored production version.

The `production-before-v2-2026-08-15` tag remains available as an additional reference.

---

## If Someone Accidentally Edits the Preview Repository

Avoid merging `preview/preview-site` wholesale into production because that branch intentionally deletes `CNAME`.

Instead, locate the individual code commits:

```bash
git fetch preview
git log --oneline gh-pages-v2..preview/preview-site
```

You will see the preview-only `CNAME` deletion plus any direct edits.

Cherry-pick only the desired code-edit commit:

```bash
git switch gh-pages-v2
git cherry-pick <code-change-commit-id>
```

Do **not** cherry-pick:

```text
Remove production domain from preview deployment
```

If a desired preview commit also changes `CNAME`, apply it without immediately committing:

```bash
git switch gh-pages-v2
git cherry-pick --no-commit <code-change-commit-id>
git restore --source=HEAD -- CNAME
git add CNAME
git commit -m "Apply reviewed preview changes"
```

Then verify:

```bash
cat CNAME
```

It must still say:

```text
igotmineinkc.org
```

---

## Key Rule

**Production merges from `gh-pages-v2`; the preview repository is only a deployment mirror.**

This prevents the preview repository's deliberate `CNAME` deletion from reaching production.
