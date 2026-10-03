#!/usr/bin/env bash
set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_ROOT="$(cd "$SCRIPT_DIR/.." && pwd)"
FIXTURES_DIR="$SCRIPT_DIR/fixtures/images"
TEMP_DIR=$(mktemp -d)

# Set IMAGE_CHECK_ROOT to temp dir for all tests
export IMAGE_CHECK_ROOT="$TEMP_DIR"

trap 'rm -rf "$TEMP_DIR" "$TEMP_DIR-link"' EXIT

echo "=== Image Metadata Check Test Suite ==="
echo ""

# Track test results
TESTS_PASSED=0
TESTS_FAILED=0

pass_test() {
  echo "✓ $1"
  ((TESTS_PASSED++)) || true
}

fail_test() {
  echo "✗ $1"
  ((TESTS_FAILED++)) || true
}

# Generate test fixtures at runtime
echo "Generating test fixtures..."

# 1. Clean image with proper stamp (should pass)
convert -size 100x100 xc:blue "$TEMP_DIR/clean-stamped.png"
exiftool -q -overwrite_original -Copyright="Property of Infinity Enterprises" "$TEMP_DIR/clean-stamped.png"

# 2. Image with EXIF Make field (should fail)
convert -size 100x100 xc:red "$TEMP_DIR/has-exif-make.jpg"
exiftool -q -overwrite_original -Make="TestCamera" -Copyright="Property of Infinity Enterprises" "$TEMP_DIR/has-exif-make.jpg"

# 3. Image with EXIF Model field (should fail)
convert -size 100x100 xc:green "$TEMP_DIR/has-exif-model.jpg"
exiftool -q -overwrite_original -Model="TestModel" -Copyright="Property of Infinity Enterprises" "$TEMP_DIR/has-exif-model.jpg"

# 4. Image with EXIF Artist field (should fail)
convert -size 100x100 xc:yellow "$TEMP_DIR/has-exif-artist.jpg"
exiftool -q -overwrite_original -Artist="Test Artist" -Copyright="Property of Infinity Enterprises" "$TEMP_DIR/has-exif-artist.jpg"

# 5. Image with EXIF Software field (should fail)
convert -size 100x100 xc:cyan "$TEMP_DIR/has-exif-software.png"
exiftool -q -overwrite_original -Software="TestSoftware" -Copyright="Property of Infinity Enterprises" "$TEMP_DIR/has-exif-software.png"

# 6. Image with XMP block (should fail)
convert -size 100x100 xc:magenta "$TEMP_DIR/has-xmp.jpg"
exiftool -q -overwrite_original -XMP:Creator="Test Creator" -Copyright="Property of Infinity Enterprises" "$TEMP_DIR/has-xmp.jpg"

# 7. Image with IPTC block (should fail)
convert -size 100x100 xc:orange "$TEMP_DIR/has-iptc.jpg"
exiftool -q -overwrite_original -IPTC:By-line="Test Byline" -Copyright="Property of Infinity Enterprises" "$TEMP_DIR/has-iptc.jpg"

# 8. Image with GPS data (should fail)
convert -size 100x100 xc:purple "$TEMP_DIR/has-gps.jpg"
exiftool -q -overwrite_original -GPSLatitude=37.7749 -GPSLongitude=-122.4194 -Copyright="Property of Infinity Enterprises" "$TEMP_DIR/has-gps.jpg"

# 9. Image missing stamp (should fail)
convert -size 100x100 xc:white "$TEMP_DIR/missing-stamp.png"

# 10. Create a real JPEG APP11/JUMBF test case
# JPEG structure: SOI (FF D8), APP11 (FF EB + length + data), rest of image
# APP11 JUMBF box: common identifier 'JP\x20\x20' + box type 'jumb'
convert -size 100x100 xc:brown "$TEMP_DIR/has-c2pa-app11.jpg"
exiftool -q -overwrite_original -Copyright="Property of Infinity Enterprises" "$TEMP_DIR/has-c2pa-app11.jpg"

# Build APP11 JUMBF segment and inject after SOI
# Structure: FF EB (APP11 marker) + length (2 bytes) + JP box header + jumb box
python3 << PYTHON_EOF
import struct
# Read original JPEG
with open("$TEMP_DIR/has-c2pa-app11.jpg", "rb") as f:
    jpeg_data = f.read()

# Verify SOI marker
if jpeg_data[:2] != b'\xFF\xD8':
    raise ValueError("Not a valid JPEG")

# Build APP11 JUMBF segment
# Common identifier: 'JP\x20\x20' (4 bytes)
# Box type: 'jumb' (4 bytes)
jumbf_data = b'JP\x20\x20jumb'
# APP11 marker + length (includes length bytes) + data
app11_length = len(jumbf_data) + 2
app11_segment = struct.pack('>H', 0xFFEB) + struct.pack('>H', app11_length) + jumbf_data

# Insert APP11 after SOI
new_jpeg = jpeg_data[:2] + app11_segment + jpeg_data[2:]

with open("$TEMP_DIR/has-c2pa-app11.jpg", "wb") as f:
    f.write(new_jpeg)
PYTHON_EOF

# 11. Create a plain C2PA marker test (simpler string-based detection)
convert -size 100x100 xc:brown "$TEMP_DIR/has-c2pa-marker.jpg"
exiftool -q -overwrite_original -Copyright="Property of Infinity Enterprises" "$TEMP_DIR/has-c2pa-marker.jpg"
# Append c2pa marker string that will be caught by strings command
printf 'c2pa_metadata_marker' >> "$TEMP_DIR/has-c2pa-marker.jpg"

# 12. Image with LensModel (should fail)
convert -size 100x100 xc:gray "$TEMP_DIR/has-lens-model.jpg"
exiftool -q -overwrite_original -LensModel="50mm f/1.8" -Copyright="Property of Infinity Enterprises" "$TEMP_DIR/has-lens-model.jpg"

