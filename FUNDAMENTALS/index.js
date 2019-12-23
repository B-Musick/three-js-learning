/**
 * Uses webGL to draw 3D
 * 
 * 
 * */


function main() {

    const canvas = document.querySelector('#c');
    const renderer = new THREE.WebGLRenderer({ canvas });

    // WebGL to take data and render it
    // These 4 settings define 'frustum' which is a pyramid with its top cut off
    // Camera defaults to looking down the z-axis
    const fov = 75;
    const aspect = window.innerWidth / window.innerHeight;  // the canvas default
    const near = 0.1;
    const far = 5;
    const camera = new THREE.PerspectiveCamera(fov, aspect, near, far);

    camera.position.z = 2;

    /** Set Up Scene */
    const scene = new THREE.Scene();

    /** Set up Box Geometry - https://threejs.org/docs/#api/en/geometries/BoxGeometry */
    const boxWidth = 1;
    const boxHeight = 1;
    const boxDepth = 1;
    const geometry = new THREE.BoxGeometry(boxWidth, boxHeight, boxDepth);

    const cubes = [
        makeInstance(geometry, 0x44aa88, 0),
        makeInstance(geometry, 0x8844aa, -2),
        makeInstance(geometry, 0xaa8844, 2),
    ];
    /** ADD DIRECTIONAL LIGHT FOR SHADOW 
     * https://www.youtube.com/watch?v=4njnviuvt1Q
    */
    {
        const color = 0xFFFFFF;
        const intensity = 1;
        const light = new THREE.DirectionalLight(color, intensity);
        light.position.set(-1, 2, 4);
        scene.add(light);
    }



    /** Render scene */
    renderer.render(scene, camera);

    /*********************** Rendering the scene ********************/
    // Create loop to draw scene every time screen refreshed (60 times a second)
    // Benefit instead of setInterval is pauses when go to another screen saving power
    // requestAnimationFrame - Pass it a function to be called, renderer.render draws the screen
    function animate(time) {
        
        time*=0.001 // Convert time to seconds (originally in milliseconds)
        if (resizeRendererToDisplaySize(renderer)) {
            // Fix the stretch of the screen so things arent distorted when screen smaller (stay the same spect)
            const canvas = renderer.domElement;
            camera.aspect = canvas.clientWidth/ canvas.clientHeight;
            camera.updateProjectionMatrix();
        }
        cubes.forEach((cube, ndx)=>{
            // Units in radians, should turn every 6.28 seconds
            const speed = 1+ndx *.1;
            const rot = time * speed;
            cube.rotation.x = rot;
            cube.rotation.y = rot;
        })
        requestAnimationFrame(animate);

        renderer.render(scene, camera);
    }
    animate();

    function makeInstance(geometry, color, x) {
        /** MESH *
         * https://threejs.org/docs/#api/en/objects/Mesh
         * MeshBasicMaterial isnt affected by lights
         * */

        // const material = new THREE.MeshBasicMaterial({ color: 0x44aa88 }); // Add color to mesh
        const material = new THREE.MeshPhongMaterial({ color });  // greenish blue

        const cube = new THREE.Mesh(geometry, material);
        // Add mesh to scene
        scene.add(cube);
        cube.position.x = x;
        return cube;
    }
    // Let's write a function that checks if the renderer's canvas is not already the size it is being displayed as and if so set its size.

    function resizeRendererToDisplaySize(renderer) {
        //  This will remove the blockiness (resolution)
        const canvas = renderer.domElement;
        const width = canvas.clientWidth;
        const height = canvas.clientHeight;
        const needResize = canvas.width !== width || canvas.height !== height;
        if (needResize) {
            // f need to resize then pass the client screen width
            // Make sure false so doesnt set canvases CSS default size
            renderer.setSize(width, height, false);
        }
        return needResize;
    }

}


main();
 /** TO DO
  * Read https://threejsfundamentals.org/threejs/lessons/threejs-prerequisites.html
  */