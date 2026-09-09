#!/usr/bin/env bash
# Publishes or removes one directory of the gh-pages branch that serves
# https://atechaccount.github.io/CSS-Grid-Game/.
#
# The production site lives at the branch root and every same-repository pull request
# preview lives under pr-preview/pr-<number>/, so each publish rewrites only its own
# directory and leaves the others untouched.
#
# Environment:
#   PAGES_TARGET_SUBDIRECTORY  Directory inside gh-pages to rewrite. Empty means the
#                              production root, which never touches pr-preview/.
#   PAGES_SOURCE_DIRECTORY     Built site to copy in. Empty means delete the target
#                              subdirectory instead of publishing anything.
#   PAGES_COMMIT_MESSAGE       Commit message for the gh-pages commit.
#
# Requires a checkout whose credentials can push (actions/checkout persist-credentials).
set -euo pipefail

target_subdirectory="${PAGES_TARGET_SUBDIRECTORY:-}"
source_directory="${PAGES_SOURCE_DIRECTORY:-}"
commit_message="${PAGES_COMMIT_MESSAGE:?PAGES_COMMIT_MESSAGE is required}"

if [ -z "$source_directory" ] && [ -z "$target_subdirectory" ]; then
  echo "publish-gh-pages-directory: refusing to delete the production root" >&2
  exit 1
fi

if [ -n "$source_directory" ] && [ ! -d "$source_directory" ]; then
  echo "publish-gh-pages-directory: source directory not found: $source_directory" >&2
  exit 1
fi

source_directory_absolute=""
if [ -n "$source_directory" ]; then
  source_directory_absolute="$(cd "$source_directory" && pwd)"
fi

git config user.name "github-actions[bot]"
git config user.email "41898282+github-actions[bot]@users.noreply.github.com"

# Rewrite the target directory of a fresh gh-pages checkout and push it. Rerun on a
# rejected push so a concurrent publish is merged by re-reading the branch, never forced.
publish_attempt() {
  local worktree_directory
  worktree_directory="$(mktemp -d)"

  local start_point
  if git fetch --depth=1 origin gh-pages 2>/dev/null; then
    start_point="FETCH_HEAD"
  else
    echo "gh-pages branch does not exist yet; starting from an empty tree"
    start_point="$(git commit-tree "$(git hash-object -t tree /dev/null)" -m "Initialize gh-pages")"
  fi

  git worktree add --detach "$worktree_directory" "$start_point" >/dev/null

  local exit_code=0
  (
    cd "$worktree_directory"

    if [ -z "$source_directory_absolute" ]; then
      rm -rf "${worktree_directory:?}/$target_subdirectory"
    elif [ -n "$target_subdirectory" ]; then
      rm -rf "${worktree_directory:?}/$target_subdirectory"
      mkdir -p "$target_subdirectory"
      cp -R "$source_directory_absolute/." "$target_subdirectory/"
    else
      # Production root: replace everything except git metadata and the previews.
      find . -mindepth 1 -maxdepth 1 \
        ! -name .git ! -name pr-preview \
        -exec rm -rf {} +
      cp -R "$source_directory_absolute/." .
    fi

    # Serve the built files verbatim instead of running them through Jekyll.
    touch .nojekyll

    git add --all
    if git diff --cached --quiet; then
      echo "gh-pages is already up to date; nothing to publish"
      exit 0
    fi

    git commit --quiet --message "$commit_message"
    git push origin HEAD:gh-pages
  ) || exit_code=$?

  git worktree remove --force "$worktree_directory"
  return "$exit_code"
}

for attempt in 1 2 3; do
  if publish_attempt; then
    exit 0
  fi
  echo "gh-pages publish attempt $attempt failed; retrying against the latest branch" >&2
  sleep $((attempt * 5))
done

echo "publish-gh-pages-directory: could not publish after 3 attempts" >&2
exit 1
