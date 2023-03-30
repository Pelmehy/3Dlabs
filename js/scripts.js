import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { VertexNormalsHelper } from 'three/examples/jsm/helpers/VertexNormalsHelper.js';
import { ParametricGeometry } from 'three/examples/jsm/geometries/ParametricGeometry.js';
import * as dat from 'dat.gui';

const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(
    45,
    window.innerWidth/window.innerHeight,
    0.1,
    1000
);

// f = 0.5

var w_0 = [1,1,1,1];
var w_1 = [1,1,1,1];
var w_2 = [1,1,1,1];
var w_3 = [1,1,1,1];
var w_4 = [1,1,1,1];

var line_0= [];
line_0.push({x: 5, y: 0, z: 15});
line_0.push({x: 8, y: 0, z: 10});
line_0.push({x: 10, y: 0, z: 5});
line_0.push({x: 10, y: 0, z: 0});

var line_1 = [];
line_1.push({x: 3, y: 4, z: 15});
line_1.push({x: 5, y: 5, z: 10});
line_1.push({x: 7, y: 7, z: 5});
line_1.push({x: 7, y: 10, z: 0});


var line_2 = [];
line_2.push({x: -3, y: 4, z: 15});
line_2.push({x: -5, y: 5, z: 10});
line_2.push({x: -7, y: 7, z: 5});
line_2.push({x: -7, y: 10, z: 0});

var line_3 = [];
line_3.push({x: -5, y: 0, z: 15});
line_3.push({x: -8, y: 0, z: 10});
line_3.push({x: -10, y: 0, z: 5});
line_3.push({x: -10, y: 0, z: 0});

var line_4 = [];
line_4.push({x: 0, y: 7, z: 15});
line_4.push({x: 0, y: 8, z: 10});
line_4.push({x: 0, y: 10, z: 5});
line_4.push({x: 0, y: 13, z: 0});


const orbit = new OrbitControls(camera, renderer.domElement);

const axesHelper = new THREE.AxesHelper(5);
scene.add(axesHelper);

camera.position.set(-10, 30, 30);
orbit.update();

const gridHelper = new THREE.GridHelper(50);
scene.add(gridHelper);

function count_w( w_i, v ) {
    return w_i[0]*( 1 - v )*( 1 - v )*( 1 - v ) +
        3*w_i[1]*( 1 - v )*( 1 - v )*v +
        3*w_i[2]*( 1 - v )*v*v +
        w_i[3]*v*v*v;
}

function count_r( r0, r1, r2, r3, v, w0, w1, w2, w3 ) {
    return ( r0**w0*( 1 - v )*( 1 - v )*( 1 - v ) +
            3*r1*w1*( 1 - v )*( 1 - v )*v +
            3*r2*w2*( 1 - v )*v*v +
            r3*w3*v*v*v ) /
        ( w0*( 1 - v )*( 1 - v )*( 1 - v ) +
            3*w1*( 1 - v )*( 1 - v )*v +
            3*w2*( 1 - v )*v*v +
            w3*v*v*v );
}

var uvArr = [];
var uvMap = new Map();

