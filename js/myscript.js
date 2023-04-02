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
var w_list = [
    [1,1,1,1],    // w_0
    [1,1,1,1],    // w_1
    [1,1,1,1],    // w_2
    [1,1,1,1],    // w_3
    [1,1,1,1],    // w_4
];
console.log(w_list.length);

var lines = [
    [   // line 0
        {x: 5, y: 0, z: 15},
        {x: 8, y: 0, z: 10},
        {x: 10, y: 0, z: 5},
        {x: 10, y: 0, z: 0},
    ],
    [   // line 1
        {x: 3, y: 4, z: 15},
        {x: 5, y: 5, z: 10},
        {x: 7, y: 7, z: 5},
        {x: 7, y: 10, z: 0},
    ],
    [   // line 2
        {x: 0, y: 7, z: 15},
        {x: 0, y: 8, z: 10},
        {x: 0, y: 10, z: 5},
        {x: 0, y: 13, z: 0},
    ],
    [   // line 3
        {x: -3, y: 4, z: 15},
        {x: -5, y: 5, z: 10},
        {x: -7, y: 7, z: 5},
        {x: -7, y: 10, z: 0},
    ],
    [   // line 4
        {x: -5, y: 0, z: 15},
        {x: -8, y: 0, z: 10},
        {x: -10, y: 0, z: 5},
        {x: -10, y: 0, z: 0},
    ],
]

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
var pointIter = 0;
let meshArray = [];

var paramFuncDynamic3to4 = function(u, v, target) {

    var u = u;
    var v = v;
    var wr_list = [];
    for (let i = pointIter; i < pointIter + 3; i++) {
        wr_list.push(count_w(w_list[i], v));
    }

    var x = count_curve(
        count_r( lines[pointIter][0].x, lines[pointIter][1].x, lines[pointIter][2].x, lines[pointIter][3].x, v, w_list[pointIter][0], w_list[pointIter][1], w_list[pointIter][2], w_list[pointIter][3] ),
        count_r( lines[pointIter + 1][0].x, lines[pointIter + 1][1].x, lines[pointIter + 1][2].x, lines[pointIter + 1][3].x, v, w_list[pointIter + 1][0], w_list[pointIter + 1][1], w_list[pointIter + 1][2], w_list[pointIter + 1][3] ),
        count_r( lines[pointIter + 2][0].x, lines[pointIter + 2][1].x, lines[pointIter + 2][2].x, lines[pointIter + 2][3].x, v, w_list[pointIter + 2][0], w_list[pointIter + 2][1], w_list[pointIter + 2][2], w_list[pointIter + 2][3] ),
        u,
        wr_list[0],
        wr_list[1],
        wr_list[2]
    );

    // var x = co
    var y = count_curve(
        count_r( lines[pointIter][0].y, lines[pointIter][1].y, lines[pointIter][2].y, lines[pointIter][3].y, v, w_list[pointIter][0], w_list[pointIter][1], w_list[pointIter][2], w_list[pointIter][3] ),
        count_r( lines[pointIter + 1][0].y, lines[pointIter + 1][1].y, lines[pointIter + 1][2].y, lines[pointIter + 1][3].y, v, w_list[pointIter + 1][0], w_list[pointIter + 1][1], w_list[pointIter + 1][2], w_list[pointIter + 1][3] ),
        count_r( lines[pointIter + 2][0].y, lines[pointIter + 2][1].y, lines[pointIter + 2][2].y, lines[pointIter + 2][3].y, v, w_list[pointIter + 2][0], w_list[pointIter + 2][1], w_list[pointIter + 2][2], w_list[pointIter + 2][3] ),
        u,
        wr_list[0],
        wr_list[1],
        wr_list[2]
    );

    var z = count_curve(
        count_r( lines[pointIter][0].z, lines[pointIter][1].z, lines[pointIter][2].z, lines[pointIter][3].z, v, w_list[pointIter][0], w_list[pointIter][1], w_list[pointIter][2], w_list[pointIter][3] ),
        count_r( lines[pointIter + 1][0].z, lines[pointIter + 1][1].z, lines[pointIter + 1][2].z, lines[pointIter + 1][3].z, v, w_list[pointIter + 1][0], w_list[pointIter + 1][1], w_list[pointIter + 1][2], w_list[pointIter + 1][3] ),
        count_r( lines[pointIter + 2][0].z, lines[pointIter + 2][1].z, lines[pointIter + 2][2].z, lines[pointIter + 2][3].z, v, w_list[pointIter + 2][0], w_list[pointIter + 2][1], w_list[pointIter + 2][2], w_list[pointIter + 2][3] ),
        u,
        wr_list[0],
        wr_list[1],
        wr_list[2]
    );

    target.set(x, y, z);
    uvArr.push(new THREE.Vector2(u, v));
    uvMap.set(new THREE.Vector3(x, y, z), new THREE.Vector2(u, v));
};

