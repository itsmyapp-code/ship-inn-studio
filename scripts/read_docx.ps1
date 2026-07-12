param([string]$path, [string]$outputPath)
try {
    Add-Type -AssemblyName System.IO.Compression.FileSystem
    $zip = [System.IO.Compression.ZipFile]::OpenRead($path)
    foreach ($entry in $zip.Entries) {
        if ($entry.FullName -eq 'word/document.xml') {
            $stream = $entry.Open()
            $reader = New-Object System.IO.StreamReader($stream)
            $xmlText = $reader.ReadToEnd()
            $reader.Close()
            $stream.Close()
            
            $xml = [xml]$xmlText
            $ns = New-Object System.Xml.XmlNamespaceManager($xml.NameTable)
            $ns.AddNamespace("w", "http://schemas.openxmlformats.org/wordprocessingml/2006/main")
            
            # Select all paragraphs
            $pNodes = $xml.SelectNodes("//w:p", $ns)
            $text = ""
            foreach ($p in $pNodes) {
                # For each paragraph, collect text from w:t child nodes
                $tNodes = $p.SelectNodes(".//w:t", $ns)
                $pText = ""
                foreach ($t in $tNodes) {
                    $pText += $t.InnerText
                }
                if ($pText.Trim().Length -gt 0) {
                    $text += $pText + "`r`n"
                }
            }
            
            [System.IO.File]::WriteAllText($outputPath, $text)
            Write-Output "Successfully wrote docx text to $outputPath"
        }
    }
    $zip.Dispose()
} catch {
    Write-Output "Error: $_"
}