# 13. Image with SerialNumber (should fail)
convert -size 100x100 xc:pink "$TEMP_DIR/has-serial.jpg"
exiftool -q -overwrite_original -SerialNumber="12345" -Copyright="Property of Infinity Enterprises" "$TEMP_DIR/has-serial.jpg"

echo "Test fixtures generated in $TEMP_DIR"
echo ""

# Test 1: Clean image should pass
echo "Test 1: Clean stamped image should pass"
if "$PROJECT_ROOT/scripts/check-image-metadata" "$TEMP_DIR/clean-stamped.png" >/dev/null 2>&1; then
  pass_test "Clean image passes check"
else
  fail_test "Clean image should pass but failed"
fi

# Test 2: EXIF Make should fail
echo "Test 2: Image with EXIF Make should fail"
if ! "$PROJECT_ROOT/scripts/check-image-metadata" "$TEMP_DIR/has-exif-make.jpg" >/dev/null 2>&1; then
  pass_test "EXIF Make detection works"
else
  fail_test "EXIF Make should fail but passed"
fi

# Test 3: EXIF Model should fail
echo "Test 3: Image with EXIF Model should fail"
if ! "$PROJECT_ROOT/scripts/check-image-metadata" "$TEMP_DIR/has-exif-model.jpg" >/dev/null 2>&1; then
  pass_test "EXIF Model detection works"
else
  fail_test "EXIF Model should fail but passed"
fi

# Test 4: EXIF Artist should fail
echo "Test 4: Image with EXIF Artist should fail"
if ! "$PROJECT_ROOT/scripts/check-image-metadata" "$TEMP_DIR/has-exif-artist.jpg" >/dev/null 2>&1; then
  pass_test "EXIF Artist detection works"
else
  fail_test "EXIF Artist should fail but passed"
fi

# Test 5: EXIF Software should fail
echo "Test 5: Image with EXIF Software should fail"
if ! "$PROJECT_ROOT/scripts/check-image-metadata" "$TEMP_DIR/has-exif-software.png" >/dev/null 2>&1; then
  pass_test "EXIF Software detection works"
else
  fail_test "EXIF Software should fail but passed"
fi

# Test 6: XMP block should fail
echo "Test 6: Image with XMP block should fail"
if ! "$PROJECT_ROOT/scripts/check-image-metadata" "$TEMP_DIR/has-xmp.jpg" >/dev/null 2>&1; then
  pass_test "XMP block detection works"
else
  fail_test "XMP block should fail but passed"
fi

# Test 7: IPTC block should fail
echo "Test 7: Image with IPTC block should fail"
if ! "$PROJECT_ROOT/scripts/check-image-metadata" "$TEMP_DIR/has-iptc.jpg" >/dev/null 2>&1; then
  pass_test "IPTC block detection works"
else
  fail_test "IPTC block should fail but passed"
fi

# Test 8: GPS data should fail
echo "Test 8: Image with GPS data should fail"
if ! "$PROJECT_ROOT/scripts/check-image-metadata" "$TEMP_DIR/has-gps.jpg" >/dev/null 2>&1; then
  pass_test "GPS detection works"
else
  fail_test "GPS should fail but passed"
fi

# Test 9: Missing stamp should fail
echo "Test 9: Image missing stamp should fail"
if ! "$PROJECT_ROOT/scripts/check-image-metadata" "$TEMP_DIR/missing-stamp.png" >/dev/null 2>&1; then
  pass_test "Missing stamp detection works"
else
  fail_test "Missing stamp should fail but passed"
fi

# Test 10: Real APP11/JUMBF marker should fail
echo "Test 10: Image with real APP11 JUMBF segment should fail"
if ! "$PROJECT_ROOT/scripts/check-image-metadata" "$TEMP_DIR/has-c2pa-app11.jpg" >/dev/null 2>&1; then
  pass_test "APP11 JUMBF detection works"
else
  fail_test "APP11 JUMBF should fail but passed"
fi

# Test 11: Plain C2PA marker string should fail
echo "Test 11: Image with C2PA marker string should fail"
if ! "$PROJECT_ROOT/scripts/check-image-metadata" "$TEMP_DIR/has-c2pa-marker.jpg" >/dev/null 2>&1; then
  pass_test "C2PA marker detection works"
else
  fail_test "C2PA marker should fail but passed"
fi

# Test 12: LensModel should fail
echo "Test 12: Image with LensModel should fail"
if ! "$PROJECT_ROOT/scripts/check-image-metadata" "$TEMP_DIR/has-lens-model.jpg" >/dev/null 2>&1; then
  pass_test "EXIF LensModel detection works"
else
  fail_test "EXIF LensModel should fail but passed"
fi

# Test 13: SerialNumber should fail
echo "Test 13: Image with SerialNumber should fail"
if ! "$PROJECT_ROOT/scripts/check-image-metadata" "$TEMP_DIR/has-serial.jpg" >/dev/null 2>&1; then
  pass_test "EXIF SerialNumber detection works"
else
  fail_test "EXIF SerialNumber should fail but passed"
fi

