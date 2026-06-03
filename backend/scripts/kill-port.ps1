param([int]$Port = 8082)
$conns = Get-NetTCPConnection -LocalPort $Port -ErrorAction SilentlyContinue
if (-not $conns) {
  Write-Host "Port $Port is free."
  exit 0
}
$pids = $conns.OwningProcess | Select-Object -Unique
foreach ($procId in $pids) {
  $proc = Get-Process -Id $procId -ErrorAction SilentlyContinue
  Write-Host "Stopping PID $procId ($($proc.ProcessName)) on port $Port"
  Stop-Process -Id $procId -Force -ErrorAction SilentlyContinue
}
Write-Host "Port $Port cleared."
