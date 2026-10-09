$baseUrl = "http://127.0.0.1:5000/api"

# Register dummy user to get token
$body = @{
    email = "test$(Get-Date -UFormat '%s')@example.com"
    password = "password123"
} | ConvertTo-Json

$response = Invoke-RestMethod -Uri "$baseUrl/auth/register" -Method Post -Body $body -ContentType "application/json"
$token = $response.token

$headers = @{
    Authorization = "Bearer $token"
}

Write-Host "--- WITHOUT CACHE (FIRST REQUEST) ---"
$time1 = Measure-Command {
    $res = Invoke-RestMethod -Uri "$baseUrl/tasks" -Method Get -Headers $headers
}
Write-Host "Request 1 (Miss): $($time1.TotalMilliseconds) ms"

Write-Host "
--- WITH CACHE (SUBSEQUENT REQUESTS) ---"
$time2 = Measure-Command {
    $res = Invoke-RestMethod -Uri "$baseUrl/tasks" -Method Get -Headers $headers
}
Write-Host "Request 2 (Hit): $($time2.TotalMilliseconds) ms"

$time3 = Measure-Command {
    $res = Invoke-RestMethod -Uri "$baseUrl/tasks" -Method Get -Headers $headers
}
Write-Host "Request 3 (Hit): $($time3.TotalMilliseconds) ms"

$time4 = Measure-Command {
    $res = Invoke-RestMethod -Uri "$baseUrl/tasks" -Method Get -Headers $headers
}
Write-Host "Request 4 (Hit): $($time4.TotalMilliseconds) ms"

Write-Host "
--- CACHE STATS ---"
$stats = Invoke-RestMethod -Uri "$baseUrl/tasks/debug/cache-stats" -Method Get
$stats | ConvertTo-Json

