#### 光线投射 Raycaster

 光线投射用于进行鼠标拾取（在三维空间中计算出鼠标移过了什么物体）。

```js
const raycaster = new THREE.Raycaster();
const pointer = new THREE.Vector2();

function onPointerMove( event ) {
	// 将鼠标位置归一化为设备坐标。x 和 y 方向的取值范围是 (-1 to +1)
	pointer.x = ( event.clientX / window.innerWidth ) * 2 - 1;
	pointer.y = - ( event.clientY / window.innerHeight ) * 2 + 1;

}

function render() {
    // 通过摄像机和鼠标位置更新射线
    raycaster.setFromCamera(mouse, camera);
    // 计算物体和射线的焦点
	const intersection = raycaster.intersectObject(mesh);
    // 说明选中了模型
			if (intersection.length > 0) {
				const instanceId = intersection[0].instanceId;
				mesh.getColorAt(instanceId, color);
                // 判断是否为白色 不需要重新赋颜色值
				if (color.equals(white)) {
					mesh.setColorAt(instanceId, color.setHex(Math.random() * 0xffffff));
					mesh.instanceColor.needsUpdate = true;
				}
			}
		
	renderer.render( scene, camera );
}

window.addEventListener( 'pointermove', onPointerMove );
```



#### InstanceMesh （g,m,count）

大量相同的几何体，减少绘制次数，提高性能。

```js
const geometry = new THREE.IcosahedronGeometry(0.5, 3);
const material = new THREE.MeshPhongMaterial({ color: 0xffffff });
let mesh = new THREE.InstancedMesh(geometry, material, count);

let i = 0;
const offset = (amount - 1) / 2;

const matrix = new THREE.Matrix4();

// 调整每个几何体的位置
for (let x = 0; x < amount; x++) {
	for (let y = 0; y < amount; y++) {
		for (let z = 0; z < amount; z++) {
			matrix.setPosition(offset - x, offset - y, offset - z);
			mesh.setMatrixAt(i, matrix);
			mesh.setColorAt(i, color);
			i++;
		}
	}
}
scene.add(mesh);
```

#### InstancedBufferGeometry 

当与用于实例化的转换相关的数据量过多或操作该数据的计算开销过多时，您将不得不回退到更底层的 InstancedBufferGeometry 方法并开始使用着色器。
 **这是关于 InstancedMesh 的另一件事。它允许您避免接触着色器。**

```js
const instances = 50000;

for ( let i = 0; i < instances; i ++ ) {
// offsets
offsets.push( Math.random() - 0.5, Math.random() - 0.5, Math.random() - 0.5 );
// colors
				colors.push( Math.random(), Math.random(), Math.random(), Math.random() );
				// orientation start
				vector.set( Math.random() * 2 - 1, Math.random() * 2 - 1, Math.random() * 2 - 1, Math.random() * 2 - 1 );
				vector.normalize();
}
const geometry = new THREE.InstancedBufferGeometry();
geometry.instanceCount = instances;

geometry.setAttribute('position',
	new THREE.Float32BufferAttribute( positions, 3)
);
geometry.setAttribute('offset',
	new THREE.InstancedBufferAttribute( new Float32Array( offsets ), 3)
);
geometry.setAttribute('color', new THREE.InstancedBufferAttribute(new Float32Array( colors ), 4));
```

