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
var w_list = {
    w_0 : [1,1,1,1],
    w_1 : [1,1,1,1],
    w_2 : [1,1,1,1],
    w_3 : [1,1,1,1],
    w_4 : [1,1,1,1],
}

var lines = {
    
}

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

var lines = {
    line_0 : line_0,
    line_1 : line_1,
    line_2 : line_2,
    line_3 : line_3,
    line_4 : line_4,
}
function create_line_array(line) {
    var line_array = [];

    $.each(line, function (index, value) {
       line_array.push(new THREE.Vector3( value.x, value.y, value.z ));
    });

    return line_array;
}
function create_line(line_array) {
    var line_Geometry = new THREE.BufferGeometry().setFromPoints( line_array );
    let line_Material = new THREE.LineBasicMaterial({ color: 0xff0000, linewidth: 1 });
    let line = new THREE.Line(line_Geometry, line_Material);

    return line;
}

function add_points(line_id, line, point_count = 0) {
    var line_options = gui.addFolder('line' + line_id);

    for (let i = 0; i < point_count; i++) {
        let temp_point = line_options.addFolder('point' + i);
        temp_point.add(options, 'line_' + line_id + '_' + i +'x', -20, 20, 1).onChange(function(e){
            line[i].x = e;
            recount();
        });
        temp_point.add(options, 'line_' + line_id + '_' + i +'y', -20, 20, 1).onChange(function(e){
            line[i].y = e;
            recount();
        });
        temp_point.add(options, 'line_' + line_id + '_' + i +'z', -20, 20, 1).onChange(function(e){
            line[i].z = e;
            recount();
        });
    }

    return line_options;
}

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

