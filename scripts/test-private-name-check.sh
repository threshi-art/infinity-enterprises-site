#!/usr/bin/env bash
# Test harness for private-name-check workflow logic
# Tests secret presence detection, scanning behavior, and injection safety

set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
TEST_DIR="$(mktemp -d)"
trap "rm -rf '$TEST_DIR'" EXIT

echo "=== Private Name Check Test Harness ==="
echo "Test directory: $TEST_DIR"
echo

# Test 1: Secret presence detection
echo "Test 1: Secret presence detection"
echo "-----------------------------------"

# Simulate missing secret
unset SECRET_VALUE
if [ -n "${SECRET_VALUE:-}" ]; then
  SECRET_PRESENT=true
else
  SECRET_PRESENT=false
fi
if [ "$SECRET_PRESENT" = "false" ]; then
  echo "✓ Missing secret detected correctly (secret_present=false)"
else
  echo "✗ FAIL: Missing secret not detected"
  exit 1
fi

# Simulate present secret
SECRET_VALUE="DUMMYNAME"
if [ -n "${SECRET_VALUE:-}" ]; then
  SECRET_PRESENT=true
else
  SECRET_PRESENT=false
fi
if [ "$SECRET_PRESENT" = "true" ]; then
  echo "✓ Present secret detected correctly (secret_present=true)"
else
  echo "✗ FAIL: Present secret not detected"
  exit 1
fi
echo

# Test 2: File path scanning
echo "Test 2: File path scanning"
echo "--------------------------"

cd "$TEST_DIR"
git init -q
git config user.email "test@example.com"
git config user.name "Test User"

touch file1.txt
git add file1.txt
git commit -q -m "Initial commit"
git branch main
git checkout -q -b test-branch

# Create file with protected name in path
mkdir -p src
touch "src/DUMMYNAME_config.js"
git add "src/DUMMYNAME_config.js"
git commit -q -m "Add config file"

# Test scanning logic
PROTECTED_NAMES="DUMMYNAME|TESTNAME"

