/* global BABYLON */
(() => {
    const canvas = document.getElementById('renderCanvas');
    const engine = new BABYLON.Engine(canvas, true);

    const createScene = function() {
        const scene = new BABYLON.Scene(engine);

        const lightHemi = new BABYLON.HemisphericLight('HemisphericLight', new BABYLON.Vector3(0, 1, 0), scene);
        const lightOmni = new BABYLON.PointLight('OmniLight', new BABYLON.Vector3(10, 50, 50), scene);
        lightHemi.diffuse = new BABYLON.Color3(0.1, 0.25, 0.75);
        lightHemi.specular = new BABYLON.Color3(0.1, 0.25, 0.75);
        lightHemi.groundColor = new BABYLON.Color3(0.95, 0.95, 1);
        lightOmni.diffuse = new BABYLON.Color3(1, 1, 0);
        lightOmni.specular = new BABYLON.Color3(0.25, 0.25, 0);
        // lightOmni.groundColor = new BABYLON.Color3(1, 1, 0);

        const camera = new BABYLON.ArcRotateCamera('Camera', 0, 0, 10, new BABYLON.Vector3(0, 0, 0), scene);
        camera.setPosition(new BABYLON.Vector3(0, 0, 20));
        camera.attachControl(canvas, true);

        const earth = BABYLON.MeshBuilder.CreateSphere('earth', { segments: 16, diameter: 10 }, scene);
        const earthMaterial = new BABYLON.StandardMaterial('earthMaterial', scene);

        earthMaterial.diffuseTexture = new BABYLON.Texture('/scripts/rendering/textures/earth/earth_texture.jpg', scene);
        earthMaterial.diffuseTexture.uScale = -1;
        earthMaterial.diffuseTexture.vScale = -1;
        earth.material = earthMaterial;

        earth.position.y = 1;
        earth.position.x = 0;

        // Skybox Material
        const skybox = BABYLON.Mesh.CreateBox('skyBox', 100.0, scene);
        const skyboxMaterial = new BABYLON.StandardMaterial('skyBox', scene);
        skyboxMaterial.backFaceCulling = false;
        skyboxMaterial.reflectionTexture = new BABYLON.CubeTexture('/scripts/rendering/textures/space/space_texture', scene);
        skyboxMaterial.reflectionTexture.coordinatesMode = BABYLON.Texture.SKYBOX_MODE;
        skyboxMaterial.diffuseColor = new BABYLON.Color3(0, 0, 0);
        skyboxMaterial.specularColor = new BABYLON.Color3(0, 0, 0);
        skyboxMaterial.disableLighting = true;
        skyboxMaterial.infiniteDistance = true;
        // skyboxMaterial.turbidity = 100;
        skybox.material = skyboxMaterial;

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