# Test 14: JPEG-in-.png list recognition with ./ prefix guards the fix
echo "Test 14: JPEG-in-.png list recognized with ./ prefix"
# Create a real PNG file at a known JPEG-.png list path with ./ prefix
# This tests that the list matching works even when find adds ./
# The fixture is real PNG bytes (not JPEG) at a path in JPEG_PNG_NAMES,
# so the format check must fail with the exact "expected JPEG format" message.
TEST_PNG="$TEMP_DIR/test-jpeg-png-check.png"
# Create real PNG content (PNG signature + minimal IHDR)
printf '\x89PNG\r\n\x1a\n\x00\x00\x00\rIHDR\x00\x00\x00\x01\x00\x00\x00\x01\x08\x02\x00\x00\x00\x90wS\xde' > "$TEST_PNG"
# Attempt to add stamp, but exiftool will fail on this truncated PNG; || true hides that
exiftool -q -overwrite_original -Copyright="Property of Infinity Enterprises" "$TEST_PNG" 2>/dev/null || true
# Create the directory structure and symlink to simulate a listed path
mkdir -p "$TEMP_DIR/design/sovrano-v1/editorial-art"
ln -sf "$TEST_PNG" "$TEMP_DIR/design/sovrano-v1/editorial-art/01-penthouse-portrait.png"
# Run check from temp dir with ./ prefix (simulating find output)
cd "$TEMP_DIR"
ln -sf "$PROJECT_ROOT/scripts" scripts 2>/dev/null || true
ln -sf "$PROJECT_ROOT/node_modules" node_modules 2>/dev/null || true
# Capture output and exit code
set +e
OUTPUT=$(./scripts/check-image-metadata "./design/sovrano-v1/editorial-art/01-penthouse-portrait.png" 2>&1)
EXIT_CODE=$?
set -e
cd "$PROJECT_ROOT"
# Should fail with exit 1 and the exact "expected JPEG" message
if [ $EXIT_CODE -eq 1 ] && echo "$OUTPUT" | grep -q "expected JPEG format"; then
  pass_test "JPEG-in-.png list matches with ./ prefix and detects format mismatch"
else
  fail_test "JPEG-in-.png check failed: exit=$EXIT_CODE (expected 1), looking for 'expected JPEG format' in: $OUTPUT"
fi

# Test 15: Check script fails on missing file in file list
echo "Test 15: Check script fails when file in list is missing"
if OUTPUT=$("$PROJECT_ROOT/scripts/check-image-metadata" "$TEMP_DIR/clean-stamped.png" "$TEMP_DIR/nonexistent.png" 2>&1); then
  fail_test "Check script should fail when file is missing"
elif echo "$OUTPUT" | grep -q "not found"; then
  pass_test "Check script fails on missing file"
else
  fail_test "Check script failed but wrong error message"
fi

# Test 16: Scrub script fails on missing file in file list
echo "Test 16: Scrub script fails when file in list is missing"
if OUTPUT=$("$PROJECT_ROOT/scripts/scrub-image-metadata" "$TEMP_DIR/clean-stamped.png" "$TEMP_DIR/nonexistent.png" 2>&1); then
  fail_test "Scrub script should fail when file is missing"
elif echo "$OUTPUT" | grep -q "not found"; then
  pass_test "Scrub script fails on missing file"
else
  fail_test "Scrub script failed but wrong error message"
fi

# Test 17: Fail closed - missing exiftool
echo "Test 17: Check script fails when exiftool is missing"
RESTRICTED_BIN=$(mktemp -d)
# Keep essential coreutils, hide only exiftool
for cmd in node bash dirname basename cat grep sed awk sort head tail wc find identify strings; do
  if command -v "$cmd" >/dev/null 2>&1; then
    ln -s "$(command -v "$cmd")" "$RESTRICTED_BIN/$cmd" 2>/dev/null || true
  fi
done
if OUTPUT=$(timeout 5 env PATH="$RESTRICTED_BIN" "$PROJECT_ROOT/scripts/check-image-metadata" "$TEMP_DIR/clean-stamped.png" 2>&1); then
  fail_test "Check script should fail without exiftool (exit 0)"
elif echo "$OUTPUT" | grep -q "exiftool is not installed"; then
  pass_test "Check script fails closed without exiftool"
else
  fail_test "Check script failed but wrong error message"
fi
rm -rf "$RESTRICTED_BIN"

# Test 18: Fail closed - scrub script missing exiftool
echo "Test 18: Scrub script fails when exiftool is missing"
RESTRICTED_BIN=$(mktemp -d)
# Keep essential coreutils, hide only exiftool
for cmd in node bash dirname basename cat grep sed awk sort head tail wc find identify; do
  if command -v "$cmd" >/dev/null 2>&1; then
    ln -s "$(command -v "$cmd")" "$RESTRICTED_BIN/$cmd" 2>/dev/null || true
  fi
done
if OUTPUT=$(timeout 5 env PATH="$RESTRICTED_BIN" "$PROJECT_ROOT/scripts/scrub-image-metadata" "$TEMP_DIR/clean-stamped.png" 2>&1); then
  fail_test "Scrub script should fail without exiftool (exit 0)"
elif echo "$OUTPUT" | grep -q "exiftool is not installed"; then
  pass_test "Scrub script fails closed without exiftool"
else
  fail_test "Scrub script failed but wrong error message"
fi
rm -rf "$RESTRICTED_BIN"

# Test 19: Fail closed - scrub script missing ImageMagick
echo "Test 19: Scrub script fails when ImageMagick is missing"
RESTRICTED_BIN=$(mktemp -d)
# Keep essential coreutils, hide only identify
for cmd in node bash dirname basename cat grep sed awk sort head tail wc find exiftool; do
  if command -v "$cmd" >/dev/null 2>&1; then
    ln -s "$(command -v "$cmd")" "$RESTRICTED_BIN/$cmd" 2>/dev/null || true
  fi
done
if OUTPUT=$(timeout 5 env PATH="$RESTRICTED_BIN" "$PROJECT_ROOT/scripts/scrub-image-metadata" "$TEMP_DIR/clean-stamped.png" 2>&1); then
  fail_test "Scrub script should fail without ImageMagick (exit 0)"
elif echo "$OUTPUT" | grep -q "ImageMagick"; then
  pass_test "Scrub script fails closed without ImageMagick"
else
  fail_test "Scrub script failed but wrong error message"
fi
rm -rf "$RESTRICTED_BIN"

# Test 20: File list argument - only listed files are modified
echo "Test 20: Scrub script with file list only modifies listed files"
# Create three test images
convert -size 50x50 xc:red "$TEMP_DIR/file-list-1.png"
convert -size 50x50 xc:green "$TEMP_DIR/file-list-2.png"
convert -size 50x50 xc:blue "$TEMP_DIR/file-list-3.png"

