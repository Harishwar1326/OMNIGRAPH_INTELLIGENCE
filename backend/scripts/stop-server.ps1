# Stops processes on PORT from backend/.env plus common fallback ports 8081/8082
$root = Split-Path $PSScriptRoot -Parent
$envFile = Join-Path $root ".env"
$ports = @(8081, 8082)

if (Test-Path $envFile) {
  $portLine = Get-Content $envFile | Where-Object { $_ -match '^\s*PORT\s*=' } | Select-Object -First 1
  if ($portLine) {
    $parsed = [int](($portLine -split '=', 2)[1].Trim())
    if ($parsed -gt 0) { $ports += $parsed }
  }
}

foreach ($port in ($ports | Select-Object -Unique)) {
  & (Join-Path $PSScriptRoot "kill-port.ps1") -Port $port
}
