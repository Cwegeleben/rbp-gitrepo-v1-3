# RBP portable backups (.bundle)

This folder contains git bundle archives: single-file backups of the repository, including history, branches, and tags.

## Restore a backup (recommended)

1) Clone from the bundle into a new directory

```bash
# Replace with the bundle you want to restore
git clone backups/rbp-gitrepo-v1-3-YYYY-MM-DD[-HHMMSS].bundle rbp-gitrepo-restored
cd rbp-gitrepo-restored
```

2) (Optional) Reattach to the GitHub remote and checkout main

```bash
git remote add origin git@github.com:Cwegeleben/rbp-gitrepo-v1-3.git
git fetch origin
git checkout main
```

You can also checkout a specific tag from the bundle:

```bash
git checkout tags/v1.3.0-snapshot-2025-09-20 -b release/1.3.x
```

## Verify a bundle

```bash
# Ensure the bundle is valid and list refs
git bundle verify backups/rbp-gitrepo-v1-3-YYYY-MM-DD[-HHMMSS].bundle
```

To list the heads/tags inside the bundle:

```bash
git bundle list-heads backups/rbp-gitrepo-v1-3-YYYY-MM-DD[-HHMMSS].bundle
```

## Create a new bundle backup (from repo root)

```bash
STAMP=$(date +%Y-%m-%d-%H%M%S)
FILE="backups/rbp-gitrepo-v1-3-${STAMP}.bundle"
mkdir -p backups
# Include all refs (branches + tags)
git bundle create "$FILE" --all
# Sanity check
git bundle verify "$FILE"
```

## Notes
- Bundles are portable files you can copy off-machine (USB, cloud, etc.).
- To keep the repo lean, consider pruning older bundles periodically.
- If you intend to push restored work back to GitHub, set the `origin` remote (see above).
