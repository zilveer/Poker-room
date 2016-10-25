
Loader = {
	crossOrigin: false,

	init: function(callback, container, url_base, crossOrigin) {
		if(this.inited) return;
		this.inited = true;

		this.start_callback = callback;
		this.container = container;
		this.url_base = url_base;

		this.crossOrigin = crossOrigin || false;

		this.manager = new THREE.LoadingManager();
		this.manager.onProgress = this.on_load;

		this.imageLoader = new THREE.ImageLoader(this.manager);
		this.imageLoader.crossOrigin = crossOrigin;

		this.jsonLoader = new THREE.JSONLoader();

		this.objLoader = new THREE.OBJLoader(this.manager);
		this.objLoader.setPath( Loader.url_base + 'models/' );

		this.mtlLoader = new THREE.MTLLoader(this.manager);
		this.mtlLoader.setPath( Loader.url_base + 'models/' );
	},

	onProgress: function( xhr ) {

	},

	onError: function( xhr ) {
		console.error('LOADER ERROR', xhr);
	},

	start_callback: function(){
		Client.info("Please provide a Loader start callback function for your game.");		
	},

	on_load: function(item, loaded, total) {
		Client.progress( Math.round(loaded / total * 100) );

		if(loaded == total) {
			Loader.start_callback();
		}
	},

	load_model: function(figure_type, base) {
		Loader["load_model_" + base.ext](figure_type, base);
	},

	//used by hexlib's classes
	loadTexture: function(url, mapping, onLoad, onError) {
		var texture = new THREE.Texture(null, mapping);
		this.imageLoader.load(url, function(image) { // on load
				texture.image = image;
				texture.needsUpdate = true;
				if (onLoad) onLoad(texture);
			},
			null, // on progress
			function (evt) { // on error
				if (onError) onError(evt);
			});
		texture.sourceFile = url;

		return texture;
	},

	load_model_objmtl: function(figure_type, base, texture) {
		Loader.mtlLoader.setBaseUrl( Loader.url_base + 'models/' + base.base + '/' );

		Loader.mtlLoader.load( base.base + '/' + base.loc_mtl, function( materials ) {
			materials.preload();

			for(var m in materials.materials) {
				//@todo: maybe return is needed
				//materials.materials[m] = base.fix_mat(materials.materials[m]);
				base.fix_mat(m, materials.materials[m]);
			}

			Loader.objLoader.setMaterials( materials );
			Loader.objLoader.load( base.base + '/' + base.loc_obj, function ( object ) {
				container[figure_type] = base.fix_mesh(object);
			}, Loader.onProgress, Loader.onError );

		});
	},

	load_model_obj: function(figure_type, base, texture) {},
	load_model_json: function(figure_type, base, texture) {},
};
vg.Loader = Loader;