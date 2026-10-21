# dreikoerper/werkzeug/last.ps1 — Gesamtauslastung der CPU und Verbrauch der
# eigenen Rechenprozesse, gemittelt über einige Sekunden.
#
#   powershell -ExecutionPolicy Bypass -File werkzeug\last.ps1 [-Sekunden 20]
#
# Die vereinbarte Grenze ist 80 % Gesamtauslastung (bis 21.10.2026: 60 %;
# dann von Felix angehoben). Liegt der Mittelwert darüber, endet das Skript
# mit Exit-Code 1.
#
# Gemessen wird mit dem Leistungszähler „Prozessorzeit (%)" und, als
# Gegenprobe, über die verbrauchte CPU-Zeit der eigenen Prozesse. Die erste
# Fassung las Win32_Processor.LoadPercentage — das zeigte 17 %, während fünf
# Fäden voll rechneten (Zähler: 45 %, CPU-Zeit: 5,0 Kerne). Das Gerät war
# falsch, nicht die Last niedrig.
param([int]$Sekunden = 20)
$muster = 'suche\.mjs|nachpruefen\.mjs|nachbereiten\.mjs|pruef-|werkzeug|bauen\.mjs|uebersicht\.mjs|symbol\.mjs'
$eigene = @(Get-CimInstance Win32_Process -Filter "Name='node.exe'" | Where-Object { $_.CommandLine -match $muster })
$vorher = @{}
foreach ($p in $eigene) { $q = Get-Process -Id $p.ProcessId -ErrorAction SilentlyContinue; if ($q) { $vorher[$p.ProcessId] = $q.TotalProcessorTime.TotalSeconds } }
$t0 = Get-Date
$proben = [math]::Max(2, [int]($Sekunden / 2))
try { $z = (Get-Counter '\Prozessor(_Total)\Prozessorzeit (%)' -SampleInterval 2 -MaxSamples $proben -ErrorAction Stop).CounterSamples | ForEach-Object { $_.CookedValue } }
catch { $z = (Get-Counter '\Processor(_Total)\% Processor Time' -SampleInterval 2 -MaxSamples $proben).CounterSamples | ForEach-Object { $_.CookedValue } }
$dauer = ((Get-Date) - $t0).TotalSeconds
$mittel = ($z | Measure-Object -Average).Average
$max = ($z | Measure-Object -Maximum).Maximum
$kerne = [Environment]::ProcessorCount
$os = Get-CimInstance Win32_OperatingSystem
"CPU gesamt: Mittel {0:N0} %, hoechster Wert {1:N0} % ueber {2:N0} s ({3} Messungen, {4} logische Kerne)" -f $mittel, $max, $dauer, $z.Count, $kerne
"Speicher: frei {0:N1} von {1:N1} GB" -f ($os.FreePhysicalMemory / 1MB), ($os.TotalVisibleMemorySize / 1MB)
foreach ($p in $eigene) {
  $q = Get-Process -Id $p.ProcessId -ErrorAction SilentlyContinue
  if (-not $q) { continue }
  $verbrauch = ($q.TotalProcessorTime.TotalSeconds - $vorher[$p.ProcessId]) / $dauer
  $kurz = $p.CommandLine; if ($kurz.Length -gt 80) { $kurz = $kurz.Substring($kurz.Length - 80) }
  "  eigener Prozess {0}: {1:N1} Kerne ({2:N0} % der CPU), {3:N0} MB, Prioritaet {4}  ...{5}" -f $p.ProcessId, $verbrauch, (100 * $verbrauch / $kerne), ($q.WorkingSet64 / 1MB), $q.PriorityClass, $kurz
}
if ($eigene.Count -gt 1) { "WARNUNG: {0} eigene Rechenprozesse gleichzeitig" -f $eigene.Count }
if ($mittel -gt 80) { "UEBER DER GRENZE von 80 %"; exit 1 }
exit 0
