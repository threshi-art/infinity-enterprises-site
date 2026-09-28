#!/usr/bin/env python3
"""
Build comparison boards from individual room screenshots
Deterministic image composition using PIL
"""

from PIL import Image, ImageDraw, ImageFont
import os

# Paths
mock_dir = '/workspace/design/issue-mocks/issue-35-v2'
artifact_dir = '/opt/cursor/artifacts/issue-35-v2'

rooms = ['music', 'tech-lounge', 'food']
room_labels = ['Music', 'Tech@Lounge', 'Food']

def verify_image_variance(img_path, name):
    """Verify image has real content (not all black or all white)"""
    img = Image.open(img_path)
    grayscale = img.convert('L')
    
    # Get pixel data
    pixels = list(grayscale.getdata())
    
    # Calculate stats
    min_val = min(pixels)
    max_val = max(pixels)
    mean_val = sum(pixels) / len(pixels)
    
    # Check for solid colors
    is_all_black = (min_val == 0 and max_val == 0)
    is_all_white = (min_val == 255 and max_val == 255)
    is_solid = (min_val == max_val)
    
    print(f"  {name}:")
    print(f"    Min: {min_val}, Max: {max_val}, Mean: {mean_val:.2f}")
    print(f"    Solid color: {is_solid}, All black: {is_all_black}, All white: {is_all_white}")
    
    if is_all_black or is_all_white or is_solid:
        raise ValueError(f"{name} appears to be a solid color image!")
    
    return min_val, max_val, mean_val


print("Building desktop comparison (1440px width per room)...\n")

# Load individual desktop screenshots
desktop_images = []
for room in rooms:
    img_path = os.path.join(mock_dir, f'{room}-desktop-1440.png')
    img = Image.open(img_path)
    desktop_images.append(img)
    print(f"Loaded {room}-desktop-1440.png: {img.size}")

# Create composite (side by side, take max height)
max_height = max(img.height for img in desktop_images)
total_width = sum(img.width for img in desktop_images)

desktop_composite = Image.new('RGB', (total_width, max_height), color='black')

# Paste images side by side
x_offset = 0
for i, img in enumerate(desktop_images):
    desktop_composite.paste(img, (x_offset, 0))
    print(f"Pasted {rooms[i]} at x={x_offset}")
    x_offset += img.width

# Save desktop comparison
desktop_path = os.path.join(mock_dir, 'compare-desktop.png')
desktop_composite.save(desktop_path, 'PNG')
print(f"\nSaved: {desktop_path} ({desktop_composite.size})")

# Also save to artifacts
desktop_artifact_path = os.path.join(artifact_dir, 'compare-desktop.png')
desktop_composite.save(desktop_artifact_path, 'PNG')
print(f"Saved: {desktop_artifact_path}")


print("\n" + "="*60)
print("Building phone comparison (390px width per room)...\n")

# Load individual phone screenshots
phone_images = []
for room in rooms:
    img_path = os.path.join(mock_dir, f'{room}-phone-390.png')
    img = Image.open(img_path)
    phone_images.append(img)
    print(f"Loaded {room}-phone-390.png: {img.size}")

# Create composite (side by side, take max height)
max_height = max(img.height for img in phone_images)
total_width = sum(img.width for img in phone_images)

phone_composite = Image.new('RGB', (total_width, max_height), color='black')

# Paste images side by side
x_offset = 0
for i, img in enumerate(phone_images):
    phone_composite.paste(img, (x_offset, 0))
    print(f"Pasted {rooms[i]} at x={x_offset}")
    x_offset += img.width

# Save phone comparison
phone_path = os.path.join(mock_dir, 'compare-phone.png')
phone_composite.save(phone_path, 'PNG')
print(f"\nSaved: {phone_path} ({phone_composite.size})")

# Also save to artifacts
phone_artifact_path = os.path.join(artifact_dir, 'compare-phone.png')
phone_composite.save(phone_artifact_path, 'PNG')
print(f"Saved: {phone_artifact_path}")


print("\n" + "="*60)
print("VERIFICATION: Image variance checks\n")

# Verify desktop comparison
print("Desktop comparison:")
desk_stats = verify_image_variance(desktop_path, 'compare-desktop.png')

print("\nPhone comparison:")
phone_stats = verify_image_variance(phone_path, 'compare-phone.png')

print("\n✓ All comparisons verified with real content")
print(f"Desktop comparison: {os.path.getsize(desktop_path)} bytes")
print(f"Phone comparison: {os.path.getsize(phone_path)} bytes")
