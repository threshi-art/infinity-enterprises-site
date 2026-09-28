# Installs or replaces the sync scheduled task with the same name.
# Copies the sync script to %LOCALAPPDATA%\InfinitySync\ and registers the task against that copy.
[CmdletBinding()]
param(
  [string]$RepositoryPath = '',
  [Parameter(Mandatory=$true)]
  [string]$Destination
)
$ErrorActionPreference = 'Stop'
# Strip trailing path separators so the value can be safely quoted in task arguments.
# A trailing backslash would escape the closing quote on the Windows command line.
$Destination = $Destination.TrimEnd('\', '/')
if ($Destination -match '^[A-Za-z]:$') { throw "-Destination cannot be a drive root. Use a folder, e.g. D:\InfinitySite" }
if (-not $RepositoryPath) { $RepositoryPath = Split-Path -Parent $PSScriptRoot }
$taskName = 'Infinity Enterprises Source Sync'
$syncPath = Join-Path $RepositoryPath 'tools\SyncInfinityOneDrive.ps1'
if (-not (Test-Path -LiteralPath $syncPath)) { throw "Sync helper missing: $syncPath" }
$localDir = Join-Path $env:LOCALAPPDATA 'InfinitySync'
if (-not (Test-Path -LiteralPath $localDir)) {
  New-Item -ItemType Directory -Path $localDir -Force | Out-Null
}
$localSyncPath = Join-Path $localDir 'SyncInfinityOneDrive.ps1'
Copy-Item -LiteralPath $syncPath -Destination $localSyncPath -Force
$userId = [Security.Principal.WindowsIdentity]::GetCurrent().Name
$powershell = Join-Path $env:SystemRoot 'System32\WindowsPowerShell\v1.0\powershell.exe'
$action = New-ScheduledTaskAction -Execute $powershell -Argument ('-NoProfile -NonInteractive -ExecutionPolicy Bypass -File "{0}" -Destination "{1}"' -f $localSyncPath, $Destination) -WorkingDirectory $localDir
$logon = New-ScheduledTaskTrigger -AtLogOn -User $userId
$repeat = New-ScheduledTaskTrigger -Once -At (Get-Date).AddMinutes(1) -RepetitionInterval (New-TimeSpan -Minutes 15) -RepetitionDuration (New-TimeSpan -Days 3650)
$settings = New-ScheduledTaskSettingsSet -StartWhenAvailable -MultipleInstances IgnoreNew -ExecutionTimeLimit (New-TimeSpan -Minutes 5)
$principal = New-ScheduledTaskPrincipal -UserId $userId -LogonType Interactive -RunLevel Limited
$task = New-ScheduledTask -Action $action -Trigger @($logon, $repeat) -Settings $settings -Principal $principal
Register-ScheduledTask -TaskName $taskName -InputObject $task -Force | Out-Null
$installed = Get-ScheduledTask -TaskName $taskName
Write-Output "$($installed.TaskName): $($installed.State), account $userId, every 15 minutes while signed in."
