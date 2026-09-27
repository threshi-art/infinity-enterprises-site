[CmdletBinding()]
param([string]$RepositoryPath = '')
$ErrorActionPreference = 'Stop'
if (-not $RepositoryPath) { $RepositoryPath = Split-Path -Parent $PSScriptRoot }
$taskName = 'Infinity Enterprises Source Sync'
$syncPath = Join-Path $RepositoryPath 'tools\SyncInfinityOneDrive.ps1'
if (-not (Test-Path -LiteralPath $syncPath)) { throw "Sync helper missing: $syncPath" }
$userId = [Security.Principal.WindowsIdentity]::GetCurrent().Name
$powershell = Join-Path $env:SystemRoot 'System32\WindowsPowerShell\v1.0\powershell.exe'
$action = New-ScheduledTaskAction -Execute $powershell -Argument ('-NoProfile -NonInteractive -ExecutionPolicy Bypass -File "{0}"' -f $syncPath) -WorkingDirectory $RepositoryPath
$logon = New-ScheduledTaskTrigger -AtLogOn -User $userId
$repeat = New-ScheduledTaskTrigger -Once -At (Get-Date).AddMinutes(1) -RepetitionInterval (New-TimeSpan -Minutes 15) -RepetitionDuration (New-TimeSpan -Days 3650)
$settings = New-ScheduledTaskSettingsSet -StartWhenAvailable -MultipleInstances IgnoreNew -ExecutionTimeLimit (New-TimeSpan -Minutes 5)
$principal = New-ScheduledTaskPrincipal -UserId $userId -LogonType Interactive -RunLevel Limited
$task = New-ScheduledTask -Action $action -Trigger @($logon, $repeat) -Settings $settings -Principal $principal
Register-ScheduledTask -TaskName $taskName -InputObject $task -Force | Out-Null
$installed = Get-ScheduledTask -TaskName $taskName
Write-Output "$($installed.TaskName): $($installed.State), account $userId, every 15 minutes while signed in."