var paramFunc = function(u, v, target) {

    var u = u;
    var v = v;
    var wr_0 = count_w(w_0,v);
    var wr_1 = count_w(w_1,v);
    var wr_2 = count_w(w_2,v);
    var wr_3 = count_w(w_3,v);

    var x = count_r(
        count_r( line_0[0].x, line_0[1].x, line_0[2].x, line_0[3].x, v, w_0[0], w_0[1], w_0[2], w_0[3] ),
        count_r( line_1[0].x, line_1[1].x, line_1[2].x, line_1[3].x, v, w_1[0], w_1[1], w_1[2], w_1[3] ),
        count_r( line_2[0].x, line_2[1].x, line_2[2].x, line_2[3].x, v, w_2[0], w_2[1], w_2[2], w_2[3] ),
        count_r( line_3[0].x, line_3[1].x, line_3[2].x, line_3[3].x, v, w_3[0], w_3[1], w_3[2], w_3[3] ),
        u,
        wr_0,
        wr_1,
        wr_2,
        wr_3
    );
    var y = count_r(
        count_r( line_0[0].y, line_0[1].y, line_0[2].y, line_0[3].y, v, w_0[0], w_0[1], w_0[2], w_0[3] ),
        count_r( line_1[0].y, line_1[1].y, line_1[2].y, line_1[3].y, v, w_1[0], w_1[1], w_1[2], w_1[3] ),
        count_r( line_2[0].y, line_2[1].y, line_2[2].y, line_2[3].y, v, w_2[0], w_2[1], w_2[2], w_2[3] ),
        count_r( line_3[0].y, line_3[1].y, line_3[2].y, line_3[3].y, v, w_3[0], w_3[1], w_3[2], w_3[3] ),
        u,
        wr_0,
        wr_1,
        wr_2,
        wr_3
    );
    var z = count_r(
        count_r( line_0[0].z, line_0[1].z, line_0[2].z, line_0[3].z, v, w_0[0], w_0[1], w_0[2], w_0[3] ),
        count_r( line_1[0].z, line_1[1].z, line_1[2].z, line_1[3].z, v, w_1[0], w_1[1], w_1[2], w_1[3] ),
        count_r( line_2[0].z, line_2[1].z, line_2[2].z, line_2[3].z, v, w_2[0], w_2[1], w_2[2], w_2[3] ),
        count_r( line_3[0].z, line_3[1].z, line_3[2].z, line_3[3].z, v, w_3[0], w_3[1], w_3[2], w_3[3] ),
        u,
        wr_0,
        wr_1,
        wr_2,
        wr_3
    );
    target.set(x, y, z);
    uvArr.push(new THREE.Vector2(u, v));
    uvMap.set(new THREE.Vector3(x, y, z), new THREE.Vector2(u, v));
};


//--------ADD GEOMETRY & MESH--------
var geometry = new ParametricGeometry(paramFunc, 5, 5);
var material = new THREE.MeshBasicMaterial({
    color: 0x9800ff,
    side: THREE.DoubleSide,
    wireframe: true,
});

var mesh = new THREE.Mesh(geometry, material);
mesh.position.set( 0, 0, 0 );
mesh.scale.multiplyScalar( 1 );
scene.add(mesh);

var line0_array = [];
line0_array.push( new THREE.Vector3( line_0[0].x, line_0[0].y, line_0[0].z ) );
line0_array.push( new THREE.Vector3( line_0[1].x, line_0[1].y, line_0[1].z ) );
line0_array.push( new THREE.Vector3( line_0[2].x, line_0[2].y, line_0[2].z ) );
line0_array.push( new THREE.Vector3( line_0[3].x, line_0[3].y, line_0[3].z ) );

var line1_array = [];
line1_array.push( new THREE.Vector3( line_1[0].x, line_1[0].y, line_1[0].z ) );
line1_array.push( new THREE.Vector3( line_1[1].x, line_1[1].y, line_1[1].z ) );
line1_array.push( new THREE.Vector3( line_1[2].x, line_1[2].y, line_1[2].z ) );
line1_array.push( new THREE.Vector3( line_1[3].x, line_1[3].y, line_1[3].z ) );

var line2_array = [];
line2_array.push( new THREE.Vector3( line_2[0].x, line_2[0].y, line_2[0].z ) );
line2_array.push( new THREE.Vector3( line_2[1].x, line_2[1].y, line_2[1].z ) );
line2_array.push( new THREE.Vector3( line_2[2].x, line_2[2].y, line_2[2].z ) );
line2_array.push( new THREE.Vector3( line_2[3].x, line_2[3].y, line_2[3].z ) );

var line3_array = [];
line3_array.push( new THREE.Vector3( line_3[0].x, line_3[0].y, line_3[0].z ) );
line3_array.push( new THREE.Vector3( line_3[1].x, line_3[1].y, line_3[1].z ) );
line3_array.push( new THREE.Vector3( line_3[2].x, line_3[2].y, line_3[2].z ) );
line3_array.push( new THREE.Vector3( line_3[3].x, line_3[3].y, line_3[3].z ) );