# Add metadata to all three
exiftool -q -overwrite_original -Artist="ToRemove" "$TEMP_DIR/file-list-1.png"
exiftool -q -overwrite_original -Artist="ToRemove" "$TEMP_DIR/file-list-2.png"
exiftool -q -overwrite_original -Artist="ToRemove" "$TEMP_DIR/file-list-3.png"

# Compute hashes before
HASH_1_BEFORE=$(sha256sum "$TEMP_DIR/file-list-1.png" | cut -d' ' -f1)
HASH_2_BEFORE=$(sha256sum "$TEMP_DIR/file-list-2.png" | cut -d' ' -f1)
HASH_3_BEFORE=$(sha256sum "$TEMP_DIR/file-list-3.png" | cut -d' ' -f1)

# Scrub only file-list-1.png and file-list-2.png
if "$PROJECT_ROOT/scripts/scrub-image-metadata" "$TEMP_DIR/file-list-1.png" "$TEMP_DIR/file-list-2.png" >/dev/null 2>&1; then
  # Compute hashes after
  HASH_1_AFTER=$(sha256sum "$TEMP_DIR/file-list-1.png" | cut -d' ' -f1)
  HASH_2_AFTER=$(sha256sum "$TEMP_DIR/file-list-2.png" | cut -d' ' -f1)
  HASH_3_AFTER=$(sha256sum "$TEMP_DIR/file-list-3.png" | cut -d' ' -f1)
  
  # file-list-1 and file-list-2 should have changed (metadata stripped)
  # file-list-3 should be unchanged
  if [ "$HASH_1_BEFORE" != "$HASH_1_AFTER" ] && [ "$HASH_2_BEFORE" != "$HASH_2_AFTER" ] && [ "$HASH_3_BEFORE" = "$HASH_3_AFTER" ]; then
    # Verify file-list-3 still has Artist field
    if exiftool -Artist "$TEMP_DIR/file-list-3.png" 2>/dev/null | grep -q "ToRemove"; then
      pass_test "File list argument works - unlisted file unchanged"
    else
      fail_test "Unlisted file should still have metadata"
    fi
  else
    fail_test "File list modification pattern incorrect"
  fi
else
  fail_test "Scrub with file list should succeed"
fi

# Test 21: Scrub script fails when file is skipped
echo "Test 21: Scrub script exits non-zero when file is skipped"
# Create a file that will cause hash computation to fail (corrupt/invalid)
echo "not an image" > "$TEMP_DIR/corrupt.png"

# Try to scrub the corrupt file - it should fail with non-zero exit
if OUTPUT=$("$PROJECT_ROOT/scripts/scrub-image-metadata" "$TEMP_DIR/corrupt.png" 2>&1); then
  fail_test "Scrub script should exit non-zero when file is skipped"
elif echo "$OUTPUT" | grep -q "skipped"; then
  pass_test "Scrub script exits non-zero when file is skipped"
else
  fail_test "Scrub script should report skipped files"
fi

# Test 22: Check script fails when strings is missing
echo "Test 22: Check script fails when strings is missing"
RESTRICTED_BIN=$(mktemp -d)
# Keep essential coreutils and exiftool, hide only strings
for cmd in node bash dirname basename cat grep sed awk sort head tail wc find identify exiftool; do
  if command -v "$cmd" >/dev/null 2>&1; then
    ln -s "$(command -v "$cmd")" "$RESTRICTED_BIN/$cmd" 2>/dev/null || true
  fi
done
if OUTPUT=$(timeout 5 env PATH="$RESTRICTED_BIN" "$PROJECT_ROOT/scripts/check-image-metadata" "$TEMP_DIR/clean-stamped.png" 2>&1); then
  fail_test "Check script should fail without strings (exit 0)"
elif echo "$OUTPUT" | grep -q "strings is not installed"; then
  pass_test "Check script fails closed without strings"
else
  fail_test "Check script failed but wrong error message: $OUTPUT"
fi
rm -rf "$RESTRICTED_BIN"

# Test 23: JPEG-as-.png with missing stamp should fail
echo "Test 23: JPEG-as-.png with missing stamp should fail"
# Create a real JPEG file with .png extension at a listed path, no stamp
mkdir -p "$TEMP_DIR/design/sovrano-v1/editorial-art"
TEST_JPEG_PNG="$TEMP_DIR/design/sovrano-v1/editorial-art/01-penthouse-portrait.png"
convert -size 100x100 xc:teal jpeg:"$TEST_JPEG_PNG"
# Verify it's really JPEG
ACTUAL_TYPE=$(exiftool -s -s -s -FileType "$TEST_JPEG_PNG" 2>/dev/null || echo "")
if [ "$ACTUAL_TYPE" != "JPEG" ]; then
  fail_test "Test 23 fixture creation failed: expected JPEG but got $ACTUAL_TYPE"
else
  set +e
  OUTPUT=$("$PROJECT_ROOT/scripts/check-image-metadata" "$TEST_JPEG_PNG" 2>&1)
  EXIT_CODE=$?
  set -e
  if [ $EXIT_CODE -ne 0 ] && echo "$OUTPUT" | grep -q "Ownership stamp missing" && ! echo "$OUTPUT" | grep -q "expected JPEG format"; then
    pass_test "JPEG-as-.png without stamp fails with missing stamp error"
  else
    fail_test "JPEG-as-.png without stamp should fail with missing stamp error (exit=$EXIT_CODE), got: $OUTPUT"
  fi
fi

