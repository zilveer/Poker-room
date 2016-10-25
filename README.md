# Slayer
Node.js game framework server. For the client and a working example see https://github.com/oboforty/Slay-2

## Example Code
Each module in Slayer (both in client and server) should have a start() and an init() method.

### Server starter:
```javascript
// root/server.js
var fs = require('fs');
var slayer = require("slayer/server");

var conf = JSON.parse(fs.readFileSync('configs/config.json', 'utf8'));
slayer.init(conf);

try {
	Server.start();
} catch (e) {
	console.log("SLERROR:", e);
}
```

### Config file:
Append "modules" to enable your custom modules. To add custom config to your modules, simply add the same keys to the config file.
```json
// root/config.config.json.js
{
	"modules": {
		"Server": "core/server/wsserver",
		"DB": "core/db/pgdb",
		"Cache": "core/cache/redis",
		"Auth": "core/auth/userauth",

		"Game": "mygame/game",
		"Admin": "mygame/admin"
	},

	"Server": {
		"name": 					"Slayer server",
		"port": 					8000,
		"host": 					"0.0.0.0",
		"buffer": 					2048
	},

	"Admin": {
		"backup_loc": 				"",
		"fail_sql_loc": 			""
	},

	"Game": {
    ... custom Game config
	},

	"Scheduler": {
		"auth_password":			"0d68e9eddc5bf999b9a176461f19ff07"
	},

	"DB": {
		"host": 					"127.0.0.1",
		"user": 					"postgres",
		"password":					"postgres",
		"database": 				"DBNAME",
		"port": 					5432,
		"rows": 					0,
		"binary": 					false,
		"poolSize": 				10,
		"poolIdleTimeout": 			30000,
		"reapIntervalMillis": 		1000,
		"poolLog": 					false,
		"client_encoding": 			"",
		"ssl": 						false,
		"parseInputDatesAsUTC": 	false
	},

	"Auth": {
		"type": 					  "normal",
		"table_name": 			"users",
		"username_key": 		"name",
		"hash_key": 				"remember_token"
	}
}
```

### Client:

```html
<script src="slayer/client/core/client/client.js"></script>
<script src="slayer/client/core/client/connector.js"></script>
<script src="slayer/client/core/client/connector.js"></script>
<script src="slayer/client/core/auth/absauth.js"></script>
<script src="slayer/client/core/rooms/roomlist.js"></script>
<script src="slayer/client/core/rooms/room.js"></script>

<script src="mygame/client/game.js"></script>

<script>
    $('[data-toggle="tooltip"]').tooltip({html:true, placement:'top'});
		
		Client.init('{{ address }}');
		Auth.init();

		/*
		Graphics.url_base = "{!! url('/') . '/assets/' !!}";

		Auth.init('{!! $username !!}', '{!! $login_token !!}');
		Client.init('{!! $address !!}');

		// set MW game config
		Game.medwars = {!! json_encode(config('medwars')) !!};
		*/

		$(function(){
			Game.init();
		});
</script>
```