var line4_array = [];                                                           
line3_array.push( new THREE.Vector3( line_4[0].x, line_4[0].y, line_4[0].z ) );
line3_array.push( new THREE.Vector3( line_4[1].x, line_4[1].y, line_4[1].z ) );
line3_array.push( new THREE.Vector3( line_4[2].x, line_4[2].y, line_4[2].z ) );
line3_array.push( new THREE.Vector3( line_4[3].x, line_4[3].y, line_4[3].z ) );

var line_0_Geometry = new THREE.BufferGeometry().setFromPoints( line0_array );
let line_0_Material = new THREE.LineBasicMaterial({ color: 0xff0000, linewidth: 1 });
let line0 = new THREE.Line(line_0_Geometry, line_0_Material);
//scene.add(line0);

var line_1_Geometry = new THREE.BufferGeometry().setFromPoints( line1_array );
let line_1_Material = new THREE.LineBasicMaterial({ color: 0xff0000, linewidth: 1 });
let line1 = new THREE.Line(line_1_Geometry, line_1_Material);
//scene.add(line1);

var line_2_Geometry = new THREE.BufferGeometry().setFromPoints( line2_array );
let line_2_Material = new THREE.LineBasicMaterial({ color: 0xff0000, linewidth: 1 });
let line2 = new THREE.Line(line_2_Geometry, line_2_Material);
//scene.add(line2);

var line_3_Geometry = new THREE.BufferGeometry().setFromPoints( line3_array );
let line_3_Material = new THREE.LineBasicMaterial({ color: 0xff0000, linewidth: 1 });
let line3 = new THREE.Line(line_3_Geometry, line_3_Material);

var line_4_Geometry = new THREE.BufferGeometry().setFromPoints( line4_array );
let line_4_Material = new THREE.LineBasicMaterial({ color: 0xff0000, linewidth: 1 });
let line4 = new THREE.Line(line_4_Geometry, line_4_Material);


function setup_lines(){    // Create a Three.js geometry for the point
    line0_array = [];
    line0_array.push( new THREE.Vector3( line_0[0].x, line_0[0].y, line_0[0].z ) );
    line0_array.push( new THREE.Vector3( line_0[1].x, line_0[1].y, line_0[1].z ) );
    line0_array.push( new THREE.Vector3( line_0[2].x, line_0[2].y, line_0[2].z ) );
    line0_array.push( new THREE.Vector3( line_0[3].x, line_0[3].y, line_0[3].z ) );

    line1_array = [];
    line1_array.push( new THREE.Vector3( line_1[0].x, line_1[0].y, line_1[0].z ) );
    line1_array.push( new THREE.Vector3( line_1[1].x, line_1[1].y, line_1[1].z ) );
    line1_array.push( new THREE.Vector3( line_1[2].x, line_1[2].y, line_1[2].z ) );
    line1_array.push( new THREE.Vector3( line_1[3].x, line_1[3].y, line_1[3].z ) );

    line2_array = [];
    line2_array.push( new THREE.Vector3( line_2[0].x, line_2[0].y, line_2[0].z ) );
    line2_array.push( new THREE.Vector3( line_2[1].x, line_2[1].y, line_2[1].z ) );
    line2_array.push( new THREE.Vector3( line_2[2].x, line_2[2].y, line_2[2].z ) );
    line2_array.push( new THREE.Vector3( line_2[3].x, line_2[3].y, line_2[3].z ) );

    line3_array = [];
    line3_array.push( new THREE.Vector3( line_3[0].x, line_3[0].y, line_3[0].z ) );
    line3_array.push( new THREE.Vector3( line_3[1].x, line_3[1].y, line_3[1].z ) );
    line3_array.push( new THREE.Vector3( line_3[2].x, line_3[2].y, line_3[2].z ) );
    line3_array.push( new THREE.Vector3( line_3[3].x, line_3[3].y, line_3[3].z ) );

    line4_array = [];
    line4_array.push( new THREE.Vector3( line_4[0].x, line_4[0].y, line_4[0].z ) );
    line4_array.push( new THREE.Vector3( line_4[1].x, line_4[1].y, line_4[1].z ) );
    line4_array.push( new THREE.Vector3( line_4[2].x, line_4[2].y, line_4[2].z ) );
    line4_array.push( new THREE.Vector3( line_4[3].x, line_4[3].y, line_4[3].z ) );

    line_0_Geometry = new THREE.BufferGeometry().setFromPoints( line0_array );
    line_0_Material = new THREE.LineBasicMaterial({ color: 0xff0000, linewidth: 1 });
    line0 = new THREE.Line(line_0_Geometry, line_0_Material);
    //scene.add(line0);

    line_1_Geometry = new THREE.BufferGeometry().setFromPoints( line1_array );
    line_1_Material = new THREE.LineBasicMaterial({ color: 0xff0000, linewidth: 1 });
    line1 = new THREE.Line(line_1_Geometry, line_1_Material);
    //scene.add(line1);

    line_2_Geometry = new THREE.BufferGeometry().setFromPoints( line2_array );
    line_2_Material = new THREE.LineBasicMaterial({ color: 0xff0000, linewidth: 1 });
    line2 = new THREE.Line(line_2_Geometry, line_2_Material);
    //scene.add(line2);

    line_3_Geometry = new THREE.BufferGeometry().setFromPoints( line3_array );
    line_3_Material = new THREE.LineBasicMaterial({ color: 0xff0000, linewidth: 1 });
    line3 = new THREE.Line(line_3_Geometry, line_3_Material);
    
    line_4_Geometry = new THREE.BufferGeometry().setFromPoints( line3_array );
    line_4_Material = new THREE.LineBasicMaterial({ color: 0xff0000, linewidth: 1 });
    line4 = new THREE.Line(line_4_Geometry, line_4_Material);
}
//scene.add(line3);