function count_curve(r0, r1, r2, v, w0, w1, w2) {
    return (r0 * w0 * (1- v) * (1 - v) +
            2 * r1 * w1 * (1 - v) * v +
            r2 * w2 * v * v) /
        (w0 * (1- v) * (1 - v) +
            2 * w1 * (1 - v) * v +
            w2 * v * v);
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
        // count_r( line_4[0].x, line_4[1].x, line_4[2].x, line_4[3].x, v, w_4[0], w_4[1], w_4[2], w_4[3] ),
        u,
        wr_0,
        wr_1,
        wr_2,
        wr_3
    );
    // var x = co
    var y = count_r(
        count_r( line_0[0].y, line_0[1].y, line_0[2].y, line_0[3].y, v, w_0[0], w_0[1], w_0[2], w_0[3] ),
        count_r( line_1[0].y, line_1[1].y, line_1[2].y, line_1[3].y, v, w_1[0], w_1[1], w_1[2], w_1[3] ),
        count_r( line_2[0].y, line_2[1].y, line_2[2].y, line_2[3].y, v, w_2[0], w_2[1], w_2[2], w_2[3] ),
        count_r( line_3[0].y, line_3[1].y, line_3[2].y, line_3[3].y, v, w_3[0], w_3[1], w_3[2], w_3[3] ),
        // count_r( line_4[0].y, line_4[1].y, line_4[2].y, line_4[3].y, v, w_4[0], w_4[1], w_4[2], w_4[3] ),
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
        // count_r( line_4[0].z, line_4[1].z, line_4[2].z, line_4[3].z, v, w_4[0], w_4[1], w_4[2], w_4[3] ),
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

var paramFunc1 = function(u, v, target) {

    var u = u;
    var v = v;
    var wr_0 = count_w(w_0,v);
    var wr_1 = count_w(w_1,v);
    var wr_4 = count_w(w_4,v);

    var x = count_curve(
        count_r( line_0[0].x, line_0[1].x, line_0[2].x, line_0[3].x, v, w_0[0], w_0[1], w_0[2], w_0[3] ),
        count_r( line_1[0].x, line_1[1].x, line_1[2].x, line_1[3].x, v, w_1[0], w_1[1], w_1[2], w_1[3] ),
        count_r( line_4[0].x, line_4[1].x, line_4[2].x, line_4[3].x, v, w_4[0], w_4[1], w_4[2], w_4[3] ),
        u,
        wr_0,
        wr_1,
        wr_4
    );
    // var x = co
    var y = count_curve(
        count_r( line_0[0].y, line_0[1].y, line_0[2].y, line_0[3].y, v, w_0[0], w_0[1], w_0[2], w_0[3] ),
        count_r( line_1[0].y, line_1[1].y, line_1[2].y, line_1[3].y, v, w_1[0], w_1[1], w_1[2], w_1[3] ),
        count_r( line_4[0].y, line_4[1].y, line_4[2].y, line_4[3].y, v, w_4[0], w_4[1], w_4[2], w_4[3] ),
        u,
        wr_0,
        wr_1,
        wr_4
    );
    var z = count_curve(
        count_r( line_0[0].z, line_0[1].z, line_0[2].z, line_0[3].z, v, w_0[0], w_0[1], w_0[2], w_0[3] ),
        count_r( line_1[0].z, line_1[1].z, line_1[2].z, line_1[3].z, v, w_1[0], w_1[1], w_1[2], w_1[3] ),
        count_r( line_4[0].z, line_4[1].z, line_4[2].z, line_4[3].z, v, w_4[0], w_4[1], w_4[2], w_4[3] ),
        u,
        wr_0,
        wr_1,
        wr_4
    );
    target.set(x, y, z);
    uvArr.push(new THREE.Vector2(u, v));
    uvMap.set(new THREE.Vector3(x, y, z), new THREE.Vector2(u, v));
};

var paramFunc2 = function(u, v, target) {

    var u = u;
    var v = v;
    var wr_2 = count_w(w_2,v);
    var wr_3 = count_w(w_3,v);
    var wr_4 = count_w(w_4,v);

    console.log('u = ' + u + ' v = ' + v)
    var x = count_curve(
        count_r( line_4[0].x, line_4[1].x, line_4[2].x, line_4[3].x, v, w_4[0], w_4[1], w_4[2], w_4[3] ),
        count_r( line_2[0].x, line_2[1].x, line_2[2].x, line_2[3].x, v, w_2[0], w_2[1], w_2[2], w_2[3] ),
        count_r( line_3[0].x, line_3[1].x, line_3[2].x, line_3[3].x, v, w_3[0], w_3[1], w_3[2], w_3[3] ),
        u,
        wr_4,
        wr_2,
        wr_3
    );
    console.log(x);

    // var x = co
    var y = count_curve(
        count_r( line_4[0].y, line_4[1].y, line_4[2].y, line_4[3].y, v, w_4[0], w_4[1], w_4[2], w_4[3] ),
        count_r( line_2[0].y, line_2[1].y, line_2[2].y, line_2[3].y, v, w_2[0], w_2[1], w_2[2], w_2[3] ),
        count_r( line_3[0].y, line_3[1].y, line_3[2].y, line_3[3].y, v, w_3[0], w_3[1], w_3[2], w_3[3] ),
        u,
        wr_4,
        wr_2,
        wr_3
    );
    console.log(y);

    var z = count_curve(
        count_r( line_4[0].z, line_4[1].z, line_4[2].z, line_4[3].z, v, w_4[0], w_4[1], w_4[2], w_4[3] ),
        count_r( line_2[0].z, line_2[1].z, line_2[2].z, line_2[3].z, v, w_2[0], w_2[1], w_2[2], w_2[3] ),
        count_r( line_3[0].z, line_3[1].z, line_3[2].z, line_3[3].z, v, w_3[0], w_3[1], w_3[2], w_3[3] ),
        u,
        wr_4,
        wr_2,
        wr_3
    );
    console.log(z);

    target.set(x, y, z);
    uvArr.push(new THREE.Vector2(u, v));
    uvMap.set(new THREE.Vector3(x, y, z), new THREE.Vector2(u, v));
};


//--------ADD GEOMETRY & MESH--------
var geometry = new ParametricGeometry(paramFunc, 5, 5);
var material = new THREE.MeshBasicMaterial({
    color: 0xff29,
    side: THREE.DoubleSide,
    wireframe: true,
});

var mesh = new THREE.Mesh(geometry, material);
mesh.position.set( 0, 0, 0 );
mesh.scale.multiplyScalar( 1 );
scene.add(mesh);




var geometry1 = new ParametricGeometry(paramFunc1, 5, 5);
var material1 = new THREE.MeshBasicMaterial({
    color: 0xff29,
    side: THREE.DoubleSide,
    wireframe: true,
});

var mesh1 = new THREE.Mesh(geometry1, material1);
mesh1.position.set( 0, 0, 0 );
mesh1.scale.multiplyScalar( 1 );
scene.add(mesh1);

var geometry2 = new ParametricGeometry(paramFunc2, 5, 5);
var material2 = new THREE.MeshBasicMaterial({
    color: 0xff29,
    side: THREE.DoubleSide,
    wireframe: true,
});

var mesh2 = new THREE.Mesh(geometry2, material2);
mesh2.position.set( 0, 0, 0 );
mesh2.scale.multiplyScalar( 1 );
scene.add(mesh2);



var line0_array = create_line_array(line_0);
var line1_array = create_line_array(line_1);
var line2_array = create_line_array(line_2);
var line3_array = create_line_array(line_3);
var line4_array = create_line_array(line_4);

let line0 = create_line(line0_array);
let line1 = create_line(line1_array);
let line2 = create_line(line2_array);
let line3 = create_line(line3_array);
let line4 = create_line(line4_array);
//scene.add(line0);

function setup_lines(){    // Create a Three.js geometry for the point
    line0_array = create_line_array(line_0);
    line1_array = create_line_array(line_1);
    line2_array = create_line_array(line_2);
    line3_array = create_line_array(line_3);
    line4_array = create_line_array(line_4);

    line0 = create_line(line0_array);
    line1 = create_line(line1_array);
    line2 = create_line(line2_array);
    line3 = create_line(line3_array);
    line4 = create_line(line4_array);
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
    color: 0xff29,
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
    line_3_3z: line_3[3].z,

    line_4_0x: line_3[0].x,
    line_4_0y: line_3[0].y,
    line_4_0z: line_3[0].z,
    line_4_1x: line_3[1].x,
    line_4_1y: line_3[1].y,
    line_4_1z: line_3[1].z,
    line_4_2x: line_3[2].x,
    line_4_2y: line_3[2].y,
    line_4_2z: line_3[2].z,
    line_4_3x: line_3[3].x,
    line_4_3y: line_3[3].y,
    line_4_3z: line_3[3].z
    // reset: function(){
    //     this.color = 0xff29;
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
    color: 0xff29,
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
        scene.add(line4);
    } else {
        scene.remove(line0);
        scene.remove(line1);
        scene.remove(line2);
        scene.remove(line3);
        scene.remove(line4);

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
    line4.position.x = e;

    points.position.x = e;
});
evclid.add(options, 'movey', -10, 10, 0.1).onChange(function(e){
    mesh.position.y = e;
    line0.position.y = e;
    line1.position.y = e;
    line2.position.y = e;
    line3.position.y = e;
    line4.position.y = e;

    points.position.y = e;
});
evclid.add(options, 'movez', -10, 10, 0.1).onChange(function(e){
    mesh.position.z = e;
    line0.position.z = e;
    line1.position.z = e;
    line2.position.z = e;
    line3.position.z = e;
    line4.position.z = e;

    points.position.z = e;
});