# Test 24: JPEG-as-.png with EXIF device fields should fail
echo "Test 24: JPEG-as-.png with EXIF device fields should fail"
# Create JPEG with device fields at a listed path
convert -size 100x100 xc:navy "$TEMP_DIR/has-jpeg-png-device.jpg"
exiftool -q -overwrite_original -Make="TestCamera" -Copyright="Property of Infinity Enterprises" "$TEMP_DIR/has-jpeg-png-device.jpg"
# Move to a JPEG-as-.png path
mkdir -p "$TEMP_DIR/design/sovrano-v1/editorial-art/covers"
TEST_PATH="$TEMP_DIR/design/sovrano-v1/editorial-art/covers/cover-daily-desk.png"
mv "$TEMP_DIR/has-jpeg-png-device.jpg" "$TEST_PATH"
# Verify it's JPEG
ACTUAL_TYPE=$(exiftool -s -s -s -FileType "$TEST_PATH" 2>/dev/null || echo "")
if [ "$ACTUAL_TYPE" != "JPEG" ]; then
  fail_test "Test 24 fixture is not JPEG: $ACTUAL_TYPE"
else
  set +e
  OUTPUT=$("$PROJECT_ROOT/scripts/check-image-metadata" "$TEST_PATH" 2>&1)
  EXIT_CODE=$?
  set -e
  if [ $EXIT_CODE -ne 0 ] && echo "$OUTPUT" | grep -q "EXIF device/author fields found" && ! echo "$OUTPUT" | grep -q "expected JPEG format"; then
    pass_test "JPEG-as-.png with device fields fails with device fields error"
  else
    fail_test "JPEG-as-.png with device fields should fail with device fields error (exit=$EXIT_CODE), got: $OUTPUT"
  fi
fi

# Test 25: JPEG-as-.png with XMP should fail
echo "Test 25: JPEG-as-.png with XMP should fail"
convert -size 100x100 xc:olive "$TEMP_DIR/has-jpeg-png-xmp.jpg"
exiftool -q -overwrite_original -XMP:Creator="Test Creator" -Copyright="Property of Infinity Enterprises" "$TEMP_DIR/has-jpeg-png-xmp.jpg"
mkdir -p "$TEMP_DIR/design/sovrano-v1/editorial-art"
TEST_PATH="$TEMP_DIR/design/sovrano-v1/editorial-art/02-lounge-couple.png"
mv "$TEMP_DIR/has-jpeg-png-xmp.jpg" "$TEST_PATH"
# Verify it's JPEG
ACTUAL_TYPE=$(exiftool -s -s -s -FileType "$TEST_PATH" 2>/dev/null || echo "")
if [ "$ACTUAL_TYPE" != "JPEG" ]; then
  fail_test "Test 25 fixture is not JPEG: $ACTUAL_TYPE"
else
  set +e
  OUTPUT=$("$PROJECT_ROOT/scripts/check-image-metadata" "$TEST_PATH" 2>&1)
  EXIT_CODE=$?
  set -e
  if [ $EXIT_CODE -ne 0 ] && echo "$OUTPUT" | grep -q "XMP blocks found" && ! echo "$OUTPUT" | grep -q "expected JPEG format"; then
    pass_test "JPEG-as-.png with XMP fails with XMP error"
  else
    fail_test "JPEG-as-.png with XMP should fail with XMP error (exit=$EXIT_CODE), got: $OUTPUT"
  fi
fi

# Test 26: JPEG-as-.png with IPTC should fail
echo "Test 26: JPEG-as-.png with IPTC should fail"
convert -size 100x100 xc:maroon "$TEMP_DIR/has-jpeg-png-iptc.jpg"
exiftool -q -overwrite_original -IPTC:By-line="Test Byline" -Copyright="Property of Infinity Enterprises" "$TEMP_DIR/has-jpeg-png-iptc.jpg"
mkdir -p "$TEMP_DIR/design/sovrano-v1/editorial-art"
TEST_PATH="$TEMP_DIR/design/sovrano-v1/editorial-art/03-motore-chrome.png"
mv "$TEMP_DIR/has-jpeg-png-iptc.jpg" "$TEST_PATH"
# Verify it's JPEG
ACTUAL_TYPE=$(exiftool -s -s -s -FileType "$TEST_PATH" 2>/dev/null || echo "")
if [ "$ACTUAL_TYPE" != "JPEG" ]; then
  fail_test "Test 26 fixture is not JPEG: $ACTUAL_TYPE"
else
  set +e
  OUTPUT=$("$PROJECT_ROOT/scripts/check-image-metadata" "$TEST_PATH" 2>&1)
  EXIT_CODE=$?
  set -e
  if [ $EXIT_CODE -ne 0 ] && echo "$OUTPUT" | grep -q "IPTC blocks found" && ! echo "$OUTPUT" | grep -q "expected JPEG format"; then
    pass_test "JPEG-as-.png with IPTC fails with IPTC error"
  else
    fail_test "JPEG-as-.png with IPTC should fail with IPTC error (exit=$EXIT_CODE), got: $OUTPUT"
  fi
fi

# Test 27: Stamped PNG at a JPEG-as-.png list path must fail with format error
echo "Test 27: Stamped PNG at JPEG-as-.png list path should fail with format error"
# Create a real PNG (not JPEG) at a listed path, with stamp
mkdir -p "$TEMP_DIR/design/sovrano-v1/editorial-art"
TEST_PNG_PATH="$TEMP_DIR/design/sovrano-v1/editorial-art/04-house-of-sovrano-plate.png"
convert -size 100x100 xc:silver "$TEST_PNG_PATH"
exiftool -q -overwrite_original -Copyright="Property of Infinity Enterprises" "$TEST_PNG_PATH"
# Verify it's PNG
ACTUAL_TYPE=$(exiftool -s -s -s -FileType "$TEST_PNG_PATH" 2>/dev/null || echo "")
if [ "$ACTUAL_TYPE" != "PNG" ]; then
  fail_test "Test 27 fixture is not PNG: $ACTUAL_TYPE"