// Create a Three.js geometry for the point
let pointGeometry = new THREE.BufferGeometry();
let vertices = new Float32Array([
    line_0[0].x, line_0[0].y, line_0[0].z,
    line_0[1].x, line_0[1].y, line_0[1].z,
    line_0[2].x, line_0[2].y, line_0[2].z,
    line_0[3].x, line_0[3].y, line_0[3].z,
    line_1[0].x, line_1[0].y, line_1[0].z,
    line_1[1].x, line_1[1].y, line_1[1].z,
    line_1[2].x, line_1[2].y, line_1[2].z,
    line_1[3].x, line_1[3].y, line_1[3].z,
    line_2[0].x, line_2[0].y, line_2[0].z,
    line_2[1].x, line_2[1].y, line_2[1].z,
    line_2[2].x, line_2[2].y, line_2[2].z,
    line_2[3].x, line_2[3].y, line_2[3].z,
    line_3[0].x, line_3[0].y, line_3[0].z,
    line_3[1].x, line_3[1].y, line_3[1].z,
    line_3[2].x, line_3[2].y, line_3[2].z,
    line_3[3].x, line_3[3].y, line_3[3].z,
    line_4[0].x, line_4[0].y, line_4[0].z,
    line_4[1].x, line_4[1].y, line_4[1].z,
    line_4[2].x, line_4[2].y, line_4[2].z,
    line_4[3].x, line_4[3].y, line_4[3].z
]);
pointGeometry.setAttribute('position', new THREE.BufferAttribute(vertices, 3));
let pointMaterial = new THREE.PointsMaterial({ color: 0xfff000, size: 1 });
let points = new THREE.Points(pointGeometry, pointMaterial);
//scene.add(points);



const gui = new dat.GUI();

