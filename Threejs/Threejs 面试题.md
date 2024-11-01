#### 基础题

1、如何创建一个简单的3D场景

* 首先创建一个 scene 场景，然后创建一个相机对象，创建一个渲染器对象。将场景跟相机对象传给渲染器。

* 相机分为 正交相机和透视相机

  

2、如何使用材质和纹理来改变物体外观？

threejs 有不同材质的API，比如 基础材质但是不反光，有高光材质，有标准材质，有法线材质。纹理是可以作为图像假造到物体上，给物体换肤。



3、创建和自定义着色器？

着色器是处理3d模型表面的渲染效果的程序。实现复杂的视觉效果，光照、阴影、粒子效果、噪音扰动等。创建 shaderMaterial 来自定义着色器，通过uniforms参数来传递 uniform变量。



4、如何使用缓冲区？

可以通过 BufferGeometry 创建自定义缓冲区，实现更高效的渲染。直接操作 顶点数据、索引数据和材质数据。



5、如何使用threejs 处理交互事件？

通过事件监听特点的事件函数，在事件触发时机执行回调。



6、threejs 动画？

基于时间的动画，（曲线、飞线）基于物理的动画（碰撞检测）以及着色器动画。以及 gap、tween 补间动画。



7、材质定义了物体的外观和反射光线



你可以使用 `THREE.Points` 或 `THREE.Sprite` 来创建粒子系统。这些对象可以表示成千上万的小粒子，并使用自定义材质和纹理来呈现。火花、雨、雪等



8、法线贴图是一种用于模拟高细节表面的技术，环境贴图则模拟了物体周围的环境光照。这些技术可以增加渲染物体的细节和真实感。



9Three.js 中的 post-processing 效果是如何实现的？

后期处理效果是通过创建一个后期处理通道（Post-processing Pass）并将其添加到渲染循环中来实现的。这些通道可以应用各种效果，例如模糊、颜色校正和光照效果。



10、优化threejs

Three.js 中的性能优化技巧有哪些？
合并几何体（Geometry Merge） ：如果你有多个相似的物体，可以将它们的几何体合并成一个，以减少渲染调用的数量。这可以通过 BufferGeometry 来实现。
使用纹理集合（Texture Atlas） ：将多个小纹理图像合并成一个大的纹理图集，减少纹理切换和内存占用。
减少光源数量：光源是渲染成本较高的因素之一。尽量减少不必要的光源，使用平行光或环境光来模拟光照效果。
使用 LOD（Level of Detail） ：LOD 技术根据物体距离相机的远近，加载不同级别的细节模型。这有助于减少物体的多边形数量。
开启硬件加速：确保浏览器启用了硬件加速，以充分利用 GPU 渲染。
使用 Web Workers：将一些计算密集型任务放在 Web Workers 中，以防止阻塞主线程。
使用 Occlusion Culling：当物体被遮挡时，不需要渲染它们。使用视锥体剔除和遮挡剔除技术来提高渲染效率。
纹理压缩：使用纹理压缩格式，如 DXT、ETC 或 PVRTC，以减少纹理内存占用。
移动端优化：在移动设备上，要特别小心性能。使用适当的分辨率、减少光源和阴影，以提高性能。
事件处理的最小化：不要在每一帧都附加事件监听器，只在需要时附加。事件处理可能会引入性能开销。
使用 requestAnimationFrame：使用 requestAnimationFrame 来控制渲染循环，以确保在性能允许的情况下渲染。
使用外部模型格式：如果可能的话，使用 GLTF 格式的模型，因为它是 Three.js 中性能较高的模型格式。
内存管理：当你不再需要物体或纹理时，记得手动释放它们的内存资源，以避免内存泄漏。
渲染器设置：在创建渲染器时，选择合适的渲染器设置，如 antialiasing（抗锯齿）和 shadows（阴影），以平衡性能和图形质量。
使用 GPU 功能：尽量使用 GPU 进行计算，例如使用着色器来执行复杂的渲染操作。
避免频繁的渲染大小变化：频繁改变渲染画布的大小可能会导致性能下降，尽量避免这种情况。
压缩和合并着色器：将着色器代码压缩和合并，以减少 HTTP 请求和提高加载速度。
定期检查性能：使用浏览器的性能分析工具（例如 Chrome 的开发者工具）来检查性能瓶颈，并优化应用。
控制粒子数量：如果你使用粒子系统，确保粒子数量不会过多，以避免性能下降。
测试不同设备：在不同设备和浏览器上测试你的应用，以确保它在各种环境中都能正常运行。
————————————————



#### Threejs

几何体position、uv、index、normal 属性

* position：顶点位置坐标，描述模型的几何形状
* uv：顶点UV纹理坐标，与顶点位置一一对应，用来表示贴图与模型的映射关系
* index：几何体顶点索引
* normal：几何体顶点法线



##### 单击鼠标取中模型

* 根据鼠标点击事件对象获取canvas的屏幕坐标
* 把屏幕坐标转为webgl 设备坐标
* setFromCamera 
* 通过Raycaster实现射线拾取模型计算

```js
renderer.domElement.addEventListener('click', function (event) {
    // .offsetY、.offsetX以canvas画布左上角为坐标原点,单位px
    const px = event.offsetX;
    const py = event.offsetY;
    //屏幕坐标px、py转WebGL标准设备坐标x、y
    //width、height表示canvas画布宽高度
    const x = (px / width) * 2 - 1;
    const y = -(py / height) * 2 + 1;
    //创建一个射线投射器`Raycaster`
    const raycaster = new THREE.Raycaster();
    //.setFromCamera()计算射线投射器`Raycaster`的射线属性.ray
    // 形象点说就是在点击位置创建一条射线，射线穿过的模型代表选中
    raycaster.setFromCamera(new THREE.Vector2(x, y), camera);
    //.intersectObjects([mesh1, mesh2, mesh3])对参数中的网格模型对象进行射线交叉计算
    // 未选中对象返回空数组[],选中一个对象，数组1个元素，选中两个对象，数组两个元素
    const intersects = raycaster.intersectObjects([mesh1, mesh2, mesh3]);
    console.log("射线器返回的对象", intersects);
    // intersects.length大于0说明，说明选中了模型
    if (intersects.length > 0) {
        // 选中模型的第一个模型，设置为红色
        intersects[0].object.material.color.set(0xff0000);
    }
})
```

**材质（Material）**是描述物体外观和光学特性的属性集合。它包括物体的颜色、反射属性（如漫反射、高光反射）、透明度、折射率等。材质定义了物体如何与光线进行交互，决定了物体在渲染时的外观效果。

**纹理 Texture**是一种图像，用于模拟物体表面的细节和纹理。它可以包含颜色信息、细节图案、纹理细节等。通过将纹理映射到模型表面，可以赋予模型更加真实的外观和细节。

**贴图（Texture Map **是将纹理应用到3D模型表面的过程。贴图是通过将纹理图像与模型的顶点或像素相匹配，使得纹理图像覆盖在模型表面，在渲染过程中，根据贴图的坐标信息来确定模型表面的颜色、纹理细节等。