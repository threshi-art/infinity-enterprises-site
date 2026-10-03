#!/usr/bin/env bash
set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_ROOT="$(cd "$SCRIPT_DIR/.." && pwd)"
FIXTURES_DIR="$SCRIPT_DIR/fixtures/images"
TEMP_DIR=$(mktemp -d)

trap 'rm -rf "$TEMP_DIR"' EXIT

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
# Create a JPEG file with .png extension at a listed path, no stamp
mkdir -p "$TEMP_DIR/design/sovrano-v1/editorial-art"
convert -size 100x100 xc:teal "$TEMP_DIR/design/sovrano-v1/editorial-art/01-penthouse-portrait.png"
# The above creates a PNG by default, convert it to JPEG format but keep .png extension
convert "$TEMP_DIR/design/sovrano-v1/editorial-art/01-penthouse-portrait.png" -format jpeg "$TEMP_DIR/design/sovrano-v1/editorial-art/01-penthouse-portrait.png"
if ! "$PROJECT_ROOT/scripts/check-image-metadata" "$TEMP_DIR/design/sovrano-v1/editorial-art/01-penthouse-portrait.png" >/dev/null 2>&1; then
  pass_test "JPEG-as-.png without stamp fails"
else
  fail_test "JPEG-as-.png without stamp should fail"
fi

# Test 24: JPEG-as-.png with EXIF device fields should fail
echo "Test 24: JPEG-as-.png with EXIF device fields should fail"
# Create JPEG with device fields at a listed path
convert -size 100x100 xc:navy "$TEMP_DIR/has-jpeg-png-device.jpg"
exiftool -q -overwrite_original -Make="TestCamera" -Copyright="Property of Infinity Enterprises" "$TEMP_DIR/has-jpeg-png-device.jpg"
# Move to a JPEG-as-.png path
mkdir -p "$TEMP_DIR/design/sovrano-v1/editorial-art/covers"
mv "$TEMP_DIR/has-jpeg-png-device.jpg" "$TEMP_DIR/design/sovrano-v1/editorial-art/covers/cover-daily-desk.png"
if ! "$PROJECT_ROOT/scripts/check-image-metadata" "$TEMP_DIR/design/sovrano-v1/editorial-art/covers/cover-daily-desk.png" >/dev/null 2>&1; then
  pass_test "JPEG-as-.png with device fields fails"
else
  fail_test "JPEG-as-.png with device fields should fail"
fi

# Test 25: JPEG-as-.png with XMP should fail
echo "Test 25: JPEG-as-.png with XMP should fail"
convert -size 100x100 xc:olive "$TEMP_DIR/has-jpeg-png-xmp.jpg"
exiftool -q -overwrite_original -XMP:Creator="Test Creator" -Copyright="Property of Infinity Enterprises" "$TEMP_DIR/has-jpeg-png-xmp.jpg"
mkdir -p "$TEMP_DIR/design/sovrano-v1/editorial-art"
mv "$TEMP_DIR/has-jpeg-png-xmp.jpg" "$TEMP_DIR/design/sovrano-v1/editorial-art/02-lounge-couple.png"
if ! "$PROJECT_ROOT/scripts/check-image-metadata" "$TEMP_DIR/design/sovrano-v1/editorial-art/02-lounge-couple.png" >/dev/null 2>&1; then
  pass_test "JPEG-as-.png with XMP fails"
else
  fail_test "JPEG-as-.png with XMP should fail"
fi

# Test 26: JPEG-as-.png with IPTC should fail
echo "Test 26: JPEG-as-.png with IPTC should fail"
convert -size 100x100 xc:maroon "$TEMP_DIR/has-jpeg-png-iptc.jpg"
exiftool -q -overwrite_original -IPTC:By-line="Test Byline" -Copyright="Property of Infinity Enterprises" "$TEMP_DIR/has-jpeg-png-iptc.jpg"
mkdir -p "$TEMP_DIR/design/sovrano-v1/editorial-art"
mv "$TEMP_DIR/has-jpeg-png-iptc.jpg" "$TEMP_DIR/design/sovrano-v1/editorial-art/03-motore-chrome.png"
if ! "$PROJECT_ROOT/scripts/check-image-metadata" "$TEMP_DIR/design/sovrano-v1/editorial-art/03-motore-chrome.png" >/dev/null 2>&1; then
  pass_test "JPEG-as-.png with IPTC fails"
else
  fail_test "JPEG-as-.png with IPTC should fail"
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
