param(
  [string]$GamePath,
  [string]$SaintCoinachPath,
  [string]$OutputPath = (Join-Path $PSScriptRoot '..\source-assets\maps'),
  [ValidateRange(0, 1)]
  [double]$HighlightOpacity = 0.58,
  [ValidateRange(0, 1)]
  [double]$GlowOpacity = 0.035,
  [ValidateRange(0, 24)]
  [int]$GlowRadius = 8,
  [ValidateRange(256, 2048)]
  [int]$PublishSize = 1024,
  [switch]$UseExistingSources,
  [switch]$Publish
)

$ErrorActionPreference = 'Stop'

function Resolve-SqPackPath {
  param([string]$Path)

  $candidates = @(
    (Join-Path $Path 'sqpack'),
    (Join-Path $Path 'game\sqpack'),
    $Path
  )

  foreach ($candidate in $candidates) {
    if (Test-Path -LiteralPath (Join-Path $candidate 'ffxiv')) {
      return (Resolve-Path -LiteralPath $candidate).Path
    }
  }

  throw "找不到游戏 sqpack 目录：$Path"
}

function Get-IconPath {
  param([int]$IconId)

  $fileName = '{0:D6}' -f $IconId
  $block = [int][math]::Floor($IconId / 1000)
  $folder = '{0:D3}000' -f $block
  return "ui/icon/$folder/$fileName.tex"
}

function Export-GameTexture {
  param(
    [object]$Packs,
    [string]$GameFile,
    [string]$Destination
  )

  $directory = Split-Path -Parent $Destination
  New-Item -ItemType Directory -Force -Path $directory | Out-Null

  $file = $Packs.GetFile($GameFile)
  if ($file -isnot [SaintCoinach.Imaging.ImageFile]) {
    throw "游戏文件不是可导出的纹理：$GameFile"
  }

  $image = $file.GetImage()
  try {
    $image.Save($Destination, [System.Drawing.Imaging.ImageFormat]::Png)
  }
  finally {
    $image.Dispose()
  }
}

