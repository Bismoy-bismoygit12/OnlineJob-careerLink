$body = @{
    email = "bismoyxyz@gmail.com"
    password = "123456"
} | ConvertTo-Json

$headers = @{
    "Content-Type" = "application/json"
}

try {
    $response = Invoke-WebRequest -Uri "http://localhost:5000/api/auth/admin/login" `
        -Method Post `
        -Headers $headers `
        -Body $body `
        -UseBasicParsing
    
    $json = $response.Content | ConvertFrom-Json
    Write-Host "✅ SUCCESS" -ForegroundColor Green
    Write-Host "Response Status: $($response.StatusCode)"
    Write-Host "Message: $($json.message)"
    Write-Host "Role: $($json.user.role)"
    Write-Host "Email: $($json.user.email)"
    Write-Host "Token received: Yes"
    Write-Host ""
    Write-Host "Full Response:"
    Write-Host ($json | ConvertTo-Json)
} catch {
    Write-Host "❌ ERROR: $($_.Exception.Message)" -ForegroundColor Red
}
