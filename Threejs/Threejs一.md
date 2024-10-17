####    Threejs 渲染流程

![border](https://pic3.zhimg.com/80/v2-91c9c197bb8f14914f3c906ca64e298e_720w.webp)



#### 本地坐标和世界坐标

* 本地坐标就是模型本身 position属性

* 模型的世界坐标就是模型和父对象position累加的坐标

  

#### 隐藏模型

cube.visible 属性 可以隐藏组里的模型。

```js
material.side = THREE.BackSide;//背面可以看到
material.side = THREE.DoubleSide;//双面可见

material.transparent = true;//开启透明
material.opacity = 0.5;//设置透明度
```



#### 纹理贴图

比如瓷砖铺满地面

```js
  const texture = new THREE.TextureLoader().load('./image/mm.jpg');
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.RepeatWrapping;
  texture.repeat.set(10, 10);
  // 创建一个材质对象
  const material = new THREE.MeshLambertMaterial({
    // color: 0x00ffff,
    map: texture,
    transparent: true,
  });
```

#### 几何体变换

* scale 缩放
* translate 平移
* 绕xyz轴旋转 rotateXYZ

```js
// 几何体xyz三个方向都放大2倍
geometry.scale(2, 2, 2);
// 几何体沿着x轴平移50
geometry.translate(50, 0, 0);
// 几何体绕着x轴旋转45度
geometry.rotateX(Math.PI / 4);
// 几何体旋转、缩放或平移之后，查看几何体顶点位置坐标的变化
// BufferGeometry的旋转、缩放、平移等方法本质上就是改变顶点的位置坐标
console.log('顶点位置数据', geometry.attributes.position);
```

#### 深度冲突？

两个模型重合，GPU分不清层级，适当的偏移两个模型。

```js
// 1 WebGL渲染器设置
const renderer = new THREE.WebGLRenderer({
    // 设置对数深度缓冲区，优化深度冲突问题
    logarithmicDepthBuffer: true
});
```





#### 三维坐标系辅助轴 AxesHelper

RGB 对应 XYZ， Y默认朝上，右手坐标系。

```js
// 坐标轴 大小根据你的物体来设置
const axesHelper = new THREE.AxesHelper(200);
scene.add(axesHelper);
```

#### 受光照影响的材质

* 漫反射 MeshLambertMaterial
* 高光 MeshPhongMaterial
* 物理 MeshStandardMaterial MeshPhysicalMaterial
* LineBasicMaterial 线材质
* LineDashedMaterial 虚线材质
* MeshBasicMaterial 网格材质 不受光照影响
* PointsMaterial 点模型 
  * 模拟星星 、雪花、火焰、模拟粒子、爆炸效果、光线效果
* ShaderMaterial 之定义渲染材质 自己编写 glsl程序在 gpu上运行
* SpriteMaterial 
  * 可以作为标签或指示器，显示设备名称、提示等信息。
  * 导航点 引导用户完成任务
  * 粒子效果，例如火焰、烟雾等
  * 各种图标

#### 相机轨道控制器

```js
// 相机控件对象
const controls = new OrbitControls(camera, renderer.domElement);

controls.addEventListener('change', () => {
  renderer.render(scene, camera);
});
```

canvas 画布高度动态变化，通过 onresize 事件来调整。

```js
window.onresize = function() {
  render.setSize(window.innerWidth, window.innerHeight);
  camera.aspect = window.innerWidth / window.innerHeight;
  // 更新相机投影矩阵
  camera.updateProjectionMatrix();
}
```

#### 渲染器

光栅器将图元的所有顶点作为输入，图元跟顶点坐标无法一一对应，所以光栅器采样式采样元素的中心，所以某些边缘像素的采样点没有被三角形内部覆盖，所以它们受不到片段着色器的影响，

![border](https://learnopengl-cn.github.io/img/04/11/anti_aliasing_rasterization.png)

* 抗锯齿 antialias： true

* 设备像素比 devicePixelRatio 


### GUIjs

```js
function initGUI() {
  // GUI调试
  const gui = new GUI();
  // 光照强度
  gui.add(ambient, 'intensity', 0, 2).name('环境光');
  gui.add(light, 'intensity', 0, 2).name('平行光');

  // 物体的位置
  gui.add(cube.position, 'x', 0, 180);
  gui.add(cube.position, 'y', 0, 180);
  gui.add(cube.position, 'z', 0, 180);

  // 改变物体颜色
  gui.addColor(params, 'color').onChange(v => {
    cube.material.color.set(v);
  });

  gui.open();
}
```

分组管理 addFolder ，管理比较多的属性。

```js
const panel = new GUI();
// 创建一个分组
const folder1 = panel.addFolder( 'camera setViewOffset' ).close();

const settings = {
    // 属性名
};

// 增加属性
folder1.add(settings, 'setViewOffset');
```





#### Threejs  PBR材质

Three.js中的PBR材质主要包括`THREE.MeshStandardMaterial`和`THREE.MeshPhysicalMaterial`，**基于物理的光照模型**(微平面理论、能量守恒、菲涅尔反射...)，它们能够更准确地模拟光照和材质之间的相互作用，为场景提供更加真实感的渲染效果。

PBR材质适用于对真实感渲染效果有较高要求的场景，例如：

- 游戏场景：游戏中的角色、道具等元素可以通过PBR材质实现更真实的光照和材质效果。
- 产品展示：三维产品展示中，PBR材质可以更真实地展示产品的外观、纹理和细节。
- 虚拟现实：VR场景中，PBR材质有助于提高用户的沉浸感和真实感。



基本属性

* color
* metalness **金属度**属性 表示材质像**金属**的程度, 非金属材料,如木材或石材,使用0.0,金属使用1.0
* roughness **粗糙度**属性 表示模型表面的光滑或者说粗糙程度，越光滑镜面反射能力越强，越粗糙，表面镜面反射能力越弱，更多地表现为漫反射，0.0表示平滑的镜面反射,1.0表示完全漫反射。

```js
const material = new THREE.MeshStandardMaterial({
  color: 0xffffff,
  metalness: 0.5,
  roughness: 0.5
});
```



#### 法线贴图

每个像素提供一个法线向量，使得物体有更加细致的凹凸感。每个像素包含了一个法线向量，代表该点的表面方向，这些法线向量以纹理的形式存储在一个称为法线贴图的二维图形中。渲染过程中，根据法线贴图中的法线信息，调整每个像素的光照计算结果，使得表面的法线向量发生变化，从而呈现出凹凸的纹理效果。

与凹凸贴图相比，法线贴图能够提供更加精细和真实的凹凸效果。它可以用于模拟各种材质的凹凸纹理，例如石头、木材、金属等。法线贴图通常由专业的三维建模软件生成，并与模型的纹理贴图一起使用。

需要注意的是，法线贴图只是一种视觉上的效果，不改变实际的物体几何形状。它是一种在渲染过程中模拟细节的技术，可以增强物体的真实感和细节感。

* 复杂度法线贴图更加复杂 更加细致

* 法线贴图增加内存消耗

  

PBR材质支持多种纹理贴图，如漫反射贴图、金属度贴图、粗糙度贴图、法线贴图等。为了更好地模拟环境光的影响，PBR材质还支持环境光遮蔽贴图

```js
const loader = new THREE.TextureLoader();
const diffuseTexture = loader.load('path/to/diffuse.png');
const metalnessTexture = loader.load('path/to/metalness.png');
const roughnessTexture = loader.load('path/to/roughness.png');
const normalTexture = loader.load('path/to/normal.png');
const aoTexture = loader.load('path/to/ao.png');
​
const material = new THREE.MeshStandardMaterial({
  map: diffuseTexture,
  metalnessMap: metalnessTexture,
  roughnessMap: roughnessTexture,
  normalMap: normalTexture,
  aoMap: aoTexture
});

```

* clearcost 清漆度是一种模拟表面光洁度的属性，用于实现汽车漆、瓷器等具有光滑表面的材质。在Three.js中，可以使用`THREE.MeshPhysicalMaterial`设置清漆度属性。

* 各向异性是一种模拟材质在不同方向上光照反射特性不同的属性，用于实现金属刷痕、木纹等具有方向性纹理的材质。在Three.js中，可以使用`THREE.MeshPhysicalMaterial`设置各向异性属性。

* Transparency 透明度是一种模拟材质透明程度的属性

* 模拟玻璃、半透明塑料一类的视觉效果，可以使用物理透明度`.transmission`属性代替Mesh普通透明度属性`.opacity`

  

```js
const mesh = gltf.scene.getObjectByName('汽车外壳');
mesh.material = new THREE.MeshPhysicalMaterial({
        color: mesh.material.color, //默认颜色
        metalness: 0.9,//车外壳金属度
        roughness: 0.5,//车外壳粗糙度
        envMap: textureCube, //环境贴图
        envMapIntensity: 2.5, //环境贴图对Mesh表面影响程度
})  
const material = new THREE.MeshPhysicalMaterial({
  clearcoat: 1.0,
  clearcoatRoughness: 0.1
});

// 玻璃材质
const mesh = gltf.scene.getObjectByName('玻璃01')
mesh.material = new THREE.MeshPhysicalMaterial({
    metalness: 0.0,//玻璃非金属 
    roughness: 0.0,//玻璃表面光滑
    envMap:textureCube,//环境贴图
    envMapIntensity: 1.0, //环境贴图对Mesh表面影响程度
    transmission: 1.0, //玻璃材质透光率，transmission替代opacity 
    ior:1.5,//折射率
})
```



**5、环境贴图hdr格式**

美术也会提供hdr格式图片作为环境贴图使用。

```js
import { RGBELoader } from 'three/examples/jsm/loaders/RGBELoader.js';

const rgbeLoader = new RGBELoader();
  rgbeLoader.load('./file/2k.hdr', function(hdrMap) {
    let envmap = envmaploader.fromCubemap(hdrMap)
    let texture = new THREE.CanvasTexture(new FlakesTexture());
    texture.wrapS = THREE.RepeatWrapping;
    texture.wrapT = THREE.RepeatWrapping;
    texture.repeat.x = 10;
    texture.repeat.y = 6;
    const ballMaterial = {
      clearcoat: 1.0,
      cleacoatRoughness:0.1,
      metalness: 0.9,
      roughness:0.5,
      color: 0x8418ca,
      normalMap: texture,
      normalScale: new THREE.Vector2(0.15,0.15),
      envMap: envmap.texture
    };

    let ballGeo = new THREE.SphereGeometry(100,64,64);
    let ballMat = new THREE.MeshPhysicalMaterial(ballMaterial);
    let ballMesh = new THREE.Mesh(ballGeo, ballMat);
    scene.add(ballMesh);
    animate();
  });
```



#### 材质 Material

* Lambert 材质: 用来创建暗淡的并不光亮的表面。该材质非常易用，而且会与场景中的光源产生反应。 例如未经处理的木材或石材
* Phong 材质: 可以模拟具有镜面高光的光泽表面（例如涂漆木材）
* MeshStandardMaterial（网格标准材质） 基于物理的标准材质，使用Metallic-Roughness工作流程。它可以计算表面与光线的正确互动关系，从而使渲染出来的物体更加真实

1. BaseColor（RGB三通道-sRGB空间) = 漫反射（电介质反射颜色）+金属反射。

2. Matallic(Grayscale灰度图-Linear线性空间) 作为一个0-1的黑白值遮罩调整金属与非金属。

3. Roughness（Grayscale灰度图-Linear线性空间）灰度图值 0代表光滑表面，而1代表粗糙表面。

* MeshPhysicalMaterial [MeshStandardMaterial](http://www.yanhuangxueyuan.com/threejs/docs/index.html#api/zh/materials/MeshStandardMaterial)的扩展，提供了更高级的基于物理的渲染属性：
  * **Clearcoat:** 有些类似于车漆，碳纤，被水打湿的表面的材质需要在面上再增加一个透明的，具有一定反光特性的面
  * 基于物理的透光性[.transmission](http://www.yanhuangxueyuan.com/threejs/docs/index.html#api/zh/materials/MeshPhysicalMaterial.transmission)属性可以让一些很薄的透明表面，例如玻璃，变得更真实一些。
  * **高级光线反射:** 为非金属材质提供了更多更灵活的光线反射。



Three.js 支持为材质添加纹理，以实现更丰富的表面细节。纹理映射（Texture Mapping）是将一张 2D 图像贴到物体表面的技术。常见的纹理类型有：

- 贴图（Texture）：为物体添加颜色和细节。
- 法线贴图（Normal Map）：在不增加几何体细节的情况下，增强物体表面的凹凸感。
- 环境光遮蔽贴图（Ambient Occlusion Map）：增加物体表面的阴影效果，增强真实感。
- 位移贴图（Displacement Map）：根据纹理信息改变物体表面的几何细节。

# 4.材质的主要属性

在 Three.js 中，材质（Material）负责定义物体表面的外观，如颜色、纹理和光照效果。以下是一些主要的材质属性：

1. **color：** 基本颜色，通常是一个 `THREE.Color` 对象，表示材质的漫反射颜色。
2. **map：** 纹理贴图，是一个 `THREE.Texture` 对象，用于为材质添加纹理。
3. **opacity：** 透明度，表示材质的不透明程度，取值范围为 0（完全透明）到 1（完全不透明）。
4. **transparent：** 布尔值，指示材质是否透明。如果设置为 `true`，则材质将考虑透明度（opacity）的影响。
5. **alphaMap：** 透明度贴图，是一个 `THREE.Texture` 对象，用于根据纹理图像的灰度值控制材质的透明度。
6. **side：** 渲染面的方向，可以是 `THREE.FrontSide`、`THREE.BackSide` 或 `THREE.DoubleSide`。默认值是 `THREE.FrontSide`，只渲染正面。
7. **emissive：** 自发光颜色，通常是一个 `THREE.Color` 对象，表示材质的自发光颜色。
8. **emissiveMap：** 自发光贴图，是一个 `THREE.Texture` 对象，用于为材质添加自发光效果。
9. **specular：** 镜面反射颜色，通常是一个 `THREE.Color` 对象，表示材质的镜面反射颜色。这个属性主要应用于具有镜面反射效果的材质，如 `THREE.MeshPhongMaterial`。
10. **shininess：** 光泽度，表示材质的光泽程度。这个属性主要应用于具有镜面反射效果的材质，如 `THREE.MeshPhongMaterial`。
11. **wireframe：** 布尔值，指示是否以线框模式渲染物体。如果设置为 `true`，则物体将以线框模式显示。
12. **bumpMap：** 凹凸贴图，是一个 `THREE.Texture` 对象，用于为材质添加凹凸效果，以模拟表面的细微凹凸。
13. **normalMap：** 法线贴图，是一个 `THREE.Texture` 对象，用于为材质添加法线贴图效果，以模拟表面的细节。
14. **displacementMap：** 位移贴图，是一个 `THREE.Texture` 对象，用于根据纹理图像的灰度值改变物体表面的高度。
15. **roughness：** 粗糙度，表示材质表面的粗糙程度。这个属性主要应用于基于物理的渲染（PBR）材质，如 `THREE.MeshStandardMaterial` 和 `THREE.MeshPhysicalMaterial`。
16. **metalness：** 金属度，表示材质表面的金属质感。这个属性主要应用于基于物理的渲染（PBR）材质，如 `THREE.MeshStandardMaterial` 和 `THREE.MeshPhysicalMaterial`。
17. **roughnessMap：** 粗糙度贴图，是一个 `THREE.Texture` 对象，用于根据纹理图像的灰度值控制材质的粗糙度。这个属性主要应用于基于物理的渲染（PBR）材质。
18. **metalnessMap：** 金属度贴图，是一个 `THREE.Texture` 对象，用于根据纹理图像的灰度值控制材质的金属度。这个属性主要应用于基于物理的渲染（PBR）材质。
19. **envMap：** 环境贴图，是一个 `THREE.Texture` 对象，用于为材质添加反射和折射效果。
20. **refractionRatio：** 折射率，表示材质的折射程度。这个属性主要应用于具有折射效果的材质，如 `THREE.MeshPhysicalMaterial`。







