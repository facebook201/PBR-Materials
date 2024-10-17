#### 着色器材质

1、变量

* 顶点着色器接收 attributes，计算单独顶点的位置，将其他数据（varyings）传递给片元着色器。
* 片元着色器运行后，将每个单独的片元（像素）的颜色渲染到屏幕
  * uniforms是所有顶点都具有相同的值的变量 灯光、雾、阴影贴图等 uniforms可以通过顶点着色器和片元着色器来访问。
  * **Attributes 与每个顶点关联的变量**。例如，顶点位置，法线和顶点颜色都是存储在attributes中的数据。attributes 只 可以在顶点着色器中访问。
  * **aryings 是从顶点着色器传递到片元着色器的变量**。对于每一个片元，每一个varying的值将是相邻顶点值的平滑插值。
    注意：在shader 内部，uniforms和attributes就像常量；你只能使用JavaScript代码通过缓冲区来修改它们的值。

#### 着色器材质的使用

```js
//顶点着色器代码
varying vec3 vNormal;
void main() {
    // 将attributes的normal通过varying赋值给了向量vNormal
    vNormal = normal;
    gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
}
//片元着色器代码
varying vec3 vNormal;
void main() {
    gl_FragColor = vec4( 1.0, 0.0, 0.0, 1.0 );
}
```

projectionMatrix、modelViewMatrix和position都是three设置好的变量，可以直接拿来用，position就是每一个顶点的坐标值，当着色器代码执行时，会循环执行gl_Position和gl_FragColor设置顶点位置，和颜色插值。并且我们最终要设置的就是gl_Position和gl_FragColor。





#### 常用函数

| 函数       | 参数 | 描述           |
| ---------- | ---- | -------------- |
| sin(x)     | 弧度 | 正弦函数       |
| cos(x)     | 弧度 | 余弦函数       |
| tan(x)     | 弧度 | 正切函数       |
| asin(x)    | 弧度 | 反正弦函数     |
| acos(x)    | 弧度 | 反余弦函数     |
| atan(x)    | 弧度 | 反正切函数     |
| radians(x) | 弧度 | 角度转换为弧度 |
| degrees(x) | 弧度 | 弧度转换为角度 |



| 函数           | 描述                                                         |
| -------------- | ------------------------------------------------------------ |
| pow(x,y)       | x的y次方。如果x小于0，结果是未定义的。同样，如果x=0并且y<=0,结果也是未定义的。 |
| exp(x)         | e的x次方                                                     |
| log(x)         | 计算满足x等于e的y次方的y的值。如果x的值小于0，结果是未定义的。 |
| exp2(x)        | 计算2的x次方                                                 |
| log2(x)        | 计算满足x等于2的y次方的y的值。如果x的值小于0，结果是未定义的。 |
| sqrt(x)        | 计算x的开方。如果x小于0，结果是未定义的。                    |
| inversesqrt(x) | 计算x的开方之一的值，如果x小于等于0，结果是未定义的。        |

##### 3. 常用函数

这里是常用函数，和js中的内置函数很像，需要牢记。

| 函数                        | 描述                                                         |
| --------------------------- | ------------------------------------------------------------ |
| abs(x)                      | 返回x的绝对值                                                |
| sign(x)                     | 如果x>0，返回1.0；如果x=0，返回0，如果x<0，返回-1.0          |
| floor(x)                    | 返回小于等于x的最大整数值                                    |
| ceil(x)                     | 返回大于等于x的最小整数值                                    |
| fract(x)                    | 返回x-floor(x)，即返回x的小数部分                            |
| mod(x)                      | 返回x和y的模                                                 |
| min(x)                      | 返回x和y的值较小的那个值。                                   |
| max(x)                      | 返回x和y的值较大的那个值。                                   |
| clamp(x, minVal, maxVal)    | 将x值钳于minVal和maxVal之间，意思就是当x<minVal时返回minVal，当x>maxVal时返回maxVal，当x在minVal和maxVal之间时，返回x |
| mix(x, y, a)                | 返回线性混合的x和y，如：x*(1−a)+y*a                          |
| step(edge, x)               | 如果x < edge，返回0.0，否则返回1.0                           |
| smoothstep(edge0, edge1, x) | 如果x <= edge0，返回0.0 ；如果x >= edge1 返回1.0；如果edge0 < x < edge1，则执行0~1之间的平滑埃尔米特差值。如果edge0 >= edge1，结果是未定义的。 |
| clamp(x,y,z)                | 获取x和minVal之间较大的那个值，然后再拿较大的那个值和最后那个最大的值进行比较然后获取较小的那个，意思就明白了，clamp实际上是获得三个参数中大小处在中间的那个值 |
|                             |                                                              |
|                             |                                                              |
|                             |                                                              |
|                             |                                                              |

##### 4. 几何函数

这是与长度、距离、向量等相关的函数

| 函数                    | 描述                                           |
| ----------------------- | ---------------------------------------------- |
| length(x)               | 返回向量x的长度                                |
| distance(p0,p1)         | 计算向量p0，p1之间的距离                       |
| dot                     | 向量x，y之间的点积                             |
| cross(x, y)             | 向量x，y之间的叉积                             |
| normalize(x)            | 标准化向量，返回一个方向和x相同但长度为1的向量 |
| faceforward(N, I, Nref) | 如果Nref和I的点积小于0，返回N；否则，返回-N；  |
| reflect(I, N)           | 返回反射向量                                   |
| refract(I, N, eta)      | 返回折射向量                                   |

