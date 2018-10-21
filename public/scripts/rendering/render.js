/* global BABYLON */
(() => {
    fetch('http://localhost:3000/rockets/stats')
        .then(response => {
            return response.json();
        }).then(response => {
            const YTDLaunches = response[0].getYtdCount;
            const NextLaunch = response[1].nextlaunch;
            const NextCountry = response[1].nextcountry;

            let text = 'Year-to-date Rocket Launches: ' + YTDLaunches;
            text = text + '\nNext Launch: ' + NextLaunch + ' from ' + NextCountry;
            document.getElementsByClassName('launch-stats')[0].innerHTML = text;
        });
    const canvas = document.getElementById('renderCanvas');
    const engine = new BABYLON.Engine(canvas, true);

    const createScene = function() {
        const scene = new BABYLON.Scene(engine);

        // Light rendering
        const lightHemi = new BABYLON.HemisphericLight('HemisphericLight', new BABYLON.Vector3(-1, 1, -1), scene);
        lightHemi.diffuse = new BABYLON.Color3(0.71, 0.71, 0.60);
        lightHemi.specular = new BABYLON.Color3(0.71, 0.71, 0.60);
        lightHemi.groundColor = new BABYLON.Color3(0.95, 0.95, 1);

        const lightOmni = new BABYLON.PointLight('Omni0', new BABYLON.Vector3(-30, 30, -30), scene);
        const lightSun = BABYLON.Mesh.CreateSphere('Sphere0', 16, 5.5, scene);
        lightSun.material = new BABYLON.StandardMaterial('white', scene);
        lightSun.material.diffuseColor = new BABYLON.Color3(1, 1, 0);
        lightSun.material.specularColor = new BABYLON.Color3(1, 1, 0);
        lightSun.material.emissiveColor = new BABYLON.Color3(1, 1, 1);
        lightSun.position = lightOmni.position;

        // Camera rendering
        const camera = new BABYLON.ArcRotateCamera('Camera', 0, 0, 10, new BABYLON.Vector3(0, 0, 0), scene);
        camera.setPosition(new BABYLON.Vector3(0, 0, 20));
        camera.attachControl(canvas, true);
        camera.wheelPrecision = 40;
        camera.lowerRadiusLimit = 13;
        camera.upperRadiusLimit = 500;

        // Earth rendering
        const earth = BABYLON.MeshBuilder.CreateSphere('earth', { segments: 16, diameter: 10 }, scene);
        const earthMaterial = new BABYLON.StandardMaterial('earthMaterial', scene);
        earthMaterial.diffuseTexture = new BABYLON.Texture('/scripts/rendering/textures/earth/earth_texture.jpg', scene);
        earthMaterial.diffuseTexture.uScale = -1;
        earthMaterial.diffuseTexture.vScale = -1;
        earthMaterial.bumpTexture = new BABYLON.Texture('/scripts/rendering/textures/earth/earth_normal.jpg', scene);
        earthMaterial.bumpTexture.uScale = -1;
        earthMaterial.bumpTexture.vScale = -1;
        earthMaterial.wireframe = false;
        earth.material = earthMaterial;
        earth.position.y = 0;
        earth.position.x = 0;

        // Skybox rendering
        const skybox = BABYLON.Mesh.CreateBox('skyBox', 1000.0, scene);
        const skyboxMaterial = new BABYLON.StandardMaterial('skyBox', scene);
        skyboxMaterial.backFaceCulling = false;
        skyboxMaterial.reflectionTexture = new BABYLON.CubeTexture('/scripts/rendering/textures/space/space_texture', scene);
        skyboxMaterial.reflectionTexture.coordinatesMode = BABYLON.Texture.SKYBOX_MODE;
        skyboxMaterial.diffuseColor = new BABYLON.Color3(0, 0, 0);
        skyboxMaterial.specularColor = new BABYLON.Color3(0, 0, 0);
        skyboxMaterial.disableLighting = true;
        skyboxMaterial.infiniteDistance = true;
        skybox.material = skyboxMaterial;

        fetch('http://localhost:3000/rockets/next')
            .then(response => {
                return response.json();
            }).then(response => {
                // Remove any rockets that do not have a launch area set
                let filtered = response.launches.filter(l => l.location.pads.length > 0);
                let coords = filtered.map(l => ({ latitude: l.location.pads[0].latitude, longitude: l.location.pads[0].longitude }));

                // Render these rockets on map
                // Import rocket/marker mesh
                BABYLON.SceneLoader.ImportMesh('Rocket', '/scripts/rendering/models/Rocket/', 'Rocket.babylon', scene, function(importedMeshes) {
                    const rocketMesh = importedMeshes[0];
                    console.log(rocketMesh);
                    placeMarker(coords, earth, scene, rocketMesh);
                });
            });

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

function cartesianToSphere(latitude, longitude, radius) {
    longitude = -longitude + 180; // INTENTIONAL: Offset texture to match real coordinates
    const phi = (90 - latitude) * (Math.PI / 180);
    const theta = (longitude + 180) * (Math.PI / 180);
    const x = -((radius) * Math.sin(phi) * Math.cos(theta));
    const z = ((radius) * Math.sin(phi) * Math.sin(theta));
    const y = ((radius) * Math.cos(phi));
    return new BABYLON.Vector3(x, y, z);
}

function placeMarker(coordarray, earth, scene, mesh) {
    console.log('Placing markers...');
    mesh.makeGeometryUnique();
    coordarray.forEach((value, index) => {
        const marker = mesh.createInstance('R' + index);
        console.log(marker);
        marker.parent = earth;
        const matrix = new BABYLON.Matrix();
        earth.getWorldMatrix().invertToRef(matrix);
        marker.position = cartesianToSphere(value.latitude, value.longitude, 10 / 2);

        const axis1 = BABYLON.Vector3.Cross(earth.position, marker.position);
        const axis2 = (marker.position).subtract(earth.position);
        const axis3 = BABYLON.Vector3.Cross(axis1, axis2);
        marker.position.x += 0.5;
        marker.position.y += 0.5;
        marker.position.z += 0.5;

        marker.rotation = BABYLON.Vector3.RotationFromAxis(axis1, axis2, axis3);
    });
}