var options = {
    color: 0x9800ff,
    wireframe: true,
    frames: 10,
    normals: false,
    movex: 0,
    movey: 0,
    movez: 0,
    rotatex: 0,
    rotatey: 0,
    rotatez: 0,
    carkas: false,
    line_0_0x: line_0[0].x,
    line_0_0y: line_0[0].y,
    line_0_0z: line_0[0].z,
    line_0_1x: line_0[1].x,
    line_0_1y: line_0[1].y,
    line_0_1z: line_0[1].z,
    line_0_2x: line_0[2].x,
    line_0_2y: line_0[2].y,
    line_0_2z: line_0[2].z,
    line_0_3x: line_0[3].x,
    line_0_3y: line_0[3].y,
    line_0_3z: line_0[3].z,

    line_1_0x: line_1[0].x,
    line_1_0y: line_1[0].y,
    line_1_0z: line_1[0].z,
    line_1_1x: line_1[1].x,
    line_1_1y: line_1[1].y,
    line_1_1z: line_1[1].z,
    line_1_2x: line_1[2].x,
    line_1_2y: line_1[2].y,
    line_1_2z: line_1[2].z,
    line_1_3x: line_1[3].x,
    line_1_3y: line_1[3].y,
    line_1_3z: line_1[3].z,

    line_2_0x: line_2[0].x,
    line_2_0y: line_2[0].y,
    line_2_0z: line_2[0].z,
    line_2_1x: line_2[1].x,
    line_2_1y: line_2[1].y,
    line_2_1z: line_2[1].z,
    line_2_2x: line_2[2].x,
    line_2_2y: line_2[2].y,
    line_2_2z: line_2[2].z,
    line_2_3x: line_2[3].x,
    line_2_3y: line_2[3].y,
    line_2_3z: line_2[3].z,

    line_3_0x: line_3[0].x,
    line_3_0y: line_3[0].y,
    line_3_0z: line_3[0].z,
    line_3_1x: line_3[1].x,
    line_3_1y: line_3[1].y,
    line_3_1z: line_3[1].z,
    line_3_2x: line_3[2].x,
    line_3_2y: line_3[2].y,
    line_3_2z: line_3[2].z,
    line_3_3x: line_3[3].x,
    line_3_3y: line_3[3].y,
    line_3_3z: line_3[3].z
    // reset: function(){
    //     this.color = 0x9800ff;
    //     this.wireframe = true;
    //     this.frames = 10;
    //     this.normals = false;
    //     this.movex = 0;
    //     this.movey = 0;
    //     this.movez = 0;
    //     this.rotatex = 0;
    //     this.rotatey = 0;
    //     this.rotatez = 0;
    // }
};

var originOptions = Object.assign({}, options);

var default_options = {
    color: 0x9800ff,
    wireframe: true,
    frames: 10,
    normals: false,
    movex: 0,
    movey: 0,
    movez: 0,
    rotatex: 0,
    rotatey: 0,
    rotatez: 0
};

gui.addColor(options, 'color').onChange(function(e){
    mesh.material.color.set(e);
});

gui.add(options, 'wireframe').onChange(function(e){
    mesh.material.wireframe = e;
});

gui.add(options, 'frames',1, 40, 1).onChange(function(e){
    mesh.geometry = new ParametricGeometry(paramFunc, e, e);
});
var helperNormals;
gui.add(options, 'normals').onChange(function(e){
    if(e){
        helperNormals = new VertexNormalsHelper( mesh, 1, 0xff0000 );
        scene.add( helperNormals );
    } else {
        scene.remove( helperNormals )
    }
});

gui.add(options, 'carkas').onChange(function(e){
    if(e){
        scene.add(points);
        scene.add(line0);
        scene.add(line1);
        scene.add(line2);
        scene.add(line3);
    } else {
        scene.remove(line0);
        scene.remove(line1);
        scene.remove(line2);
        scene.remove(line3);
        scene.remove(points);
    }
});

var evclid = gui.addFolder('evclid');
evclid.add(options, 'movex', -10, 10, 0.1).onChange(function(e){
    mesh.position.x = e;
    line0.position.x = e;
    line1.position.x = e;
    line2.position.x = e;
    line3.position.x = e;
    points.position.x = e;
});
evclid.add(options, 'movey', -10, 10, 0.1).onChange(function(e){
    mesh.position.y = e;
    line0.position.y = e;
    line1.position.y = e;
    line2.position.y = e;
    line3.position.y = e;
    points.position.y = e;
});
evclid.add(options, 'movez', -10, 10, 0.1).onChange(function(e){
    mesh.position.z = e;
    line0.position.z = e;
    line1.position.z = e;
    line2.position.z = e;
    line3.position.z = e;
    points.position.z = e;
});