var addMesh = function() {
    pointIter = 0;
    meshArray = [];

    while (pointIter < lines.length - 1) {

        let tempGeometry = new ParametricGeometry(paramFuncDynamic3to4, 5, 5);
        let tempMaterial = new THREE.MeshBasicMaterial({
            color: 0xff29,
            side: THREE.DoubleSide,
            wireframe: true,
        });
        let tempMesh = new THREE.Mesh(tempGeometry, tempMaterial);
        tempMesh.position.set( 0, 0, 0 );
        tempMesh.scale.multiplyScalar( 1 );
        scene.add(tempMesh);

        meshArray.push(tempMesh);
        pointIter += 2;
    }
}

var paramFuncDynamic4to4 = function(u, v, target) {

    var u = u;
    var v = v;
    var wr_list = [];
    for (let i = pointIter; i < pointIter + 4; i++) {
        wr_list.push(count_w(w_list[i], v));
    }

    var x = count_r(
        count_r( lines[pointIter][0].x, lines[pointIter][1].x, lines[pointIter][2].x, lines[pointIter][3].x, v, w_list[pointIter][0], w_list[pointIter][1], w_list[pointIter][2], w_list[pointIter][3] ),
        count_r( lines[pointIter + 1][0].x, lines[pointIter + 1][1].x, lines[pointIter + 1][2].x, lines[pointIter + 1][3].x, v, w_list[pointIter + 1][0], w_list[pointIter + 1][1], w_list[pointIter + 1][2], w_list[pointIter + 1][3] ),
        count_r( lines[pointIter + 2][0].x, lines[pointIter + 2][1].x, lines[pointIter + 2][2].x, lines[pointIter + 2][3].x, v, w_list[pointIter + 2][0], w_list[pointIter + 2][1], w_list[pointIter + 2][2], w_list[pointIter + 2][3] ),
        count_r( lines[pointIter + 3][0].x, lines[pointIter + 2][1].x, lines[pointIter + 3][2].x, lines[pointIter + 3][3].x, v, w_list[pointIter + 3][0], w_list[pointIter + 3][1], w_list[pointIter + 3][2], w_list[pointIter + 3][3] ),
        u,
        wr_list[0],
        wr_list[1],
        wr_list[2],
        wr_list[3]
    );

    // var x = co
    var y = count_curve(
        count_r( lines[pointIter][0].y, lines[pointIter][1].y, lines[pointIter][2].y, lines[pointIter][3].y, v, w_list[pointIter][0], w_list[pointIter][1], w_list[pointIter][2], w_list[pointIter][3] ),
        count_r( lines[pointIter + 1][0].y, lines[pointIter + 1][1].y, lines[pointIter + 1][2].y, lines[pointIter + 1][3].y, v, w_list[pointIter + 1][0], w_list[pointIter + 1][1], w_list[pointIter + 1][2], w_list[pointIter + 1][3] ),
        count_r( lines[pointIter + 2][0].y, lines[pointIter + 2][1].y, lines[pointIter + 2][2].y, lines[pointIter + 2][3].y, v, w_list[pointIter + 2][0], w_list[pointIter + 2][1], w_list[pointIter + 2][2], w_list[pointIter + 2][3] ),
        count_r( lines[pointIter + 3][0].y, lines[pointIter + 2][1].y, lines[pointIter + 3][2].y, lines[pointIter + 3][3].y, v, w_list[pointIter + 3][0], w_list[pointIter + 3][1], w_list[pointIter + 3][2], w_list[pointIter + 3][3] ),
        u,
        wr_list[0],
        wr_list[1],
        wr_list[2],
        wr_list[3]
    );

    var z = count_curve(
        count_r( lines[pointIter][0].z, lines[pointIter][1].z, lines[pointIter][2].z, lines[pointIter][3].z, v, w_list[pointIter][0], w_list[pointIter][1], w_list[pointIter][2], w_list[pointIter][3] ),
        count_r( lines[pointIter + 1][0].z, lines[pointIter + 1][1].z, lines[pointIter + 1][2].z, lines[pointIter + 1][3].z, v, w_list[pointIter + 1][0], w_list[pointIter + 1][1], w_list[pointIter + 1][2], w_list[pointIter + 1][3] ),
        count_r( lines[pointIter + 2][0].z, lines[pointIter + 2][1].z, lines[pointIter + 2][2].z, lines[pointIter + 2][3].z, v, w_list[pointIter + 2][0], w_list[pointIter + 2][1], w_list[pointIter + 2][2], w_list[pointIter + 2][3] ),
        count_r( lines[pointIter + 3][0].z, lines[pointIter + 2][1].z, lines[pointIter + 3][2].z, lines[pointIter + 3][3].z, v, w_list[pointIter + 3][0], w_list[pointIter + 3][1], w_list[pointIter + 3][2], w_list[pointIter + 3][3] ),
        u,
        wr_list[0],
        wr_list[1],
        wr_list[2],
        wr_list[3]
    );

    target.set(x, y, z);
    uvArr.push(new THREE.Vector2(u, v));
    uvMap.set(new THREE.Vector3(x, y, z), new THREE.Vector2(u, v));
};


