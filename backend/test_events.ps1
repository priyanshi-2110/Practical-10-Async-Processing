$baseUrl = "http://127.0.0.1:5000/api"

# 1. Register a dummy user to get the token
$body = @{
    email = "test$(Get-Date -UFormat '%s')@example.com"
    password = "password123"
} | ConvertTo-Json

$response = Invoke-RestMethod -Uri "$baseUrl/auth/register" -Method Post -Body $body -ContentType "application/json"
$token = $response.token

$headers = @{
    Authorization = "Bearer $token"
}

Write-Host "Token received. Creating a task..."

# 2. Create a task (Should trigger 'task-created' event)
$taskBody = @{
    title = "Learn Node.js Events"
    description = "Practical 10 Assignment"
    priority = "high"
} | ConvertTo-Json

$taskResponse = Invoke-RestMethod -Uri "$baseUrl/tasks" -Method Post -Body $taskBody -Headers $headers -ContentType "application/json"
Write-Host "Task Created! API Response received."

# Wait 3 seconds to let the background 'task-created' event fire
Start-Sleep -Seconds 3

Write-Host "Deleting the task..."
# 3. Delete the task (Should trigger 'task-deleted' event)
$taskId = $taskResponse._id
Invoke-RestMethod -Uri "$baseUrl/tasks/$taskId" -Method Delete -Headers $headers

Write-Host "Done!"
