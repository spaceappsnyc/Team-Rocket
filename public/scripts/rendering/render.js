/* global BABYLON */
(() => {
    const canvas = document.getElementById('renderCanvas');
    const engine = new BABYLON.Engine(canvas, true);

    const createScene = function() {
        const scene = new BABYLON.Scene(engine);

        const lightHemi = new BABYLON.HemisphericLight('HemisphericLight', new BABYLON.Vector3(0, 1, 0), scene);
        const lightOmni = new BABYLON.PointLight('OmniLight', new BABYLON.Vector3(10, 50, 50), scene);
        const camera = new BABYLON.ArcRotateCamera('Camera', 0, 0, 10, new BABYLON.Vector3(0, 0, 0), scene);

        // const camera = new BABYLON.ArcRotateCamera('Camera', 0.4, 1.2, 20, new BABYLON.Vector3(-10, 0, 0), scene);

        camera.setPosition(new BABYLON.Vector3(0, 0, 20));
        camera.attachControl(canvas, true);

        // Create a basic light, aiming 0,1,0 - meaning, to the sky.

        // Create a built-in "sphere" shape.
        const sphere = BABYLON.MeshBuilder.CreateSphere('sphere', { segments: 16, diameter: 2 }, scene);

        // Move the sphere upward 1/2 of its height.
        sphere.position.y = 1;
        sphere.position.x = 0;

        // const ground = BABYLON.MeshBuilder.CreateGround('ground1', { height: 6, width: 6, subdivisions: 2 }, scene);

        // Skybox
        const skybox = BABYLON.Mesh.CreateBox('skyBox', 100.0, scene);
        const skyboxMaterial = new BABYLON.StandardMaterial('skyBox', scene);
        skyboxMaterial.backFaceCulling = false;
        skyboxMaterial.reflectionTexture = new BABYLON.CubeTexture('/scripts/rendering/textures/space_texture', scene);
        skyboxMaterial.reflectionTexture.coordinatesMode = BABYLON.Texture.SKYBOX_MODE;
        skyboxMaterial.diffuseColor = new BABYLON.Color3(0, 0, 0);
        skyboxMaterial.specularColor = new BABYLON.Color3(0, 0, 0);
        skyboxMaterial.disableLighting = true;
        skybox.material = skyboxMaterial;

        // const skyMaterial = new BABYLON.SkyMaterial('skyMaterial', scene);
        // skyMaterial.backFaceCulling = false;
        //
        // const skybox = BABYLON.Mesh.CreateBox('skyBox', 1000.0, scene);
        // skybox.material = skyMaterial;

        return scene;
    };


    const scene = createScene();

    engine.runRenderLoop(function() {
        scene.render();
    });

    window.addEventListener('resize', function() {
        engine.resize();
    });
})();
