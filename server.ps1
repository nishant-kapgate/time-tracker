$listener = New-Object System.Net.HttpListener
$listener.Prefixes.Add('http://localhost:9000/')
$listener.Start()

Write-Host "HTTP Server running at http://localhost:9000/"
Write-Host "Press Ctrl+C to stop the server"

# Define content types map
$contentTypes = @{
    ".html" = "text/html";
    ".css"  = "text/css";
    ".js"   = "text/javascript";
    ".jpg"  = "image/jpeg";
    ".jpeg" = "image/jpeg";
    ".png"  = "image/png";
    ".gif"  = "image/gif";
    ".svg"  = "image/svg+xml";
    ".ico"  = "image/x-icon";
    ".json" = "application/json";
    ".woff" = "font/woff";
    ".woff2" = "font/woff2";
    ".ttf"  = "font/ttf";
    ".eot"  = "application/vnd.ms-fontobject";
    ".otf"  = "font/otf";
    ".txt"  = "text/plain";
    ".xml"  = "text/xml";
}

try {
    while ($listener.IsListening) {
        try {
            $context = $listener.GetContext()
            $request = $context.Request
            $response = $context.Response
            
            $localPath = $request.Url.LocalPath
            $localPath = $localPath -replace '/', '\'
            
            # Default to index.html for root path
            if ($localPath -eq '\') {
                $localPath = '\index.html'
            }
            
            # Build the file path
            $filePath = Join-Path (Get-Location).Path $localPath.Substring(1)
            
            Write-Host "Request: $($request.Url.ToString()) -> $filePath"
            
            if (Test-Path $filePath) {
                # Determine content type based on file extension
                $extension = [System.IO.Path]::GetExtension($filePath).ToLower()
                $contentType = "application/octet-stream" # Default content type
                
                if ($contentTypes.ContainsKey($extension)) {
                    $contentType = $contentTypes[$extension]
                }
                
                try {
                    # Read file content as bytes
                    $fileContent = [System.IO.File]::ReadAllBytes($filePath)
                    $response.ContentType = $contentType
                    $response.ContentLength64 = $fileContent.Length
                    
                    # Add CORS headers to allow requests from any origin
                    $response.Headers.Add("Access-Control-Allow-Origin", "*")
                    $response.Headers.Add("Access-Control-Allow-Methods", "GET, POST, OPTIONS")
                    $response.Headers.Add("Access-Control-Allow-Headers", "Content-Type")
                    
                    # Write the content to the response stream
                    $response.OutputStream.Write($fileContent, 0, $fileContent.Length)
                    
                    Write-Host "  Served: $filePath ($contentType, $($fileContent.Length) bytes)"
                }
                catch {
                    Write-Host "  Error reading file: $filePath - $_" -ForegroundColor Red
                    $response.StatusCode = 500
                    $response.StatusDescription = "Internal Server Error"
                    $errorMessage = "500 - Internal Server Error: $_"
                    $buffer = [System.Text.Encoding]::UTF8.GetBytes($errorMessage)
                    $response.ContentLength64 = $buffer.Length
                    $response.OutputStream.Write($buffer, 0, $buffer.Length)
                }
            }
            else {
                Write-Host "  Not Found: $filePath" -ForegroundColor Yellow
                $response.StatusCode = 404
                $response.StatusDescription = "Not Found"
                $notFoundMessage = "404 - File Not Found: $localPath"
                $buffer = [System.Text.Encoding]::UTF8.GetBytes($notFoundMessage)
                $response.ContentLength64 = $buffer.Length
                $response.OutputStream.Write($buffer, 0, $buffer.Length)
            }
            
            # Close the response
            $response.Close()
        }
        catch {
            Write-Host "Error handling request: $_" -ForegroundColor Red
        }
    }
}
catch {
    Write-Host "Server error: $_" -ForegroundColor Red
}
finally {
    # Stop the listener when done
    $listener.Stop()
    Write-Host "Server stopped" -ForegroundColor Green
} 