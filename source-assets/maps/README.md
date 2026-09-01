# 本地游戏地图素材

这些文件由 `scripts/extract-ffxiv-maps.ps1` 直接从本机《最终幻想 XIV》游戏包提取，不经过第三方地图站。

- `original/`：9 张来自 `ui/map` 的 2048×2048 原始底图。
- `highlights/`：50 张透明子地区纹理，来自 `ui/icon/063000`。
- `composed/`：8 张完整地区图，默认以 58% 不透明度烘焙全部有效子地区，并加入轻微浅金色边缘光晕。

从游戏包重新提取时需要显式传入本机路径：

```powershell
.\scripts\extract-ffxiv-maps.ps1 `
  -GamePath 'D:\Games\FINAL FANTASY XIV\game' `
  -SaintCoinachPath 'D:\Tools\SaintCoinach.Cmd' `
  -Publish
```

已有 `original/` 与 `highlights/` 时，可以跳过游戏资源提取，只重新合成并发布 1024×1024 地图：

```powershell
.\scripts\extract-ffxiv-maps.ps1 -UseExistingSources -Publish
```

高层地图并不是单张完整纹理。`ui/map/region/*/*_m.tex` 是较暗的底图，亮色子地区则以 1024×1024 透明纹理保存在 `ui/icon/063000/`。高亮纹理需要以 `MapMarker` 中的 2048 坐标为中心叠加到底图上。

合成范围包含八张地区图中具有 `MapMarkerRegion` 的全部 50 个有效条目，包括野外地区、主城上下层、住宅区、田园郡、神拳痕等特殊地点。跨地区跳转箭头和普通地图图标不会被误当作地区纹理烘焙。
