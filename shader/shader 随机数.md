#### shader 随机数

sin 函数是 振幅在[-1,1]之间的波浪图，其中a 表示频率，a 越大 频率越大。b 表示振幅，越大振幅越大。

```glsl
y = sin(x * a) * b;

// 随机数
float random(vec2 st) {
  // 43758.5453123 是一个经验值
  return fract(sin(dot(st.xy, vec2(12.9898, 78.233))) * 43758.5453123);
}
```



#### 噪声 nosie

噪声其实就是函数，根据输入值返回一个连续且平滑的插值

* 参数决定维度
* 返回值 取值[0,1]，返回值随机但确定
* 返回值 连续且平滑（如果不连续平滑 那么扰动效果就会受影响）



一维噪声，两个值之间进行插值。











```glsl
float i = floor(x);  // 整数（i 代表 integer）
float f = fract(x);  // 小数（f 代表 fraction）
y = rand(i); //rand() 在之前的章节提过
float u = f * f * (3.0 - 2.0 * f ); // custom cubic curve
y = mix(rand(i), rand(i + 1.0), u); // using it in the interpolation

// 一维噪声函数
float random1(float x) {
  return fract(sin(x * 1000.0) * 43758.5453123);
}

float noise(float x) {
  float i = floor(x);
  float f = fract(x);

  float a = random1(i);
  float b = random1(i + 1.0);

  float u = f * f * (3.0 - 2.0 * f);
  return mix(a, b, u);
}
```



##### SDF（Signed Distance Field），

是一种描述或存储点与场景物体表面位置关系的方式。**当点在物体内部时距离为负数，在物体表面时距离为零，在物体外部时距离是正数**，正是因为存在正负数所以叫Signed Distance Field而不是Distance Field，最大的作用是用于[快速查询](https://zhida.zhihu.com/search?q=快速查询&zhida_source=entity&is_preview=1)任意一点到场景中物体表面的最短距离

![border](https://pic4.zhimg.com/v2-458153d65ea8ee896131645e54a50d4b_b.jpg)



假设从p0点沿蓝色线发射一条光线，通过符号距离场可以获取到p0点到黑色线的最短距离，如果距离是零，表示p0落在黑色折线上，如果是正数n0，那么可以直接沿蓝色线方向前进n0的距离得到p1的点，重复执行此流程直到p4点时，p4点与黑色折线的最短距离已经小于一定的阈值，那么即可把p4点视为与黑色折线的交点，这样相对于固定单位步长前进判断是否在黑色折线上省去了许多计算量。



#### 2d SDF

```glsl
/**
* 线段：  1. a，b表示线段两个端点的坐标
*/
float sdSegment( in vec2 p, in vec2 a, in vec2 b )
{
    // pa表示a点指向p点的向量， ba表示a点指向b点的向量
    vec2 pa = p-a, ba = b-a;
    // h表示pa在ba上投影的长度占ba长度的比例，限定到[0,1]
    float h = clamp( dot(pa,ba)/dot(ba,ba), 0.0, 1.0 );
    // ba*h 是以a为起点，方向与ba相同，长度等于pa在ba方向上投影的长度的向量
    // pa视为斜边，ba*h是直角边，那么pa - ba*h则是另一条直角边，也就是从p点做垂线垂直于ab，
    // 显然该垂线的长度就是所求最短距离
    return length( pa - ba*h );
}

```