function New-ComposedRegionMap {
  param(
    [string]$BasePath,
    [object[]]$Highlights,
    [string]$HighlightDirectory,
    [string]$Destination,
    [double]$Opacity,
    [double]$EdgeGlowOpacity,
    [int]$EdgeGlowRadius
  )

  $baseImage = [System.Drawing.Image]::FromFile($BasePath)
  $canvas = [System.Drawing.Bitmap]::new(
    $baseImage.Width,
    $baseImage.Height,
    [System.Drawing.Imaging.PixelFormat]::Format32bppArgb
  )
  $graphics = [System.Drawing.Graphics]::FromImage($canvas)
  $imageAttributes = [System.Drawing.Imaging.ImageAttributes]::new()
  $colorMatrix = [System.Drawing.Imaging.ColorMatrix]::new()
  $colorMatrix.Matrix33 = [single]$Opacity
  $imageAttributes.SetColorMatrix($colorMatrix)

  $glowAttributes = [System.Drawing.Imaging.ImageAttributes]::new()
  $glowMatrix = [System.Drawing.Imaging.ColorMatrix]::new()
  $glowMatrix.Matrix00 = 0
  $glowMatrix.Matrix11 = 0
  $glowMatrix.Matrix22 = 0
  $glowMatrix.Matrix33 = [single]$EdgeGlowOpacity
  $glowMatrix.Matrix40 = 1
  $glowMatrix.Matrix41 = 0.93
  $glowMatrix.Matrix42 = 0.72
  $glowAttributes.SetColorMatrix($glowMatrix)

  $glowOffsets = @()
  if ($EdgeGlowRadius -gt 0 -and $EdgeGlowOpacity -gt 0) {
    foreach ($radius in @([math]::Max(2, [math]::Floor($EdgeGlowRadius / 2)), $EdgeGlowRadius) | Select-Object -Unique) {
      $diagonal = [int][math]::Round($radius * 0.707)
      $glowOffsets += @(
        @(-$radius, 0), @($radius, 0), @(0, -$radius), @(0, $radius),
        @(-$diagonal, -$diagonal), @($diagonal, -$diagonal),
        @(-$diagonal, $diagonal), @($diagonal, $diagonal)
      )
    }
  }

  try {
    $graphics.DrawImage($baseImage, 0, 0, $baseImage.Width, $baseImage.Height)
    $graphics.InterpolationMode = [System.Drawing.Drawing2D.InterpolationMode]::HighQualityBicubic
    $graphics.PixelOffsetMode = [System.Drawing.Drawing2D.PixelOffsetMode]::HighQuality

    foreach ($highlight in $Highlights) {
      $iconName = '{0:D6}.png' -f [int]$highlight.Icon
      $iconPath = Join-Path $HighlightDirectory $iconName
      $icon = [System.Drawing.Image]::FromFile($iconPath)
      try {
        $scale = if ($null -ne $highlight.Scale) { [double]$highlight.Scale } else { 1.0 }
        $width = [int][math]::Round($icon.Width * $scale)
        $height = [int][math]::Round($icon.Height * $scale)
        $x = [int][math]::Round($highlight.X - $width / 2)
        $y = [int][math]::Round($highlight.Y - $height / 2)
        $destinationRectangle = [System.Drawing.Rectangle]::new($x, $y, $width, $height)

        foreach ($offset in $glowOffsets) {
          $glowRectangle = [System.Drawing.Rectangle]::new(
            $x + $offset[0],
            $y + $offset[1],
            $width,
            $height
          )
          $graphics.DrawImage(
            $icon,
            $glowRectangle,
            0,
            0,
            $icon.Width,
            $icon.Height,
            [System.Drawing.GraphicsUnit]::Pixel,
            $glowAttributes
          )
        }

        $graphics.DrawImage(
          $icon,
          $destinationRectangle,
          0,
          0,
          $icon.Width,
          $icon.Height,
          [System.Drawing.GraphicsUnit]::Pixel,
          $imageAttributes
        )
      }
      finally {
        $icon.Dispose()
      }
    }

    New-Item -ItemType Directory -Force -Path (Split-Path -Parent $Destination) | Out-Null
    $canvas.Save($Destination, [System.Drawing.Imaging.ImageFormat]::Png)
  }
  finally {
    $glowAttributes.Dispose()
    $imageAttributes.Dispose()
    $graphics.Dispose()
    $canvas.Dispose()
    $baseImage.Dispose()
  }
}

function Publish-MapImage {
  param(
    [string]$Source,
    [string]$Destination,
    [ValidateRange(256, 2048)]
    [int]$Size = 1024,
    [ValidateRange(1, 100)]
    [long]$JpegQuality = 86
  )

  New-Item -ItemType Directory -Force -Path (Split-Path -Parent $Destination) | Out-Null
  $sourceImage = [System.Drawing.Image]::FromFile($Source)
  $jpegCodec = [System.Drawing.Imaging.ImageCodecInfo]::GetImageEncoders() |
    Where-Object { $_.MimeType -eq 'image/jpeg' } |
    Select-Object -First 1
  $encoderParameters = [System.Drawing.Imaging.EncoderParameters]::new(1)
  $encoderParameters.Param[0] = [System.Drawing.Imaging.EncoderParameter]::new(
    [System.Drawing.Imaging.Encoder]::Quality,
    $JpegQuality
  )

  try {
    $publishedImage = [System.Drawing.Bitmap]::new($Size, $Size, [System.Drawing.Imaging.PixelFormat]::Format24bppRgb)
    $graphics = [System.Drawing.Graphics]::FromImage($publishedImage)
    try {
      $graphics.Clear([System.Drawing.Color]::Black)
      $graphics.CompositingQuality = [System.Drawing.Drawing2D.CompositingQuality]::HighQuality
      $graphics.InterpolationMode = [System.Drawing.Drawing2D.InterpolationMode]::HighQualityBicubic
      $graphics.SmoothingMode = [System.Drawing.Drawing2D.SmoothingMode]::HighQuality
      $graphics.PixelOffsetMode = [System.Drawing.Drawing2D.PixelOffsetMode]::HighQuality
      $graphics.DrawImage($sourceImage, 0, 0, $Size, $Size)
    }
    finally {
      $graphics.Dispose()
    }

    try {
      $publishedImage.Save($Destination, $jpegCodec, $encoderParameters)
    }
    finally {
      $publishedImage.Dispose()
    }
  }
  finally {
    $encoderParameters.Dispose()
    $sourceImage.Dispose()
  }
}