//--------ADD GEOMETRY & MESH--------
addMesh();
let line_array = [];
$.each(lines, function (index, value) {
    let tempLineArray = create_line_array(value);
    line_array.push(create_line(tempLineArray));
});

function setup_lines(){    // Create a Three.js geometry for the point
    $.each(lines, function (index, value) {
        scene.remove(line_array[index]);

        let tempLineArray = create_line_array(value);
        line_array[index] = create_line(tempLineArray);

        scene.add(line_array[index]);
    });
}
let setPoints = function () {
    let points = [];
    $.each(lines, function (index, value) {
        $.each(value, function (index, value) {
            points.push(value.x);
            points.push(value.y);
            points.push(value.z);
        })
    })

    return points;
}

// Create a Three.js geometry for the point
let pointGeometry = new THREE.BufferGeometry();
let vertices = new Float32Array(setPoints());
pointGeometry.setAttribute('position', new THREE.BufferAttribute(vertices, 3));
let pointMaterial = new THREE.PointsMaterial({ color: 0xfff000, size: 1 });
let points = new THREE.Points(pointGeometry, pointMaterial);

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

        $.each(line_array, function (index, value) {
            scene.add(value);
        })
    } else {
        scene.remove(points);

        $.each(line_array, function (index, value) {
            scene.remove(value);
        })
    }
});

var evclid = gui.addFolder('evclid');
evclid.add(options, 'movex', -10, 10, 0.1).onChange(function(e){
    $.each(meshArray, function (index, value) {
        value.position.x = e;
    });
    
    $.each(line_array, function (index, value) {
        value.position.x = e;
    });

    points.position.x = e;
});
evclid.add(options, 'movey', -10, 10, 0.1).onChange(function(e){
    $.each(meshArray, function (index, value) {
        value.position.y = e;
    });

    $.each(line_array, function (index, value) {
        value.position.y = e;
    });

    points.position.y = e;
});
evclid.add(options, 'movez', -10, 10, 0.1).onChange(function(e){
    $.each(meshArray, function (index, value) {
        value.position.z = e;
    });

    $.each(line_array, function (index, value) {
        value.position.z = e;
    });

    points.position.z = e;
});


evclid.add(options, 'rotatex', -180, 180, 1).onChange(function(e){
    let rotX = (e*Math.PI)/180;
    $.each(meshArray, function (index, value) {
        value.rotation.x = rotX;
    });

    $.each(line_array, function (index, value) {
        value.rotation.x = rotX;
    });

    points.rotation.x = rotX;
});
evclid.add(options, 'rotatey', -180, 180, 1).onChange(function(e){
    let rotY = (e*Math.PI)/180;
    $.each(meshArray, function (index, value) {
        value.rotation.y = rotY;
    });

    $.each(line_array, function (index, value) {
        value.rotation.y = rotY;
    });
    
    points.rotation.y = rotY;
});
evclid.add(options, 'rotatez', -180, 180, 1).onChange(function(e){
    let rotZ = (e*Math.PI)/180;
    $.each(meshArray, function (index, value) {
        value.rotation.z = rotZ;
    });

    $.each(line_array, function (index, value) {
        value.rotation.z = rotZ;
    });

    points.rotation.z = rotZ;
});
// evclid.open();
let linesOptions = [];
$.each(lines, function (index, value) {
    linesOptions.push(add_points(index, value, 4));
})

function recount(){
    $.each(meshArray, function (index, value) {
       scene.remove(value);
    });

    addMesh();

    scene.remove(points);
    vertices = new Float32Array(setPoints());
    pointGeometry.setAttribute('position', new THREE.BufferAttribute(vertices, 3));
    pointMaterial = new THREE.PointsMaterial({ color: 0xfff000, size: 1 });
    points = new THREE.Points(pointGeometry, pointMaterial);

    setup_lines();

    scene.add(points);
}

//drawPoints();


//gui.add(default_button, 'default');

function animate(time){
    renderer.render(scene, camera);
}

renderer.setAnimationLoop(animate);