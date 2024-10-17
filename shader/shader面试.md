#### Threejs

几何体position、uv、index、normal 属性

* position：顶点位置坐标，描述模型的几何形状
* uv：顶点UV纹理坐标，与顶点位置一一对应，用来表示贴图与模型的映射关系
* index：几何体顶点索引
* normal：几何体顶点法线



#### group

group 用来表示一组对象，可以包含mesh、group、line等子对象 构成层级模型。可以把生成的同类型模型加入到组内，然后再把group 加入到场景中。



#### 如何设置三维场景的阴影

* WebGl`渲染器允许阴影渲染  为了性能默认不开启

* 设置产生阴影的模型对象 castShadow

* 设置产生阴影的光源对象 

* 设置接收阴影效果的模型

* 设置光源阴影渲染范围

  

#### 材质 material

材质就像是物体的皮肤，它会决定物体看起来像什么样子，是木板、金属、是否透明、颜色等等。

Mesh = geomtery + material



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



#### 灯光

* spotLight 聚光灯 沿着一个特定方向发散的光源，照射范围在三维空间中构成一个圆锥体
* 平行光 光沿着方向平行发射，阳光
* 环境光 光在环境中多次反射的光



##### 模型姿态旋转

* 欧拉角 rotation  万象死锁
* 四元数 任意角度
* 旋转矩阵



























