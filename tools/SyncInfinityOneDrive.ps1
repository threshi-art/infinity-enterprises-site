# Pull the Infinity Enterprises source into the requested OneDrive folder.
# Stops before changing a folder with unrelated files or uncommitted edits.
[CmdletBinding()]
param(
  [string]$Destination = (Join-Path $env:USERPROFILE 'OneDrive\Documents\Projects\Websites\Infinity\infinity-enterprises-site')
)

$ErrorActionPreference = 'Stop'
$repository = 'https://github.com/threshi-art/infinity-enterprises-site.git'

if (-not (Get-Command git -ErrorAction SilentlyContinue)) {
  throw 'Git for Windows is required.'
}

$parent = Split-Path -Parent $Destination
if (-not (Test-Path -LiteralPath $parent)) {
  New-Item -ItemType Directory -Path $parent -Force | Out-Null
}

if (-not (Test-Path -LiteralPath $Destination)) {
  & git clone $repository $Destination
  if ($LASTEXITCODE -ne 0) { throw 'Initial clone failed.' }
  Write-Host "Infinity source cloned to $Destination"
  exit 0
}

if (-not (Test-Path -LiteralPath (Join-Path $Destination '.git'))) {
  if (@(Get-ChildItem -LiteralPath $Destination -Force).Count -gt 0) {
    throw 'Destination contains files but is not a Git clone. No files were changed.'
  }
  & git clone $repository $Destination
  if ($LASTEXITCODE -ne 0) { throw 'Initial clone into the empty folder failed.' }
  Write-Host "Infinity source cloned to $Destination"
  exit 0
}

$origin = (& git -C $Destination remote get-url origin).Trim()
if ($LASTEXITCODE -ne 0 -or $origin -notin @(
  'https://github.com/threshi-art/infinity-enterprises-site.git',
  'git@github.com:threshi-art/infinity-enterprises-site.git'
)) {
  throw 'The existing folder points to a different Git repository. No files were changed.'
}

$branch = (& git -C $Destination branch --show-current).Trim()
if ($LASTEXITCODE -ne 0 -or $branch -ne 'main') {
  throw 'The existing clone is not on main. No files were changed.'
}

$changes = @(& git -C $Destination status --porcelain)
if ($LASTEXITCODE -ne 0 -or $changes.Count -gt 0) {
  throw 'The existing clone has local edits. Commit or review them before syncing.'
}

& git -C $Destination fetch origin main
if ($LASTEXITCODE -ne 0) { throw 'Fetch failed. Check GitHub authentication.' }
& git -C $Destination merge --ff-only origin/main
if ($LASTEXITCODE -ne 0) { throw 'Local and remote histories have diverged. No force update was used.' }

$revision = (& git -C $Destination rev-parse --short HEAD).Trim()
Write-Host "Infinity source is current at $revision in $Destination"