Add-Type -AssemblyName System.Drawing
$resolvedOutputPath = [System.IO.Path]::GetFullPath($OutputPath)
$originalDirectory = Join-Path $resolvedOutputPath 'original'
$highlightDirectory = Join-Path $resolvedOutputPath 'highlights'
$composedDirectory = Join-Path $resolvedOutputPath 'composed'

$maps = @(
  @{ Id = 'world_00'; FileName = 'eorzea.png'; GameFile = 'ui/map/world/00/world00_m.tex'; Highlights = @() },
  @{ Id = 'region_00'; FileName = 'la-noscea.png'; GameFile = 'ui/map/region/00/region00_m.tex'; Highlights = @(
      @{ Icon = 63202; X = 1008; Y = 1342 },
      @{ Icon = 63201; X = 1008; Y = 1342 },
      @{ Icon = 63203; X = 1160; Y = 1261 },
      @{ Icon = 63204; X = 1226; Y = 1533 },
      @{ Icon = 63205; X = 1418; Y = 845 },
      @{ Icon = 63206; X = 573; Y = 793 },
      @{ Icon = 63207; X = 1019; Y = 585 },
      @{ Icon = 63208; X = 1013; Y = 543 },
      @{ Icon = 63209; X = 1503; Y = 1637 },
      @{ Icon = 63210; X = 1486; Y = 1631 },
      @{ Icon = 63212; X = 708; Y = 1820; Scale = 0.5 },
      @{ Icon = 63211; X = 1008; Y = 1342 }
    ) },
  @{ Id = 'region_01'; FileName = 'the-black-shroud.png'; GameFile = 'ui/map/region/01/region01_m.tex'; Highlights = @(
      @{ Icon = 63222; X = 846; Y = 743 },
      @{ Icon = 63221; X = 846; Y = 743 },
      @{ Icon = 63223; X = 881; Y = 1011 },
      @{ Icon = 63224; X = 1334; Y = 682 },
      @{ Icon = 63225; X = 1130; Y = 1405 },
      @{ Icon = 63226; X = 436; Y = 560 },
      @{ Icon = 63227; X = 1213; Y = 1022 },
      @{ Icon = 63228; X = 1229; Y = 1005 }
    ) },
  @{ Id = 'region_02'; FileName = 'thanalan.png'; GameFile = 'ui/map/region/02/region02_m.tex'; Highlights = @(
      @{ Icon = 63243; X = 611; Y = 1171 },
      @{ Icon = 63244; X = 1037; Y = 992 },
      @{ Icon = 63245; X = 1495; Y = 747 },
      @{ Icon = 63246; X = 1380; Y = 1473 },
      @{ Icon = 63247; X = 1008; Y = 539 },
      @{ Icon = 63241; X = 925; Y = 1245 },
      @{ Icon = 63242; X = 925; Y = 1245 },
      @{ Icon = 63251; X = 925; Y = 1245 },
      @{ Icon = 63250; X = 925; Y = 1245 },
      @{ Icon = 63248; X = 950; Y = 1423 },
      @{ Icon = 63249; X = 936; Y = 1407 }
    ) },
  @{ Id = 'region_03'; FileName = 'coerthas.png'; GameFile = 'ui/map/region/03/region03_m.tex'; Highlights = @(
      @{ Icon = 63261; X = 1463; Y = 1386 },
      @{ Icon = 63262; X = 517; Y = 877 },
      @{ Icon = 63263; X = 1347; Y = 1022 },
      @{ Icon = 63264; X = 1347; Y = 906 },
      @{ Icon = 63265; X = 1500; Y = 620 },
      @{ Icon = 63266; X = 1500; Y = 620 }
    ) },
  @{ Id = 'region_05'; FileName = 'abalathias-spine.png'; GameFile = 'ui/map/region/05/region05_m.tex'; Highlights = @(
      @{ Icon = 63321; X = 664; Y = 1391 },
      @{ Icon = 63322; X = 1494; Y = 629 }
    ) },
  @{ Id = 'region_06'; FileName = 'dravania.png'; GameFile = 'ui/map/region/06/region06_m.tex'; Highlights = @(
      @{ Icon = 63301; X = 1408; Y = 1359 },
      @{ Icon = 63302; X = 666; Y = 1519 },
      @{ Icon = 63303; X = 999; Y = 622 },
      @{ Icon = 63304; X = 446; Y = 1175 }
    ) },
  @{ Id = 'region_07'; FileName = 'gyr-abania.png'; GameFile = 'ui/map/region/07/region07_m.tex'; Highlights = @(
      @{ Icon = 63341; X = 497; Y = 733 },
      @{ Icon = 63342; X = 1278; Y = 803 },
      @{ Icon = 63343; X = 1599; Y = 1593 },
      @{ Icon = 63344; X = 806; Y = 374 }
    ) },
  @{ Id = 'region_08'; FileName = 'othard.png'; GameFile = 'ui/map/region/08/region08_m.tex'; Highlights = @(
      @{ Icon = 63361; X = 1454; Y = 1364 },
      @{ Icon = 63362; X = 553; Y = 1534 },
      @{ Icon = 63363; X = 894; Y = 571 }
    ) }
)

