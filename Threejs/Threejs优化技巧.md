#### 技巧

1、使用 [`BufferGeometry`](https://threejs.org/docs/#api/en/core/BufferGeometry) ，而不是 [`Geometry`](https://threejs.org/docs/#api/en/core/Geometry)，它更快（性能更好）。

2、始终尝试重用对象，例如物体、材质、纹理等

3、 开启 renderer.physicallyCorrectLights 

4、renderer.outputColorSpace = THREE.LinearSRGBColorSpace;//设置为SRGB颜色空间 为了达到（进似乎）准确的颜色，这么设置渲染器

5、为了得到（进似乎）正确的纹理颜色，**你只需要针对颜色，环境、自发光贴图设置纹理编码方式**：

```js
const colorMap = new TextureLoader().load("colorMap.jpg");
texture.colorSpace = THREE.SRGBColorSpace;

```

6、在现代硬件上，内置的多重采样抗锯齿(MSAA)似乎也消耗很小，即使是在低功耗移动设备上也是如此



#### 光照

1. 直射光（`SpotLight`、`PointLight`、`RectAreaLight`和`DirectionalLight`）很影响性能。在您的场景中尽可能少使用直射光。
2. 避免在场景中添加和删除光，因为这需要`WebGLRenderer`重新编译所有着色器程序（它确实缓存了程序，因此后续执行此操作的时间会比第一次更快）。取而代之的使用`light.visible = false`或`light.intensiy = 0`。
3. 打开`renderer.physicallyCorrectLights`，使用 国际单位制的正确光照。



#### 阴影

1. 如果您的场景是静态的，则仅在事物发生变化时更新阴影贴图，而不是每一帧。
2. 使用 [`CameraHelper`](https://threejs.org/docs/#api/en/helpers/CameraHelper)可视化阴影相机的视锥体。
3. 使阴影视锥体尽可能小。
4. 使阴影纹理的分辨率尽可能低。
5. 请记住，点光源阴影比其他阴影类型更消耗性能，因为它们必须渲染六次（每个方向一次），而`DirectionalLight`和`SpotLight`阴影则需渲染一次。
6. 当我们谈论`PointLight`阴影时，请注意，当用于可视化点光源阴影时，`CameraHelper`只可视化了**六个阴影方向中的一个**。它仍然很有用，但你需要在其他五个方向上发挥你的想象力。



#### 材质

1. `MeshLambertMaterial`不适用于闪亮拉丝的材质，但对于像布料这样的哑光材质，它会产生非常相似`MeshPhongMaterial`的结果，但性能更高。
2. 如果你使用的是顶点变形目标（morph targets），请确保您在材质中设置了 [`morphTargets = true`](https://threejs.org/docs/#api/en/materials/MeshStandardMaterial.morphTargets)，否则它们将不起作用！
3. 这同样适用于 [变形法线 morph normals](https://threejs.org/docs/#api/en/materials/MeshStandardMaterial.morphNormals)。
4. 如果你正在使用 [SkinnedMesh](https://threejs.org/docs/#api/en/objects/SkinnedMesh)来制作骨骼动画，确保 [`material.skinning = true`](https://threejs.org/docs/#api/en/materials/MeshStandardMaterial.skinning).
5. 与变形目标、变形法线或蒙皮一起使用的材质无法共享。你需要为每个蒙皮或变形的网格创建单独的材质（ [`material.clone()`](https://threejs.org/docs/#api/en/materials/Material.clone)在这里非常适用）。



#### 纹理

1. 你所有的纹理都需要是 2 的幂次方 (POT) 大小

   1 、2 、4 、8 、16 ,…,512 ,2048 ,….

2. 不要更改纹理的尺寸。而是创建新的， [性能更高](https://webglinsights.github.io/tips.html)

3. 尽可能使用最小尺寸的纹理（您可以使用 256x256 的平铺纹理吗？您可能会感到惊讶！）。

4. 非 2 的幂次方 (NPOT) 纹理需要 linear 或 nearest filtering 滤镜参数设置，以及 clamp-to-border 或 clamp-to-edge 包裹方式（ [详见 textures 常量](https://threejs.org/docs/index.html?q=textu#api/en/constants/Textures)）。不支持 Mipmap 过滤和重复包裹。但说真的，就不要使用 NPOT 纹理。

5. 具有相同尺寸的纹理在内存中的大小相同，因此 JPG 的文件可能比 PNG 小，但它会在您的 GPU 上占用相同数量的内存。



1. 内置抗锯齿功能不适用于后期处理（至少在 WebGL 1 中）。您需要手动使用 [FXAA](https://threejs.org/examples/#webgl_postprocessing_fxaa)或 [SMAA](https://threejs.org/examples/#webgl_postprocessing_smaa)（可能更快、更好）。
2. 当你没有使用内置抗锯齿（ AA），请务必禁用它！
3. three.js 有大量的后处理着色器，这太棒了！但请记住，每个通道都需要渲染整个场景。完成测试后，请考虑是否可以将你的通道合并为一个自定义通道。这样会需要多做一些工作，但可以显着提高性能。



#### 性能

## 性能[#](https://discoverthreejs.com/zh/tips-and-tricks/#性能)

1. 为静态或很少移动的物体设置`object.matrixAutoUpdate = false` ，并手动调用`object.updateMatrix()` 在其位置/旋转/四元数/缩放更新时。
2. **透明物体很消耗性能。**在场景中尽可能少使用透明物体。
3. 尽可能使用 [`alphatest`](https://threejs.org/docs/#api/en/materials/Material.alphaTest) ， 而不是标准透明度，它会更快。
4. 在测试应用程序的性能时，你需要做的第一件事就是检查它是受 CPU 限制还是受 GPU 限制。使用基础材质（basic material ）替换所有材质`scene.overrideMaterial`（请参阅入门技巧和页面的开头）。如果性能提高，那么你的应用程序受 GPU 限制。如果性能没有提高，则你的应用程序受 CPU 限制。
5. 在性能好的机器上进行性能测试时，你可能最多获得 60FPS 的帧率。运行 chrome 以`open -a "Google Chrome" --args --disable-gpu-vsync`获得无限制的帧率。
6. 现代移动设备的像素比高达 5 - 考虑将这些设备上的最大像素比限制为 2 或 3。以场景的一些非常轻微的模糊为代价，你将获得可观的性能提升。
7. 烘焙光照和阴影贴图以减少场景中的光照数量。
8. 密切关注场景中的绘制方法的（drawcalls）调用次数。一个好的经验法则是更少的绘制调用 = 更好的性能。
9. 远处的物体不需要同靠近相机的物体具有相同的模型精度。有许多可以降低远处物体的精度的技巧来提高性能。考虑使用 [LOD](https://threejs.org/docs/#api/en/objects/LOD)（细节层次）物体。你也可以只为远处的物体每 2 或 3 帧更新位置/动画，或者用 billboard 替换它们 - 即物体的图片。

1. 当您有成百或上千个相似的几何图形时，请使用几何实例化。
2. 在 GPU 而非 CPU 上进行动画处理，尤其是在为顶点或粒子设置动画时（请参阅 [THREE.Bas](https://github.com/zadvorsky/three.bas)以了解执行此操作的一种方法）。