else
  set +e
  OUTPUT=$("$PROJECT_ROOT/scripts/check-image-metadata" "$TEST_PNG_PATH" 2>&1)
  EXIT_CODE=$?
  set -e
  if [ $EXIT_CODE -eq 1 ] && echo "$OUTPUT" | grep -q "expected JPEG format"; then
    pass_test "Stamped PNG at JPEG-as-.png path fails with format error"
  else
    fail_test "Stamped PNG at JPEG-as-.png path should fail with format error (exit=$EXIT_CODE), got: $OUTPUT"
  fi
fi

# Test 28: Absolute path to stamped PNG at listed path must fail with format error
echo "Test 28: Absolute path to stamped PNG at JPEG-as-.png list path should fail"
# Reuse the fixture from test 27 (already a stamped PNG at a listed path)
# Call with absolute path
mkdir -p "$TEMP_DIR/design/sovrano-v1/editorial-art/covers"
TEST_ABS_PNG="$TEMP_DIR/design/sovrano-v1/editorial-art/covers/cover-mercati.png"
convert -size 100x100 xc:gold "$TEST_ABS_PNG"
exiftool -q -overwrite_original -Copyright="Property of Infinity Enterprises" "$TEST_ABS_PNG"
ACTUAL_TYPE=$(exiftool -s -s -s -FileType "$TEST_ABS_PNG" 2>/dev/null || echo "")
if [ "$ACTUAL_TYPE" != "PNG" ]; then
  fail_test "Test 28 fixture is not PNG: $ACTUAL_TYPE"
else
  set +e
  # Pass absolute path directly
  OUTPUT=$("$PROJECT_ROOT/scripts/check-image-metadata" "$TEST_ABS_PNG" 2>&1)
  EXIT_CODE=$?
  set -e
  if [ $EXIT_CODE -eq 1 ] && echo "$OUTPUT" | grep -q "expected JPEG format"; then
    pass_test "Absolute path to stamped PNG at JPEG-as-.png path fails with format error"
  else
    fail_test "Absolute path to stamped PNG at JPEG-as-.png path should fail with format error (exit=$EXIT_CODE), got: $OUTPUT"
  fi
fi

# Test 29: Stamped PNG at nested lookalike path should pass (guards against suffix matching)
echo "Test 29: Nested lookalike path should not match list (suffix-match guard)"
# Create a stamped PNG at a path that ENDS with a listed name but has extra prefix
# With exact matching, this should NOT match and should pass (PNG with stamp is ok)
# With suffix matching, this WOULD match and fail with "expected JPEG format"
mkdir -p "$TEMP_DIR/sub/design/sovrano-v1/editorial-art/covers"
TEST_NESTED="$TEMP_DIR/sub/design/sovrano-v1/editorial-art/covers/cover-moda.png"
convert -size 100x100 xc:indigo "$TEST_NESTED"
exiftool -q -overwrite_original -Copyright="Property of Infinity Enterprises" "$TEST_NESTED"
ACTUAL_TYPE=$(exiftool -s -s -s -FileType "$TEST_NESTED" 2>/dev/null || echo "")
if [ "$ACTUAL_TYPE" != "PNG" ]; then
  fail_test "Test 29 fixture is not PNG: $ACTUAL_TYPE"
else
  set +e
  OUTPUT=$("$PROJECT_ROOT/scripts/check-image-metadata" "$TEST_NESTED" 2>&1)
  EXIT_CODE=$?
  set -e
  # Should pass (no error) because the path is not exactly on the list
  if [ $EXIT_CODE -eq 0 ]; then
    pass_test "Nested lookalike path not matched (suffix guard works)"
  else
    # If it fails with format error, suffix matching is being used (bad)
    if echo "$OUTPUT" | grep -q "expected JPEG format"; then
      fail_test "Nested lookalike path should not match (suffix matching detected), got: $OUTPUT"
    else
      # Other error - unexpected
      fail_test "Nested lookalike path test failed unexpectedly (exit=$EXIT_CODE), got: $OUTPUT"
    fi
  fi
fi

# Test 30: JPEG-as-.png at nested lookalike path must fail (not on list)
echo "Test 30: JPEG-as-.png at nested lookalike path should fail with unlisted error"
# Reuse the nested path from test 29 but make it JPEG content
mkdir -p "$TEMP_DIR/sub/design/sovrano-v1/editorial-art"
TEST_NESTED_JPEG="$TEMP_DIR/sub/design/sovrano-v1/editorial-art/02-lounge-couple.png"
convert -size 100x100 xc:purple "$TEMP_DIR/nested-jpeg.jpg"
exiftool -q -overwrite_original -Copyright="Property of Infinity Enterprises" "$TEMP_DIR/nested-jpeg.jpg"
mv "$TEMP_DIR/nested-jpeg.jpg" "$TEST_NESTED_JPEG"
ACTUAL_TYPE=$(exiftool -s -s -s -FileType "$TEST_NESTED_JPEG" 2>/dev/null || echo "")
if [ "$ACTUAL_TYPE" != "JPEG" ]; then
  fail_test "Test 30 fixture is not JPEG: $ACTUAL_TYPE"
else
  set +e
  OUTPUT=$("$PROJECT_ROOT/scripts/check-image-metadata" "$TEST_NESTED_JPEG" 2>&1)
  EXIT_CODE=$?
  set -e
  if [ $EXIT_CODE -ne 0 ] && echo "$OUTPUT" | grep -q "JPEG content in .png file not on the allowed list"; then
    pass_test "JPEG-as-.png at nested path fails with unlisted error"
  else
    fail_test "JPEG-as-.png at nested path should fail with unlisted error (exit=$EXIT_CODE), got: $OUTPUT"
  fi
fi