evclid.add(options, 'rotatex', -180, 180, 1).onChange(function(e){
    mesh.rotation.x = (e*Math.PI)/180;
    line0.rotation.x = mesh.rotation.x;
    line1.rotation.x = mesh.rotation.x;
    line2.rotation.x = mesh.rotation.x;
    line3.rotation.x = mesh.rotation.x;
    line4.rotation.x = mesh.rotation.x;

    points.rotation.x = mesh.rotation.x;

});
evclid.add(options, 'rotatey', -180, 180, 1).onChange(function(e){
    mesh.rotation.y = (e*Math.PI)/180;
    line0.rotation.y = mesh.rotation.y;
    line1.rotation.y = mesh.rotation.y;
    line2.rotation.y = mesh.rotation.y;
    line3.rotation.y = mesh.rotation.y;
    line4.rotation.y = mesh.rotation.y;

    points.rotation.y = mesh.rotation.y;
});
evclid.add(options, 'rotatez', -180, 180, 1).onChange(function(e){
    mesh.rotation.z = (e*Math.PI)/180;
    line0.rotation.z = mesh.rotation.z;
    line1.rotation.z = mesh.rotation.z;
    line2.rotation.z = mesh.rotation.z;
    line3.rotation.z = mesh.rotation.z;
    line4.rotation.z = mesh.rotation.z;

    points.rotation.z = mesh.rotation.z;
});
//evclid.open();

var line_0_options = add_points(0, line_0, 4);
var line_1_options = add_points(1, line_1, 4);
var line_2_options = add_points(2, line_2, 4);
var line_3_options = add_points(3, line_3, 4);
var line_4_options = add_points(4, line_4, 4);

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
        mesh.material.color.set(0xff29);
    }
};

function recount(){
    scene.remove(mesh);
    scene.remove(mesh1);
    scene.remove(mesh2);
    geometry = new ParametricGeometry(paramFunc, 5, 5);
    geometry1 = new ParametricGeometry(paramFunc1, 5, 5);
    geometry2 = new ParametricGeometry(paramFunc1, 5, 5);

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
        line_3[3].x, line_3[3].y, line_3[3].z,
        line_4[0].x, line_4[0].y, line_4[0].z,
        line_4[1].x, line_4[1].y, line_4[1].z,
        line_4[2].x, line_4[2].y, line_4[2].z,
        line_4[3].x, line_4[3].y, line_4[3].z
    ]);
    pointGeometry.setAttribute('position', new THREE.BufferAttribute(vertices, 3));
    pointMaterial = new THREE.PointsMaterial({ color: 0xfff000, size: 1 });
    points = new THREE.Points(pointGeometry, pointMaterial);

    scene.remove(line0);
    scene.remove(line1);
    scene.remove(line2);
    scene.remove(line3);
    scene.remove(line4);

    setup_lines();

    scene.add(line0);
    scene.add(line1);
    scene.add(line2);
    scene.add(line3);
    scene.add(line4);
    scene.add(points);

    mesh = new THREE.Mesh(geometry, material);
    mesh1 = new THREE.Mesh(geometry1, material);
    mesh2 = new THREE.Mesh(geometry2, material);
    scene.add(mesh);
    scene.add(mesh1);
    scene.add(mesh2);
}

//drawPoints();


//gui.add(default_button, 'default');

function animate(time){
    renderer.render(scene, camera);
}

renderer.setAnimationLoop(animate);