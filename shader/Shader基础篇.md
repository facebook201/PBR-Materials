#### 1 Shader 内置全局变量

* gl_FragCoord：当前片元的坐标（x 和 y 分量）。
* gl_FragColor：当前片元的颜色（RGBA 格式）。
* gl_FragDepth：当前片元的深度值。
* iResolution：屏幕分辨率（宽高）像素值，与视口尺寸相关
* iTime：当前时间，着色器加载开始计时
* float iTimeDelta：自上一帧到当前帧的时间间隔（以秒为单位）。
* int iFrame：当前帧的帧数，比较常用。
* float iChannelTime[4]：各个纹理通道的时间（以秒为单位）。通道0对应sampler2D iChannel0，通道1对应sampler2D iChannel1，以此类推。
* vec3 iChannelResolution[4]：各个纹理通道的分辨率（宽度、高度和深度）。通道0对应sampler2D iChannel0，通道1对应sampler2D iChannel1，以此类推。
* samplerXX iChannel0、samplerXX iChannel1、samplerXX iChannel2、samplerXX iChannel3：纹理通道，其中XX表示纹理的类型（如sampler2D表示二维纹理）。
* iMouse：用于获取鼠标的位置和状态信息。它是一个包含四个分量的vec4类型变量，分别表示鼠标的坐标（x 和 y 分量）以及左右键的按下状态（z 和 w 分量）。



```glsl
// 归一化 屏幕坐标在 0-1 之间
vec2 st = fragCoord.xy / iResolution.xy;
// 原点移动到中心 
st -= 0.5;
// 长宽等比例压缩
st.x = iResolution.x / iResolution.y;

// 等价于下面这代码
vec2 uv = (2.0* gl_FragCoord.xy - iResolution) / iResolution.y;
```







#### 2 Shader 内置函数



| 函数               | 说明                                                         |
| ------------------ | ------------------------------------------------------------ |
| length（v）        | 传一个向量，获取向量的长度，计算给定像素点到屏幕中心的距离。 |
| step（s,m）        | 第一个是极限值，第二个是想要检测的值。大于阈值 返回1.0 否则返回0.0 （0是黑色，1是白色） |
| smoothstep         | 当给定一个范围的上下限和一个数值，这个函数会在已有的范围内给出插值。前两个参数规定转换的开始和结束点，第三个是给出一个值用来插值。 |
|                    |                                                              |
|                    | 制造动效、形态、混合数值。当我们给出一个角度，就会返回半径为1的圆上一个点的x（cos）坐标和y（sin）坐标。正因为 sin 和 cos 返回的是规范化的值（即值域在 -1 和 1 之间），且如此流畅，这就使得它成为一个极其强大的工具。 |
| sin                |                                                              |
| cos                |                                                              |
| fract（x）         | 返回数的小数部分                                             |
| clamp(x, 0.0, 1.0) | 把 x 的值限制在 0.0 到 1.0 获得三个参数中大小处在中间的那个值 |



| mix(a,b,p) | 将两种颜色根据一定的比例混合在一起，生成另一种颜色。最后一个参数是混合比例 |
| ---------- | ------------------------------------------------------------ |
| mod(x, d) | 跟第二个参数d取余 可以判断奇数和偶数 |

```glsl
// 返回1.0 还是小于1.0
y = mod(x, 2,0);
// 返回0.0 1.0 判断奇偶数
y = step(1.0, mod(x, 2.0));
```







#### smoothstep 函数 平滑阶梯函数

```glsl
// smoothstep(1, 2, 1) smoothstep(1, 2, 2) 带入1 2 
// 可以得到一个 0~1 之间过渡值

float smoothstep(float t1, float t2, float x) {
    // clamp 取三者中中间值
    x = clamp((x - t1) / (t2 - t1), 0.0, 1.0);
    return x * x * (3 - 2*x);
}

// 0.5~1 返回值是0 0.5~0 返回值是0~1的渐变值 
// smoothstep(0.5, 0.2, d)


/**
 * 当d <= 0.2 结果是0 
 * 当d = 0.3 第一个函数结果是1 第二个函数结果是0 所以1-0 = 1
 * 当d = 0.4 第一个函数是1 第二个函数是1，所以 1 - 1 = 0
 * 当d > 0.4 两个函数结果都是1 函数想减等0
 * 0~0.2是黑色 0.2~0.3黑色渐变白色 0.3 ~ 0.4 是白色渐变黑色 0.4~1 是黑色
 */
 float s1 = smoothstep(0.2, 0.3, d);
 float s2 = smoothstep(0.3, 0.4, d);
 d = s1 - s2;
```



