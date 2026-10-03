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

# 10. Create a JPEG APP11/JUMBF test case (C2PA marker)
convert -size 100x100 xc:brown "$TEMP_DIR/has-c2pa.jpg"
exiftool -q -overwrite_original -Copyright="Property of Infinity Enterprises" "$TEMP_DIR/has-c2pa.jpg"
# Insert actual jumb string that will be caught by strings command
printf 'jumbf_metadata_here' >> "$TEMP_DIR/has-c2pa.jpg"

# 11. Image with LensModel (should fail)
convert -size 100x100 xc:gray "$TEMP_DIR/has-lens-model.jpg"
exiftool -q -overwrite_original -LensModel="50mm f/1.8" -Copyright="Property of Infinity Enterprises" "$TEMP_DIR/has-lens-model.jpg"

# 12. Image with SerialNumber (should fail)
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

# Test 10: C2PA/JUMBF marker should fail
echo "Test 10: Image with C2PA/JUMBF marker should fail"
if ! "$PROJECT_ROOT/scripts/check-image-metadata" "$TEMP_DIR/has-c2pa.jpg" >/dev/null 2>&1; then
  pass_test "C2PA/JUMBF detection works"
else
  fail_test "C2PA/JUMBF should fail but passed"
fi

# Test 11: LensModel should fail
echo "Test 11: Image with LensModel should fail"
if ! "$PROJECT_ROOT/scripts/check-image-metadata" "$TEMP_DIR/has-lens-model.jpg" >/dev/null 2>&1; then
  pass_test "EXIF LensModel detection works"
else
  fail_test "EXIF LensModel should fail but passed"
fi

# Test 12: SerialNumber should fail
echo "Test 12: Image with SerialNumber should fail"
if ! "$PROJECT_ROOT/scripts/check-image-metadata" "$TEMP_DIR/has-serial.jpg" >/dev/null 2>&1; then
  pass_test "EXIF SerialNumber detection works"
else
  fail_test "EXIF SerialNumber should fail but passed"
fi

# Test 13: Fail closed - missing exiftool
echo "Test 13: Check script fails when exiftool is missing"
RESTRICTED_BIN=$(mktemp -d)
ln -s "$(which node)" "$RESTRICTED_BIN/node"
ln -s "$(which bash)" "$RESTRICTED_BIN/bash"
ln -s "$(which identify)" "$RESTRICTED_BIN/identify"
ln -s "$(which strings)" "$RESTRICTED_BIN/strings"
if OUTPUT=$(timeout 5 env PATH="$RESTRICTED_BIN" "$PROJECT_ROOT/scripts/check-image-metadata" "$TEMP_DIR/clean-stamped.png" 2>&1); then
  fail_test "Check script should fail without exiftool (exit 0)"
elif echo "$OUTPUT" | grep -q "exiftool is not installed"; then
  pass_test "Check script fails closed without exiftool"
else
  fail_test "Check script failed but wrong error message"
fi
rm -rf "$RESTRICTED_BIN"

# Test 14: Fail closed - missing ImageMagick  
echo "Test 14: Check script fails when ImageMagick is missing"
RESTRICTED_BIN=$(mktemp -d)
ln -s "$(which node)" "$RESTRICTED_BIN/node"
ln -s "$(which bash)" "$RESTRICTED_BIN/bash"
ln -s "$(which exiftool)" "$RESTRICTED_BIN/exiftool"
ln -s "$(which strings)" "$RESTRICTED_BIN/strings"
if OUTPUT=$(timeout 5 env PATH="$RESTRICTED_BIN" "$PROJECT_ROOT/scripts/check-image-metadata" "$TEMP_DIR/clean-stamped.png" 2>&1); then
  fail_test "Check script should fail without ImageMagick (exit 0)"
elif echo "$OUTPUT" | grep -q "ImageMagick"; then
  pass_test "Check script fails closed without ImageMagick"
else
  fail_test "Check script failed but wrong error message"
fi
rm -rf "$RESTRICTED_BIN"

# Test 15: Fail closed - scrub script missing exiftool
echo "Test 15: Scrub script fails when exiftool is missing"
RESTRICTED_BIN=$(mktemp -d)
ln -s "$(which node)" "$RESTRICTED_BIN/node"
ln -s "$(which bash)" "$RESTRICTED_BIN/bash"
ln -s "$(which identify)" "$RESTRICTED_BIN/identify"
if OUTPUT=$(timeout 5 env PATH="$RESTRICTED_BIN" "$PROJECT_ROOT/scripts/scrub-image-metadata" "$TEMP_DIR/clean-stamped.png" 2>&1); then
  fail_test "Scrub script should fail without exiftool (exit 0)"
elif echo "$OUTPUT" | grep -q "exiftool is not installed"; then
  pass_test "Scrub script fails closed without exiftool"
else
  fail_test "Scrub script failed but wrong error message"
fi
rm -rf "$RESTRICTED_BIN"

# Test 16: Fail closed - scrub script missing ImageMagick
echo "Test 16: Scrub script fails when ImageMagick is missing"
RESTRICTED_BIN=$(mktemp -d)
ln -s "$(which node)" "$RESTRICTED_BIN/node"
ln -s "$(which bash)" "$RESTRICTED_BIN/bash"
ln -s "$(which exiftool)" "$RESTRICTED_BIN/exiftool"
if OUTPUT=$(timeout 5 env PATH="$RESTRICTED_BIN" "$PROJECT_ROOT/scripts/scrub-image-metadata" "$TEMP_DIR/clean-stamped.png" 2>&1); then
  fail_test "Scrub script should fail without ImageMagick (exit 0)"
elif echo "$OUTPUT" | grep -q "ImageMagick"; then
  pass_test "Scrub script fails closed without ImageMagick"
else
  fail_test "Scrub script failed but wrong error message"
fi
rm -rf "$RESTRICTED_BIN"

# Test 17: File list argument - only listed files are modified
echo "Test 17: Scrub script with file list only modifies listed files"
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

# Test 18: Scrub script fails when file is skipped
echo "Test 18: Scrub script exits non-zero when file is skipped"
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