# Test 31: JPEG-as-.png at arbitrary unlisted path must fail
echo "Test 31: JPEG-as-.png at arbitrary unlisted path should fail"
mkdir -p "$TEMP_DIR/arbitrary/path"
TEST_UNLISTED="$TEMP_DIR/arbitrary/path/unlisted.png"
convert -size 100x100 xc:orange "$TEMP_DIR/unlisted.jpg"
exiftool -q -overwrite_original -Copyright="Property of Infinity Enterprises" "$TEMP_DIR/unlisted.jpg"
mv "$TEMP_DIR/unlisted.jpg" "$TEST_UNLISTED"
ACTUAL_TYPE=$(exiftool -s -s -s -FileType "$TEST_UNLISTED" 2>/dev/null || echo "")
if [ "$ACTUAL_TYPE" != "JPEG" ]; then
  fail_test "Test 31 fixture is not JPEG: $ACTUAL_TYPE"
else
  set +e
  OUTPUT=$("$PROJECT_ROOT/scripts/check-image-metadata" "$TEST_UNLISTED" 2>&1)
  EXIT_CODE=$?
  set -e
  if [ $EXIT_CODE -ne 0 ] && echo "$OUTPUT" | grep -q "JPEG content in .png file not on the allowed list"; then
    pass_test "JPEG-as-.png at unlisted path fails with unlisted error"
  else
    fail_test "JPEG-as-.png at unlisted path should fail with unlisted error (exit=$EXIT_CODE), got: $OUTPUT"
  fi
fi

# Test 32: Listed path without ./ prefix works
echo "Test 32: Listed path called without ./ prefix should work"
mkdir -p "$TEMP_DIR/design/sovrano-v1/forge-web-mocks/pages"
TEST_NO_PREFIX="$TEMP_DIR/design/sovrano-v1/forge-web-mocks/pages/01-penthouse-portrait.png"
convert -size 100x100 xc:lime "$TEMP_DIR/no-prefix.jpg"
exiftool -q -overwrite_original -Copyright="Property of Infinity Enterprises" "$TEMP_DIR/no-prefix.jpg"
mv "$TEMP_DIR/no-prefix.jpg" "$TEST_NO_PREFIX"
ACTUAL_TYPE=$(exiftool -s -s -s -FileType "$TEST_NO_PREFIX" 2>/dev/null || echo "")
if [ "$ACTUAL_TYPE" != "JPEG" ]; then
  fail_test "Test 32 fixture is not JPEG: $ACTUAL_TYPE"
else
  # Call with relative path WITHOUT ./ prefix
  cd "$TEMP_DIR"
  set +e
  OUTPUT=$("$PROJECT_ROOT/scripts/check-image-metadata" "design/sovrano-v1/forge-web-mocks/pages/01-penthouse-portrait.png" 2>&1)
  EXIT_CODE=$?
  set -e
  cd "$PROJECT_ROOT"
  if [ $EXIT_CODE -eq 0 ]; then
    pass_test "Listed path without ./ prefix works"
  else
    fail_test "Listed path without ./ prefix should work (exit=$EXIT_CODE), got: $OUTPUT"
  fi
fi

# Test 33: Symlinked IMAGE_CHECK_ROOT with real paths
echo "Test 33: Symlinked IMAGE_CHECK_ROOT with real paths should work"
TEMP_LINK="$TEMP_DIR-link"
ln -sf "$TEMP_DIR" "$TEMP_LINK"
mkdir -p "$TEMP_DIR/design/sovrano-v1/editorial-art/covers"
TEST_SYMLINK_JPEG="$TEMP_DIR/design/sovrano-v1/editorial-art/covers/cover-viaggi.png"
TEST_SYMLINK_PNG="$TEMP_DIR/design/sovrano-v1/editorial-art/covers/cover-tech.png"
# Create stamped JPEG-as-.png at listed path (should pass)
convert -size 100x100 xc:cyan "$TEMP_DIR/symlink-jpeg.jpg"
exiftool -q -overwrite_original -Copyright="Property of Infinity Enterprises" "$TEMP_DIR/symlink-jpeg.jpg"
mv "$TEMP_DIR/symlink-jpeg.jpg" "$TEST_SYMLINK_JPEG"
# Create stamped real PNG at listed path (should fail with format error)
convert -size 100x100 xc:magenta "$TEST_SYMLINK_PNG"
exiftool -q -overwrite_original -Copyright="Property of Infinity Enterprises" "$TEST_SYMLINK_PNG"

set +e
OUTPUT_JPEG=$(IMAGE_CHECK_ROOT="$TEMP_LINK" "$PROJECT_ROOT/scripts/check-image-metadata" "$TEST_SYMLINK_JPEG" 2>&1)
EXIT_JPEG=$?
OUTPUT_PNG=$(IMAGE_CHECK_ROOT="$TEMP_LINK" "$PROJECT_ROOT/scripts/check-image-metadata" "$TEST_SYMLINK_PNG" 2>&1)
EXIT_PNG=$?
set -e

if [ $EXIT_JPEG -eq 0 ] && [ $EXIT_PNG -eq 1 ] && echo "$OUTPUT_PNG" | grep -q "expected JPEG format"; then
  pass_test "Symlinked IMAGE_CHECK_ROOT works (JPEG passes, PNG fails)"
else
  fail_test "Symlinked IMAGE_CHECK_ROOT should work (JPEG exit=$EXIT_JPEG, PNG exit=$EXIT_PNG should be 1 with format error), JPEG: $OUTPUT_JPEG, PNG: $OUTPUT_PNG"
fi

