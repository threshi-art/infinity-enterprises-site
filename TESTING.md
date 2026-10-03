# Testing

## Image Metadata Check

The `scripts/check-image-metadata` script validates that images in the repository meet metadata compliance requirements. It checks for:

- C2PA/JUMBF provenance data
- GPS location data
- EXIF device/author fields (Make, Model, Artist, Software, LensModel, SerialNumber, etc.)
- XMP blocks
- IPTC blocks
- Required ownership stamp in EXIF Copyright field
- Format mismatches for known JPEG files with `.png` extensions
- **JPEG content in `.png` files**: JPEG bytes in a `.png` file are only allowed at paths explicitly listed in the script. Any unlisted `.png` containing JPEG data fails the check.

### Usage

```bash
# Check all images in the repository
npm run check:images

# Check specific images
scripts/check-image-metadata path/to/image1.png path/to/image2.jpg
```

### Path Resolution

The script resolves all input paths (relative or absolute) to absolute paths, then makes them relative to the repository root for list matching. This ensures consistent behavior regardless of how paths are passed.

**Repository root:** By default, the script uses its parent directory (`$SCRIPT_DIR/..`) as the repository root.

**Override for testing:** Set the `IMAGE_CHECK_ROOT` environment variable to use a different root directory:

```bash
IMAGE_CHECK_ROOT=/tmp/test-dir scripts/check-image-metadata /tmp/test-dir/design/file.png
```

The script performs **exact path matching** against the known JPEG-as-.png list. A file must be at the exact listed path (relative to the root) to receive special JPEG format validation. Files at nested or prefixed paths (e.g., `sub/design/file.png` when only `design/file.png` is listed) do not match.

### Test Suite

**Important:** Run `npm run build` before running tests, as `npm test` depends on the built worker.

Run the image metadata test suite:

```bash
npm run check:images:test
```

Run all tests (Node + image):

```bash
npm test
```

The test suite uses `IMAGE_CHECK_ROOT` to test path resolution with temporary fixtures.
