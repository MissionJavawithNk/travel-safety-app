$listener = New-Object System.Net.HttpListener
$listener.Prefixes.Add("http://localhost:3700/")
$listener.Start()
Write-Host "Server running at http://localhost:3700"
while ($listener.IsListening) {
    $ctx = $listener.GetContext()
    $path = $ctx.Request.Url.LocalPath.TrimStart("/")
    if ($path -eq "" -or $path -eq "/") { $path = "index.html" }
    $base = "c:\Users\Naina k\Documents\Seminarproject"
    $filePath = Join-Path $base $path
    if (Test-Path $filePath) {
        $bytes = [System.IO.File]::ReadAllBytes($filePath)
        $ext = [System.IO.Path]::GetExtension($filePath)
        if ($ext -eq ".html") { $mime = "text/html; charset=utf-8" }
        elseif ($ext -eq ".css") { $mime = "text/css" }
        elseif ($ext -eq ".js") { $mime = "application/javascript" }
        else { $mime = "application/octet-stream" }
        $ctx.Response.ContentType = $mime
        $ctx.Response.ContentLength64 = $bytes.Length
        $ctx.Response.OutputStream.Write($bytes, 0, $bytes.Length)
    } else {
        $ctx.Response.StatusCode = 404
    }
    $ctx.Response.Close()
}
