#### 1、坐标系统和画圆

```glsl
void mainImage(out vec4 fragColor, in vec2 fragCoord) {
  // 归一化坐标到 -1 1
  vec2 uv = (2. * fragCoord - iResolution.xy) / min(iResolution.x, iResolution.y);
  // 动态改变颜色
  // vec3 col = 0.5 + 0.5 * cos(iTime + uv.xyx + vec3(0,2,4));

  float c = length(uv);
  // 0 黑 1白
  // c = smoothstep(0.2, 0.19, c);
  c = 1.0 - smoothstep(0.2, 0.19, c);
  fragColor = vec4(vec3(c), 1.0);
}
```





#### fwidth 函数

2*2 像素组  fwidth(v) = abs(ddx(v) + ddy(v)) ddx(p(x,y))=p(x+1,y)-p(x,y) 

fwidth则反映了相邻像素在屏幕空间上的距离差值.

```glsl
  // fwidth(v) = abs(ddx(v) + ddy(v))
  // ddx(p(x,y))=p(x+1,y)-p(x,y)
  // fwidth则反映了相邻像素在屏幕空间上的距离差值.

  // 返回小数部分
  vec2 cell = fract(uv);
  // 画坐标白线
  if (cell.x < fwidth(uv.x)) {
    col = vec3(1.0);
  }
  if (cell.y < fwidth(uv.y)) {
    col = vec3(1.0);
  }

  // XY轴坐标单独画红绿色线
  if (abs(uv.y) < fwidth(uv.y)) {
    col = vec3(0.0,1.0,0.0);
  }

  if (abs(uv.x) < fwidth(uv.x)) {
    col = vec3(1.0,0.0,0.0);
  }

  fragColor = vec4(col, 1.0);
```



clamp 函数！！！