evclid.add(options, 'rotatex', -180, 180, 1).onChange(function(e){
    mesh.rotation.x = (e*Math.PI)/180;
    line0.rotation.x = mesh.rotation.x;
    line1.rotation.x = mesh.rotation.x;
    line2.rotation.x = mesh.rotation.x;
    line3.rotation.x = mesh.rotation.x;
    points.rotation.x = mesh.rotation.x;

});
evclid.add(options, 'rotatey', -180, 180, 1).onChange(function(e){
    mesh.rotation.y = (e*Math.PI)/180;
    line0.rotation.y = mesh.rotation.y;
    line1.rotation.y = mesh.rotation.y;
    line2.rotation.y = mesh.rotation.y;
    line3.rotation.y = mesh.rotation.y;
    points.rotation.y = mesh.rotation.y;
});
evclid.add(options, 'rotatez', -180, 180, 1).onChange(function(e){
    mesh.rotation.z = (e*Math.PI)/180;
    line0.rotation.z = mesh.rotation.z;
    line1.rotation.z = mesh.rotation.z;
    line2.rotation.z = mesh.rotation.z;
    line3.rotation.z = mesh.rotation.z;
    points.rotation.z = mesh.rotation.z;
});
//evclid.open();

var line_0_options = gui.addFolder('line0');
var point_0_0 = line_0_options.addFolder('point0');
point_0_0.add(options, 'line_0_0x', -20, 20, 1).onChange(function(e){
    line_0[0].x = e;
    recount();
});
point_0_0.add(options, 'line_0_0y', -20, 20, 1).onChange(function(e){
    line_0[0].y = e;
    recount();
});
point_0_0.add(options, 'line_0_0z', -20, 20, 1).onChange(function(e){
    line_0[0].z = e;
    recount();
});

var point_0_1 = line_0_options.addFolder('point1');
point_0_1.add(options, 'line_0_1x', -20, 20, 1).onChange(function(e){
    line_0[1].x = e;
    recount();
});
point_0_1.add(options, 'line_0_1y', -20, 20, 1).onChange(function(e){
    line_0[1].y = e;
    recount();
});
point_0_1.add(options, 'line_0_1z', -20, 20, 1).onChange(function(e){
    line_0[1].z = e;
    recount();
});

var point_0_2 = line_0_options.addFolder('point2');
point_0_2.add(options, 'line_0_2x', -20, 20, 1).onChange(function(e){
    line_0[2].x = e;
    recount();
});
point_0_2.add(options, 'line_0_2y', -20, 20, 1).onChange(function(e){
    line_0[2].y = e;
    recount();
});
point_0_2.add(options, 'line_0_2z', -20, 20, 1).onChange(function(e){
    line_0[2].z = e;
    recount();
});

var point_0_3 = line_0_options.addFolder('point3');
point_0_3.add(options, 'line_0_3x', -20, 20, 1).onChange(function(e){
    line_0[3].x = e;
    recount();
});
point_0_3.add(options, 'line_0_3y', -20, 20, 1).onChange(function(e){
    line_0[3].y = e;
    recount();
});
point_0_3.add(options, 'line_0_3z', -20, 20, 1).onChange(function(e){
    line_0[3].z = e;
    recount();
});



var line_1_options = gui.addFolder('line1');
var point_1_0 = line_1_options.addFolder('point0');
point_1_0.add(options, 'line_1_0x', -20, 20, 1).onChange(function(e){
    line_1[0].x = e;
    recount();
});
point_1_0.add(options, 'line_1_0y', -20, 20, 1).onChange(function(e){
    line_1[0].y = e;
    recount();
});
point_1_0.add(options, 'line_1_0z', -20, 20, 1).onChange(function(e){
    line_1[0].z = e;
    recount();
});

