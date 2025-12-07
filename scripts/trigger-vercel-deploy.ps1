<#
Trigger Vercel Deploy Hook and optionally wait for the deployment to appear.

Usage (PowerShell):
  $env:VERCEL_HOOK_URL = 'https://api.vercel.com/v1/integrations/deploy/PUT_YOUR_HOOK_ID'
  $env:VERCEL_TOKEN = 'your_vercel_token'            # optional, required to poll the deployments API
  $env:VERCEL_PROJECT_ID = 'prj_RzmUYkdnLtyxwLLAjjAtz4HmEHoW' # optional, main site project id
  .\scripts\trigger-vercel-deploy.ps1

If `VERCEL_TOKEN` is not set the script will still trigger the hook but won't poll for completion.
#>

param()

function Fail([string]$msg) {
    Write-Host "ERROR: $msg" -ForegroundColor Red
    exit 1
}

$hook = $env:VERCEL_HOOK_URL
if (-not $hook) {
    Fail 'Set the environment variable `VERCEL_HOOK_URL` to your Vercel Deploy Hook URL before running.'
}

Write-Host "Triggering Vercel deploy hook: $hook"
try {
    Invoke-RestMethod -Uri $hook -Method Post -ContentType 'application/json' -Body '{}' -ErrorAction Stop | Out-Null
    Write-Host 'Hook triggered successfully.' -ForegroundColor Green
} catch {
    Fail "Failed to trigger hook: $($_.Exception.Message)"
}

# If no token is provided, we can't poll the Vercel API - exit after triggering.
if (-not $env:VERCEL_TOKEN) {
    Write-Host "VERCEL_TOKEN not set - not polling. Check the Vercel dashboard for deployment progress." -ForegroundColor Yellow
    exit 0
}

$projectId = $env:VERCEL_PROJECT_ID
if (-not $projectId) {
    Write-Host "VERCEL_PROJECT_ID not set - attempting to detect latest deployment for any project (may be ambiguous)." -ForegroundColor Yellow
}

$headers = @{ Authorization = "Bearer $env:VERCEL_TOKEN" }

function Get-LatestDeploymentId($proj) {
    if ($proj) {
        $url = "https://api.vercel.com/v6/deployments?projectId=$proj"
    } else {
        $url = "https://api.vercel.com/v6/deployments"
    }
    $resp = Invoke-RestMethod -Uri $url -Headers $headers -ErrorAction Stop
    if ($null -eq $resp.deployments -or $resp.deployments.Count -eq 0) { return $null }
    return $resp.deployments[0].id
}

try {
    $seen = Get-LatestDeploymentId $projectId
} catch {
    Fail "Failed to query deployments: $($_.Exception.Message)"
}

if (-not $seen) { Write-Host "No existing deployments found; waiting for first deployment..." }
else { Write-Host "Current latest deployment id: $seen" }

Write-Host "Polling for a new deployment (Ctrl+C to cancel)..."
for (;;) {
    Start-Sleep -Seconds 6
    try {
        $latest = Get-LatestDeploymentId $projectId
    } catch {
        Write-Host "Warning: failed to fetch deployments: $($_.Exception.Message)" -ForegroundColor Yellow
        continue
    }
    if ($latest -and ($latest -ne $seen)) {
        Write-Host "New deployment detected: $latest" -ForegroundColor Green
        # fetch deployment details
        $detailUrl = "https://api.vercel.com/v6/deployments/$latest"
        try {
            $detail = Invoke-RestMethod -Uri $detailUrl -Headers $headers -ErrorAction Stop
            if ($detail.url) { Write-Host "Deployment ready at: https://$($detail.url)" -ForegroundColor Cyan }
            else { Write-Host "Deployment created (id: $latest) - open Vercel dashboard to view." }
        } catch {
            Write-Host "Deployment created (id: $latest). Failed to fetch details: $($_.Exception.Message)" -ForegroundColor Yellow
        }
        exit 0
    }
    Write-Host "No new deployment yet..."
}
