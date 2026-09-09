#!/usr/bin/env bash
# Posts the pull request preview comment, or edits the existing one in place so a pull
# request never collects a comment per push.
#
# Environment:
#   GH_TOKEN             Token with pull-requests: write.
#   PULL_REQUEST_NUMBER  Pull request to comment on.
#   COMMENT_BODY         Comment markdown, including the marker below.
set -euo pipefail

pull_request_number="${PULL_REQUEST_NUMBER:?PULL_REQUEST_NUMBER is required}"
comment_body="${COMMENT_BODY:?COMMENT_BODY is required}"

# Identifies the one comment this workflow owns on a pull request.
preview_comment_marker="<!-- skydock-pull-request-preview -->"

existing_comment_id="$(
  gh api --paginate "repos/${GITHUB_REPOSITORY}/issues/${pull_request_number}/comments" \
    --jq "[.[] | select(.body | contains(\"${preview_comment_marker}\")) | .id] | first // empty"
)"

if [ -n "$existing_comment_id" ]; then
  gh api --method PATCH "repos/${GITHUB_REPOSITORY}/issues/comments/${existing_comment_id}" \
    --field "body=${comment_body}" >/dev/null
  echo "Updated preview comment ${existing_comment_id}"
else
  gh api --method POST "repos/${GITHUB_REPOSITORY}/issues/${pull_request_number}/comments" \
    --field "body=${comment_body}" >/dev/null
  echo "Created preview comment"
fi