var point_1_1 = line_1_options.addFolder('point1');
point_1_1.add(options, 'line_1_1x', -20, 20, 1).onChange(function(e){
    line_1[1].x = e;
    recount();
});
point_1_1.add(options, 'line_1_1y', -20, 20, 1).onChange(function(e){
    line_1[1].y = e;
    recount();
});
point_1_1.add(options, 'line_1_1z', -20, 20, 1).onChange(function(e){
    line_1[1].z = e;
    recount();
});

var point_1_2 = line_1_options.addFolder('point2');
point_1_2.add(options, 'line_1_2x', -20, 20, 1).onChange(function(e){
    line_1[2].x = e;
    recount();
});
point_1_2.add(options, 'line_1_2y', -20, 20, 1).onChange(function(e){
    line_1[2].y = e;
    recount();
});
point_1_2.add(options, 'line_1_2z', -20, 20, 1).onChange(function(e){
    line_1[2].z = e;
    recount();
});

var point_1_3 = line_1_options.addFolder('point3');
point_1_3.add(options, 'line_1_3x', -20, 20, 1).onChange(function(e){
    line_1[3].x = e;
    recount();
});
point_1_3.add(options, 'line_1_3y', -20, 20, 1).onChange(function(e){
    line_1[3].y = e;
    recount();
});
point_1_3.add(options, 'line_1_3z', -20, 20, 1).onChange(function(e){
    line_1[3].z = e;
    recount();
});



var line_2_options = gui.addFolder('line2');
var point_2_0 = line_2_options.addFolder('point0');
point_2_0.add(options, 'line_2_0x', -20, 20, 1).onChange(function(e){
    line_2[0].x = e;
    recount();
});
point_2_0.add(options, 'line_2_0y', -20, 20, 1).onChange(function(e){
    line_2[0].y = e;
    recount();
});
point_2_0.add(options, 'line_2_0z', -20, 20, 1).onChange(function(e){
    line_2[0].z = e;
    recount();
});

var point_2_1 = line_2_options.addFolder('point1');
point_2_1.add(options, 'line_2_1x', -20, 20, 1).onChange(function(e){
    line_2[1].x = e;
    recount();
});
point_2_1.add(options, 'line_2_1y', -20, 20, 1).onChange(function(e){
    line_2[1].y = e;
    recount();
});
point_2_1.add(options, 'line_2_1z', -20, 20, 1).onChange(function(e){
    line_2[1].z = e;
    recount();
});

var point_2_2 = line_2_options.addFolder('point2');
point_2_2.add(options, 'line_2_2x', -20, 20, 1).onChange(function(e){
    line_2[2].x = e;
    recount();
});
point_2_2.add(options, 'line_2_2y', -20, 20, 1).onChange(function(e){
    line_2[2].y = e;
    recount();
});
point_2_2.add(options, 'line_2_2z', -20, 20, 1).onChange(function(e){
    line_2[2].z = e;
    recount();
});

var point_2_3 = line_2_options.addFolder('point3');
point_2_3.add(options, 'line_2_3x', -20, 20, 1).onChange(function(e){
    line_2[3].x = e;
    recount();
});
point_2_3.add(options, 'line_2_3y', -20, 20, 1).onChange(function(e){
    line_2[3].y = e;
    recount();
});
point_2_3.add(options, 'line_2_3z', -20, 20, 1).onChange(function(e){
    line_2[3].z = e;
    recount();
});




var line_3_options = gui.addFolder('line3');
var point_3_0 = line_3_options.addFolder('point0');
point_3_0.add(options, 'line_3_0x', -20, 20, 1).onChange(function(e){
    line_3[0].x = e;
    recount();
});
point_3_0.add(options, 'line_3_0y', -20, 20, 1).onChange(function(e){
    line_3[0].y = e;
    recount();
});
point_3_0.add(options, 'line_3_0z', -20, 20, 1).onChange(function(e){
    line_3[0].z = e;
    recount();
});