New-Item -ItemType Directory -Force -Path $originalDirectory, $highlightDirectory, $composedDirectory | Out-Null

if (-not $UseExistingSources) {
  if ([string]::IsNullOrWhiteSpace($GamePath) -or [string]::IsNullOrWhiteSpace($SaintCoinachPath)) {
    throw '提取游戏资源时必须提供 -GamePath 与 -SaintCoinachPath；仅重新合成时请使用 -UseExistingSources。'
  }

  $saintCoinachDll = Join-Path $SaintCoinachPath 'SaintCoinach.dll'
  if (-not (Test-Path -LiteralPath $saintCoinachDll)) {
    throw "找不到 SaintCoinach.dll：$saintCoinachDll"
  }

  Add-Type -Path $saintCoinachDll
  $sqPackPath = Resolve-SqPackPath -Path $GamePath
  $packs = [SaintCoinach.IO.PackCollection]::new($sqPackPath)

  foreach ($map in $maps) {
    $destination = Join-Path $originalDirectory $map.FileName
    Write-Host "导出底图 $($map.Id) -> $destination"
    Export-GameTexture -Packs $packs -GameFile $map.GameFile -Destination $destination
  }

  $allHighlights = $maps.Highlights | ForEach-Object { $_ } | Sort-Object Icon -Unique
  foreach ($highlight in $allHighlights) {
    $iconName = '{0:D6}.png' -f [int]$highlight.Icon
    $destination = Join-Path $highlightDirectory $iconName
    Write-Host "导出高亮层 $($highlight.Icon) -> $destination"
    Export-GameTexture -Packs $packs -GameFile (Get-IconPath -IconId $highlight.Icon) -Destination $destination
  }
}
else {
  Write-Host "复用现有底图与高亮层：$resolvedOutputPath"
}

foreach ($map in $maps | Where-Object { $_.Highlights.Count -gt 0 }) {
  $basePath = Join-Path $originalDirectory $map.FileName
  $destination = Join-Path $composedDirectory $map.FileName
  Write-Host "合成地区图 $($map.Id) -> $destination"
  New-ComposedRegionMap `
    -BasePath $basePath `
    -Highlights $map.Highlights `
    -HighlightDirectory $highlightDirectory `
    -Destination $destination `
    -Opacity $HighlightOpacity `
    -EdgeGlowOpacity $GlowOpacity `
    -EdgeGlowRadius $GlowRadius
}

if ($Publish) {
  $publicImageDirectory = [System.IO.Path]::GetFullPath(
    (Join-Path $PSScriptRoot '..\public\assets\map\images')
  )

  foreach ($map in $maps) {
    $source = if ($map.Highlights.Count -gt 0) {
      Join-Path $composedDirectory $map.FileName
    }
    else {
      Join-Path $originalDirectory $map.FileName
    }
    $destination = Join-Path $publicImageDirectory "$($map.Id).jpg"
    Write-Host "生成 ${PublishSize}x${PublishSize} 网页地图 $($map.Id) -> $destination"
    Publish-MapImage -Source $source -Destination $destination -Size $PublishSize
  }
}

Write-Host "完成：$resolvedOutputPath"