#### step 函数

第一个是极限值，第二个是想要监测的值。大于阈值 返回1.0 否则返回0.0

```glsl
    vec2 bl = step(vec2(0.1), 1.0 - st);
    float pct = bl.x * bl.y;
    color = vec3(pct);

    gl_FragColor = vec4(color, 1.0);
```





##### 造型函数

```glsl
uniform vec2 u_resolution;
uniform vec2 u_mouse;
uniform float u_time;

void main(){
    // 归一化
    vec2 st = gl_FragCoord.xy/u_resolution.xy;
    vec3 color = vec3(0.0);
	
    // -0.5 0.5 改变坐标原点到 中心
    vec2 pos = vec2(0.5) - st;

    float r = length(pos)*2.0;
    float a = atan(pos.y,pos.x);

    float f = cos(a*6.);
    // f = abs(cos(a*3.)); 菊花
    // f = abs(cos(a*2.5))*.5+.3; 雪花
    // f = abs(cos(a*12.)*sin(a*3.))*.8+.1; 
    // f = smoothstep(-.5,1., cos(a*10.))*0.2+0.5; 齿轮

    color = vec3( 1.-smoothstep(f,f+0.02,r) );
    gl_FragColor = vec4(color, 1.0);
}
```

#### 极坐标

与2D笛卡尔坐标系通过原点与两个穿过原点的轴来确立坐标系类似，2D极坐标系也有一个原点，称为**极点**，极点定义了[坐标空间](https://zhida.zhihu.com/search?q=坐标空间&zhida_source=entity&is_preview=1)的“中心”。不同的是极坐标空间只有一个轴，通常称之为**极轴**，极轴常被用来描述为经过极点的射线。

极坐标系中通过距离r与角度θ来描述一个坐标点，通常用(r, θ)表示。定位极坐标点(r, θ)需要两个步骤：

1.从极点开始，朝向极轴方向，并旋转角度θ，**θ的正值通常被定义为沿逆时针旋转，反之负值就沿顺时针旋转**。

2.通过步骤1确定的角度，从极点向前移动r个单位的距离，即可得到极坐标点(r, θ)。



```js
atan(type y, type x);
/**
当x = 0，y = 0时， 结果为0°；
当x = 0, y > 0时， 结果为90°；
当x = 0，y < 0时， 结果为-90°；
当x > 0, 结果为arctan(y/x);
当x < 0, y >= 0, 结果为arctan(y/x) + 180°
当x < 0, y < 0, 结果为arctan(y/x) - 180°
*/
```



用极坐标画圆

```glsl
void mainImage(out vec4 fragColor, in vec2 fragCoord) {
  // 归一化 [-1, 1] 中心点 0,0
  vec2 uv = (2.0 * fragCoord - iResolution.xy) / iResolution.y;
  // 等到 [-Π，Π] 的范围
  // [0, Π] 之间的值才是正值 当 Π/2 最大 所以只有一个圆
  // atan 结果小于0时，[-Π, 0] 是负值的但是 length是非负值，所以下半部分没有输出
  float d = sin(atan(uv.y, uv.x));
  
  // 根据sin的函数图像现在15°就能画图像
  // float d = sin(atan(uv.y, uv.x) * 6); 
  float v = smoothstep(d, d + 0.01, length(uv));
  fragColor = vec4(v);
}
```





























##### 3、内置函数

```glsl
uniform vec2 iResolution;
uniform float iTime;

vec3 ColorA = vec3(0.149, 0.141, 0.912);
vec3 ColorB = vec3(1.000, 0.833, 0.224);

void main() {
  vec3 color = vec3(0.0);
  // 得到0-1之间的一个正数混合比例
  float pct = abs(sin(iTime));
  // 将两种颜色混合
  color = mix(ColorA, ColorB, pct);
  gl_FragColor = vec4(color, 1.0);
}
```











#### 插值

插值在图形学中的作用是通过已知的数据点来估算和填充未知位置的数据，使得图像或模型在变换时能够平滑过渡，避免出现断裂或不连续的情况，从而提供更加自然和真实的视觉效果‌





