var point_3_1 = line_3_options.addFolder('point1');
point_3_1.add(options, 'line_3_1x', -20, 20, 1).onChange(function(e){
    line_3[1].x = e;
    recount();
});
point_3_1.add(options, 'line_3_1y', -20, 20, 1).onChange(function(e){
    line_3[1].y = e;
    recount();
});
point_3_1.add(options, 'line_3_1z', -20, 20, 1).onChange(function(e){
    line_3[1].z = e;
    recount();
});

var point_3_2 = line_3_options.addFolder('point2');
point_3_2.add(options, 'line_3_2x', -20, 20, 1).onChange(function(e){
    line_3[2].x = e;
    recount();
});
point_3_2.add(options, 'line_3_2y', -20, 20, 1).onChange(function(e){
    line_3[2].y = e;
    recount();
});
point_3_2.add(options, 'line_3_2z', -20, 20, 1).onChange(function(e){
    line_3[2].z = e;
    recount();
});

var point_3_3 = line_3_options.addFolder('point3');
point_3_3.add(options, 'line_3_3x', -20, 20, 1).onChange(function(e){
    line_3[3].x = e;
    recount();
});
point_3_3.add(options, 'line_3_3y', -20, 20, 1).onChange(function(e){
    line_3[3].y = e;
    recount();
});
point_3_3.add(options, 'line_3_3z', -20, 20, 1).onChange(function(e){
    line_3[3].z = e;
    recount();
});




const default_button = {
    default: function(){
        scene.remove(mesh);
        geometry = new ParametricGeometry(paramFunc, 5, 5);
        mesh = new THREE.Mesh(geometry, material);
        mesh.position.set( 0, 0, 0 );
        mesh.scale.multiplyScalar( 1 );
        scene.add(mesh);
        scene.remove( helperNormals )
        mesh.rotation.x = 0;
        mesh.rotation.y = 0;
        mesh.rotation.z = 0;
        mesh.position.x = 0;
        mesh.position.y = 0;
        mesh.position.z = 0;
        mesh.material.wireframe = true;
        mesh.material.color.set(0x9800ff);
    }
};

function recount(){
    scene.remove(mesh);
    geometry = new ParametricGeometry(paramFunc, 5, 5);

    scene.remove(points);
    vertices = new Float32Array([
        line_0[0].x, line_0[0].y, line_0[0].z,
        line_0[1].x, line_0[1].y, line_0[1].z,
        line_0[2].x, line_0[2].y, line_0[2].z,
        line_0[3].x, line_0[3].y, line_0[3].z,
        line_1[0].x, line_1[0].y, line_1[0].z,
        line_1[1].x, line_1[1].y, line_1[1].z,
        line_1[2].x, line_1[2].y, line_1[2].z,
        line_1[3].x, line_1[3].y, line_1[3].z,
        line_2[0].x, line_2[0].y, line_2[0].z,
        line_2[1].x, line_2[1].y, line_2[1].z,
        line_2[2].x, line_2[2].y, line_2[2].z,
        line_2[3].x, line_2[3].y, line_2[3].z,
        line_3[0].x, line_3[0].y, line_3[0].z,
        line_3[1].x, line_3[1].y, line_3[1].z,
        line_3[2].x, line_3[2].y, line_3[2].z,
        line_3[3].x, line_3[3].y, line_3[3].z
    ]);
    pointGeometry.setAttribute('position', new THREE.BufferAttribute(vertices, 3));
    pointMaterial = new THREE.PointsMaterial({ color: 0xfff000, size: 1 });
    points = new THREE.Points(pointGeometry, pointMaterial);

    scene.remove(line0);
    scene.remove(line1);
    scene.remove(line2);
    scene.remove(line3);

    setup_lines();

    scene.add(line0);
    scene.add(line1);
    scene.add(line2);
    scene.add(line3);
    scene.add(points);

    mesh = new THREE.Mesh(geometry, material);
    scene.add(mesh);
}

//drawPoints();


//gui.add(default_button, 'default');

function animate(time){
    renderer.render(scene, camera);
}

renderer.setAnimationLoop(animate);