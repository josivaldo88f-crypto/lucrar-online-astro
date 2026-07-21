$l = [System.Net.HttpListener]::new()
$l.Prefixes.Add('http://localhost:8001/')
try {
    $l.Start()
    Write-Host 'Server started at http://localhost:8001/'
    while ($l.IsListening) {
        $c = $l.GetContext()
        $r = $c.Response
        $u = $c.Request.Url.LocalPath
        Write-Host "Request for: $u"
        if ($u -eq '/') { $u = '/index.html' }
        $f = Join-Path (Get-Location) $u
        if (Test-Path $f -PathType Leaf) {
            $b = [System.IO.File]::ReadAllBytes($f)
            # Set content type based on extension
            $ext = [System.IO.Path]::GetExtension($f).ToLower()
            switch ($ext) {
                '.html' { $r.ContentType = 'text/html' }
                '.css'  { $r.ContentType = 'text/css' }
                '.js'   { $r.ContentType = 'application/javascript' }
                '.png'  { $r.ContentType = 'image/png' }
                '.jpg'  { $r.ContentType = 'image/jpeg' }
                '.jpeg' { $r.ContentType = 'image/jpeg' }
                '.webp' { $r.ContentType = 'image/webp' }
                '.avif' { $r.ContentType = 'image/avif' }
                default { $r.ContentType = 'application/octet-stream' }
            }
            $r.ContentLength64 = $b.Length
            $r.OutputStream.Write($b, 0, $b.Length)
        } else {
            Write-Host "File not found: $f"
            $r.StatusCode = 404
        }
        $r.Close()
    }
} catch {
    Write-Error $_.Exception.Message
} finally {
    $l.Stop()
}