# Test 34: REPO_ROOT with spaces (guards quoted REPO_ROOT)
echo "Test 34: REPO_ROOT path containing spaces should work"
SPACE_DIR=$(mktemp -d -t "image test XXXXX")
mkdir -p "$SPACE_DIR/design/sovrano-v1/editorial-art"
TEST_SPACE_JPEG="$SPACE_DIR/design/sovrano-v1/editorial-art/01-penthouse-portrait.png"
convert -size 100x100 xc:brown "$SPACE_DIR/space-jpeg.jpg"
exiftool -q -overwrite_original -Copyright="Property of Infinity Enterprises" "$SPACE_DIR/space-jpeg.jpg"
mv "$SPACE_DIR/space-jpeg.jpg" "$TEST_SPACE_JPEG"
# Copy scripts for checking
mkdir -p "$SPACE_DIR/scripts"
cp "$PROJECT_ROOT/scripts/check-image-metadata" "$SPACE_DIR/scripts/"
cp "$PROJECT_ROOT/scripts/image-stamp.json" "$SPACE_DIR/scripts/"
set +e
OUTPUT_SPACE=$(IMAGE_CHECK_ROOT="$SPACE_DIR" "$SPACE_DIR/scripts/check-image-metadata" "$TEST_SPACE_JPEG" 2>&1)
EXIT_SPACE=$?
set -e
rm -rf "$SPACE_DIR"
if [ $EXIT_SPACE -eq 0 ]; then
  pass_test "REPO_ROOT with spaces works"
else
  fail_test "REPO_ROOT with spaces should work (exit=$EXIT_SPACE), got: $OUTPUT_SPACE"
fi

# Test 35: Uppercase .PNG with JPEG content should fail (case-insensitive extension check)
echo "Test 35: Uppercase .PNG with JPEG content not on list should fail"
mkdir -p "$TEMP_DIR/uppercase"
TEST_UPPERCASE="$TEMP_DIR/uppercase/test.PNG"
convert -size 100x100 xc:violet "$TEMP_DIR/uppercase-jpeg.jpg"
exiftool -q -overwrite_original -Copyright="Property of Infinity Enterprises" "$TEMP_DIR/uppercase-jpeg.jpg"
mv "$TEMP_DIR/uppercase-jpeg.jpg" "$TEST_UPPERCASE"
ACTUAL_TYPE=$(exiftool -s -s -s -FileType "$TEST_UPPERCASE" 2>/dev/null || echo "")
if [ "$ACTUAL_TYPE" != "JPEG" ]; then
  fail_test "Test 35 fixture is not JPEG: $ACTUAL_TYPE"
else
  set +e
  OUTPUT=$("$PROJECT_ROOT/scripts/check-image-metadata" "$TEST_UPPERCASE" 2>&1)
  EXIT_CODE=$?
  set -e
  if [ $EXIT_CODE -ne 0 ] && echo "$OUTPUT" | grep -q "JPEG content in .png file not on the allowed list"; then
    pass_test "Uppercase .PNG with JPEG content fails (explicit path)"
  else
    fail_test "Uppercase .PNG with JPEG content should fail (exit=$EXIT_CODE), got: $OUTPUT"
  fi
  # Also test whole-tree mode (no file list) - use isolated directory
  ISOLATED_DIR=$(mktemp -d)
  mkdir -p "$ISOLATED_DIR/scripts"
  cp "$PROJECT_ROOT/scripts/check-image-metadata" "$ISOLATED_DIR/scripts/"
  cp "$PROJECT_ROOT/scripts/image-stamp.json" "$ISOLATED_DIR/scripts/"
  cp "$TEST_UPPERCASE" "$ISOLATED_DIR/test.PNG"
  cd "$ISOLATED_DIR"
  set +e
  OUTPUT=$(IMAGE_CHECK_ROOT="$ISOLATED_DIR" "$ISOLATED_DIR/scripts/check-image-metadata" 2>&1)
  EXIT_CODE=$?
  set -e
  cd "$PROJECT_ROOT"
  rm -rf "$ISOLATED_DIR"
  if [ $EXIT_CODE -ne 0 ] && echo "$OUTPUT" | grep -q "JPEG content in .png file not on the allowed list" && echo "$OUTPUT" | grep -q "test.PNG"; then
    pass_test "Uppercase .PNG with JPEG content fails (whole-tree mode)"
  else
    fail_test "Uppercase .PNG with JPEG content should fail in whole-tree mode (exit=$EXIT_CODE), got: $OUTPUT"
  fi
fi

# Test 36: Unidentifiable file should fail (text file named .png)
echo "Test 36: Unidentifiable file (text as .png) should fail"
echo "This is just text, not an image" > "$TEMP_DIR/text-file.png"
set +e
OUTPUT=$("$PROJECT_ROOT/scripts/check-image-metadata" "$TEMP_DIR/text-file.png" 2>&1)
EXIT_CODE=$?
set -e
if [ $EXIT_CODE -ne 0 ] && echo "$OUTPUT" | grep -q "cannot identify file type"; then
  pass_test "Unidentifiable file fails"
else
  fail_test "Unidentifiable file should fail (exit=$EXIT_CODE), got: $OUTPUT"
fi

# Test 37: WebP with wrong copyright should fail (stamp check on WebP)
echo "Test 37: WebP with wrong copyright should fail"
convert -size 100x100 xc:coral "$TEMP_DIR/wrong-stamp.webp"
exiftool -q -overwrite_original -Copyright="Wrong Copyright" "$TEMP_DIR/wrong-stamp.webp"
set +e
OUTPUT=$("$PROJECT_ROOT/scripts/check-image-metadata" "$TEMP_DIR/wrong-stamp.webp" 2>&1)
EXIT_CODE=$?
set -e
if [ $EXIT_CODE -ne 0 ] && echo "$OUTPUT" | grep -q "Ownership stamp missing"; then
  pass_test "WebP with wrong copyright fails"
else
  fail_test "WebP with wrong copyright should fail (exit=$EXIT_CODE), got: $OUTPUT"
fi

# Summary
echo ""
echo "=== Test Summary ==="
echo "Passed: $TESTS_PASSED"
echo "Failed: $TESTS_FAILED"
echo ""

if [ $TESTS_FAILED -eq 0 ]; then
  echo "✓ All tests passed"
  exit 0
else
  echo "✗ Some tests failed"
  exit 1
fi