MATCHES=$(mktemp)
git diff --name-only main...HEAD | while read -r file; do
  IFS='|' read -ra NAMES <<< "$PROTECTED_NAMES"
  for name in "${NAMES[@]}"; do
    name_trimmed="${name#"${name%%[![:space:]]*}"}"
    name_trimmed="${name_trimmed%"${name_trimmed##*[![:space:]]}"}"
    if [ -n "$name_trimmed" ]; then
      if printf '%s\n' "$file" | grep -qiF -- "$name_trimmed"; then
        echo "  Found protected name in path: $file"
        echo "1" > "$MATCHES"
      fi
    fi
  done
done

if [ -f "$MATCHES" ] && [ "$(cat "$MATCHES")" = "1" ]; then
  echo "✓ File path scanning detected protected name"
  rm "$MATCHES"
else
  echo "✗ FAIL: File path scanning missed protected name"
  rm -f "$MATCHES"
  exit 1
fi
echo

# Test 3: File content scanning
echo "Test 3: File content scanning"
echo "-----------------------------"

echo "const author = 'DUMMYNAME';" > src/author.js
git add src/author.js
git commit -q -m "Add author"

MATCHES=$(mktemp)
current_file=""
line_number=0

git diff -U0 main...HEAD | while IFS= read -r line; do
  if [[ "$line" =~ ^diff\ --git ]]; then
    current_file=$(printf '%s\n' "$line" | sed 's|^diff --git a/\(.*\) b/.*|\1|')
  elif [[ "$line" =~ ^@@\ -[0-9,]*\ \+([0-9]+) ]]; then
    line_number="${BASH_REMATCH[1]}"
  elif [[ "$line" =~ ^[\+] ]] && [[ ! "$line" =~ ^\+\+\+ ]]; then
    IFS='|' read -ra NAMES <<< "$PROTECTED_NAMES"
    for name in "${NAMES[@]}"; do
      name_trimmed="${name#"${name%%[![:space:]]*}"}"
      name_trimmed="${name_trimmed%"${name_trimmed##*[![:space:]]}"}"
      if [ -n "$name_trimmed" ]; then
        if printf '%s\n' "$line" | grep -qiF -- "$name_trimmed"; then
          echo "  Found protected name in: $current_file:$line_number"
          echo "1" > "$MATCHES"
        fi
      fi
    done
    ((line_number++))
  fi
done

if [ -f "$MATCHES" ] && [ "$(cat "$MATCHES")" = "1" ]; then
  echo "✓ File content scanning detected protected name"
  rm "$MATCHES"
else
  echo "✗ FAIL: File content scanning missed protected name"
  rm -f "$MATCHES"
  exit 1
fi
echo

# Test 4: PR title scanning
echo "Test 4: PR title scanning"
echo "-------------------------"

PR_TITLE="Add DUMMYNAME feature"
FOUND=0

IFS='|' read -ra NAMES <<< "$PROTECTED_NAMES"
for name in "${NAMES[@]}"; do
  name_trimmed="${name#"${name%%[![:space:]]*}"}"
  name_trimmed="${name_trimmed%"${name_trimmed##*[![:space:]]}"}"
  if [ -n "$name_trimmed" ]; then
    if printf '%s\n' "$PR_TITLE" | grep -qiF -- "$name_trimmed"; then
      echo "  Found protected name in PR title"
      FOUND=1
    fi
  fi
done

if [ "$FOUND" = "1" ]; then
  echo "✓ PR title scanning detected protected name"
else
  echo "✗ FAIL: PR title scanning missed protected name"
  exit 1
fi
echo

# Test 5: PR body scanning
echo "Test 5: PR body scanning"
echo "------------------------"

PR_BODY="This PR adds features by DUMMYNAME"
FOUND=0

IFS='|' read -ra NAMES <<< "$PROTECTED_NAMES"
for name in "${NAMES[@]}"; do
  name_trimmed="${name#"${name%%[![:space:]]*}"}"
  name_trimmed="${name_trimmed%"${name_trimmed##*[![:space:]]}"}"
  if [ -n "$name_trimmed" ]; then
    if printf '%s\n' "$PR_BODY" | grep -qiF -- "$name_trimmed"; then
      echo "  Found protected name in PR body"
      FOUND=1
    fi
  fi
done

if [ "$FOUND" = "1" ]; then
  echo "✓ PR body scanning detected protected name"
else
  echo "✗ FAIL: PR body scanning missed protected name"
  exit 1
fi
echo

# Test 6: Commit message scanning
echo "Test 6: Commit message scanning"
echo "-------------------------------"

echo "test change" > test.txt
git add test.txt
git commit -q -m "Update by DUMMYNAME"

MATCHES=$(mktemp)

git log --format="%H %s" main..HEAD | while IFS= read -r line; do
  if [[ "$line" =~ ^[0-9a-f]{40} ]]; then
    commit_sha=$(printf '%s\n' "$line" | cut -d' ' -f1)
    message=$(printf '%s\n' "$line" | cut -d' ' -f2-)
    
    IFS='|' read -ra NAMES <<< "$PROTECTED_NAMES"
    for name in "${NAMES[@]}"; do
      name_trimmed="${name#"${name%%[![:space:]]*}"}"
      name_trimmed="${name_trimmed%"${name_trimmed##*[![:space:]]}"}"
      if [ -n "$name_trimmed" ]; then
        if printf '%s\n' "$message" | grep -qiF -- "$name_trimmed"; then
          echo "  Found protected name in commit: $commit_sha"
          echo "1" > "$MATCHES"
        fi
      fi
    done
  fi
done

if [ -f "$MATCHES" ] && [ "$(cat "$MATCHES")" = "1" ]; then
  echo "✓ Commit message scanning detected protected name"
  rm "$MATCHES"
else
  echo "✗ FAIL: Commit message scanning missed protected name"
  rm -f "$MATCHES"
  exit 1
fi
echo

# Test 7: Script injection protection
echo "Test 7: Script injection protection"
echo "-----------------------------------"

# Test that malicious content passed through env vars doesn't execute
INJECTION_TEST='$(echo "INJECTION_EXECUTED" > /tmp/injection-test)'
COMMENT_BODY="Normal text with DUMMYNAME and $INJECTION_TEST"

# The workflow passes through env vars, so simulate that
FOUND=0
IFS='|' read -ra NAMES <<< "$PROTECTED_NAMES"
for name in "${NAMES[@]}"; do
  name_trimmed="${name#"${name%%[![:space:]]*}"}"
  name_trimmed="${name_trimmed%"${name_trimmed##*[![:space:]]}"}"
  if [ -n "$name_trimmed" ]; then
    if printf '%s\n' "$COMMENT_BODY" | grep -qiF -- "$name_trimmed"; then
      echo "  Found protected name (injection string not executed)"
      FOUND=1
    fi
  fi
done

# Verify injection didn't execute
if [ -f "/tmp/injection-test" ]; then
  echo "✗ FAIL: Script injection occurred!"
  exit 1
fi

if [ "$FOUND" = "1" ]; then
  echo "✓ Script injection protection working (matched name, no execution)"
else
  echo "✗ FAIL: Scanning failed with injection payload"
  exit 1
fi
echo

# Test 8: Issue/comment scanning
echo "Test 8: Issue/comment scanning"
echo "------------------------------"

ISSUE_TITLE="Bug report from DUMMYNAME"
ISSUE_BODY="Description with TESTNAME mentioned"
COMMENT_BODY="Update by DUMMYNAME"

# Issue title
FOUND=0
IFS='|' read -ra NAMES <<< "$PROTECTED_NAMES"
for name in "${NAMES[@]}"; do
  name_trimmed="${name#"${name%%[![:space:]]*}"}"
  name_trimmed="${name_trimmed%"${name_trimmed##*[![:space:]]}"}"
  if [ -n "$name_trimmed" ]; then
    if printf '%s\n' "$ISSUE_TITLE" | grep -qiF -- "$name_trimmed"; then
      echo "  Found protected name in issue title"
      FOUND=1
    fi
  fi
done

if [ "$FOUND" = "1" ]; then
  echo "✓ Issue title scanning detected protected name"
else
  echo "✗ FAIL: Issue title scanning missed protected name"
  exit 1
fi

# Issue body
FOUND=0
IFS='|' read -ra NAMES <<< "$PROTECTED_NAMES"
for name in "${NAMES[@]}"; do
  name_trimmed="${name#"${name%%[![:space:]]*}"}"
  name_trimmed="${name_trimmed%"${name_trimmed##*[![:space:]]}"}"
  if [ -n "$name_trimmed" ]; then
    if printf '%s\n' "$ISSUE_BODY" | grep -qiF -- "$name_trimmed"; then
      echo "  Found protected name in issue body"
      FOUND=1
    fi
  fi
done

if [ "$FOUND" = "1" ]; then
  echo "✓ Issue body scanning detected protected name"
else
  echo "✗ FAIL: Issue body scanning missed protected name"
  exit 1
fi

# Comment
FOUND=0
IFS='|' read -ra NAMES <<< "$PROTECTED_NAMES"
for name in "${NAMES[@]}"; do
  name_trimmed="${name#"${name%%[![:space:]]*}"}"
  name_trimmed="${name_trimmed%"${name_trimmed##*[![:space:]]}"}"
  if [ -n "$name_trimmed" ]; then
    if printf '%s\n' "$COMMENT_BODY" | grep -qiF -- "$name_trimmed"; then
      echo "  Found protected name in comment"
      FOUND=1
    fi
  fi
done

if [ "$FOUND" = "1" ]; then
  echo "✓ Comment scanning detected protected name"
else
  echo "✗ FAIL: Comment scanning missed protected name"
  exit 1
fi
echo

echo "=========================================="
echo "All tests passed! ✓"
echo "=========================================="
echo
echo "Summary:"
echo "- Secret presence detection: working"
echo "- File path scanning: working"
echo "- File content scanning: working"
echo "- PR title/body scanning: working"
echo "- Commit message scanning: working"
echo "- Issue/comment scanning: working"
echo "- Script injection protection: working"

# Additional tests for review findings
echo
echo "=== Additional Review Finding Tests ==="
echo

# Test 9: Regex special characters (. and *)
echo "Test 9: Name with regex special characters"
echo "------------------------------------------"

PROTECTED_NAMES="J.R.|Test*Name"
PR_TITLE="Update by J.R. Smith"
FOUND=0

IFS='|' read -ra NAMES <<< "$PROTECTED_NAMES"
for name in "${NAMES[@]}"; do
  name_trimmed="${name#"${name%%[![:space:]]*}"}"
  name_trimmed="${name_trimmed%"${name_trimmed##*[![:space:]]}"}"
  if [ -n "$name_trimmed" ]; then
    if printf '%s\n' "$PR_TITLE" | grep -qiF -- "$name_trimmed"; then
      echo "  Found protected name with special chars: $name_trimmed"
      FOUND=1
    fi
  fi
done

if [ "$FOUND" = "1" ]; then
  echo "✓ Regex special characters handled correctly (literal match)"
else
  echo "✗ FAIL: Regex special characters not handled correctly"
  exit 1
fi
echo

# Test 10: Name starting with dash (option-like)
echo "Test 10: Name starting with dash"
echo "--------------------------------"

PROTECTED_NAMES="-ntest"
PR_BODY="Changes by -ntest user"
FOUND=0

IFS='|' read -ra NAMES <<< "$PROTECTED_NAMES"
for name in "${NAMES[@]}"; do
  name_trimmed="${name#"${name%%[![:space:]]*}"}"
  name_trimmed="${name_trimmed%"${name_trimmed##*[![:space:]]}"}"
  if [ -n "$name_trimmed" ]; then
    if printf '%s\n' "$PR_BODY" | grep -qiF -- "$name_trimmed"; then
      echo "  Found protected name starting with dash"
      FOUND=1
    fi
  fi
done

if [ "$FOUND" = "1" ]; then
  echo "✓ Names starting with dash handled correctly"
else
  echo "✗ FAIL: Names starting with dash not handled correctly"
  exit 1
fi
echo

# Test 11: Name with apostrophe
echo "Test 11: Name with apostrophe"
echo "-----------------------------"

PROTECTED_NAMES="O'Neil|DUMMYNAME"
ISSUE_TITLE="Bug report from O'Neil"
FOUND=0

IFS='|' read -ra NAMES <<< "$PROTECTED_NAMES"
for name in "${NAMES[@]}"; do
  name_trimmed="${name#"${name%%[![:space:]]*}"}"
  name_trimmed="${name_trimmed%"${name_trimmed##*[![:space:]]}"}"
  if [ -n "$name_trimmed" ]; then
    if printf '%s\n' "$ISSUE_TITLE" | grep -qiF -- "$name_trimmed"; then
      echo "  Found protected name with apostrophe: $name_trimmed"
      FOUND=1
    fi
  fi
done

if [ "$FOUND" = "1" ]; then
  echo "✓ Names with apostrophes handled correctly"
else
  echo "✗ FAIL: Names with apostrophes not handled correctly"
  exit 1
fi
echo

# Test 12: Line number tracking in multi-line hunk
echo "Test 12: Line number tracking in multi-line hunk"
echo "------------------------------------------------"

cd "$TEST_DIR"
git checkout -q main
git branch -D test-branch 2>/dev/null || true
git checkout -q -b test-branch-line-tracking

cat > multiline.js << 'EOF'
function test() {
  const line1 = "first";
  const line2 = "second";
  const line3 = "DUMMYNAME";
  const line4 = "fourth";
}
EOF

git add multiline.js
git commit -q -m "Add multiline test"

PROTECTED_NAMES="DUMMYNAME"
MATCHES=$(mktemp)
current_file=""
line_number=0
found_line=0

git diff -U0 main...HEAD | while IFS= read -r line; do
  if [[ "$line" =~ ^diff\ --git ]]; then
    current_file=$(printf '%s\n' "$line" | sed 's|^diff --git a/\(.*\) b/.*|\1|')
  elif [[ "$line" =~ ^@@\ -[0-9,]*\ \+([0-9]+) ]]; then
    line_number="${BASH_REMATCH[1]}"
  elif [[ "$line" =~ ^[\+] ]] && [[ ! "$line" =~ ^\+\+\+ ]]; then
    IFS='|' read -ra NAMES <<< "$PROTECTED_NAMES"
    for name in "${NAMES[@]}"; do
      name_trimmed="${name#"${name%%[![:space:]]*}"}"
      name_trimmed="${name_trimmed%"${name_trimmed##*[![:space:]]}"}"
      if [ -n "$name_trimmed" ]; then
        if printf '%s\n' "$line" | grep -qiF -- "$name_trimmed"; then
          if [ "$current_file" = "multiline.js" ]; then
            echo "  Found at line $line_number in $current_file"
            echo "$line_number" > "$MATCHES"
          fi
        fi
      fi
    done
    ((line_number++))
  fi
done

if [ -f "$MATCHES" ]; then
  DETECTED_LINE=$(cat "$MATCHES")
  # Line should be 4 (the 4th line of the file where DUMMYNAME appears)
  if [ "$DETECTED_LINE" = "4" ]; then
    echo "✓ Line number tracking correct (found at line 4)"
    rm "$MATCHES"
  else
    echo "✗ FAIL: Line number tracking incorrect (expected 4, got $DETECTED_LINE)"
    rm "$MATCHES"
    exit 1
  fi
else
  echo "✗ FAIL: Line number tracking failed (no match found)"
  rm -f "$MATCHES"
  exit 1
fi
echo

echo "=========================================="
echo "All extended tests passed! ✓"
echo "=========================================="
