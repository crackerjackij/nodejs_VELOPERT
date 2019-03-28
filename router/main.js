// https://velopert.com/594
module.exports = function(app, fs, User)
{

     app.get('/',function(req,res){
         var sess = req.session;


         res.render('index', {
             title: "MY HOMEPAGE",
             length: 5,
             name: sess.name,
             username: sess.username
         })
     });



    app.get('/list', function (req, res) {
       /*
	   fs.readFile( __dirname + "/../data/" + "user.json", 'utf8', function (err, data) {
           console.log( data );
           res.end( data );
       });
	   */
	   User.find(function(err, users){
			if(err) return res.status(500).send({error: 'database failure'});
			res.json(users);
		})
    })
	
	app.get('/getUser/:username', function(req, res){
       /*
	   fs.readFile( __dirname + "/../data/user.json", 'utf8', function (err, data) {
            var users = JSON.parse(data);
            res.json(users[req.params.username]);
       });
	   */
	   User.findOne({userid: req.params.username}, function(err, user){
        if(err) return res.status(500).json({error: err});
        if(!user) return res.status(404).json({error: 'user not found'});
        res.json(user);
		})
    });
	
	app.post('/addUser/:username', function(req, res){
		var user = new User();
		user.userid = req.params.username;
		user.password = req.body["password"];
		user.name = req.body["name"];
		
		user.save(function(err){
        if(err){
            console.error(err);
            res.json({result: 0});
            return;
        }
		});

        res.json({result: 1});
		
        /*
		var result = {  };
        var username = req.params.username;

        // CHECK REQ VALIDITY
        if(!req.body["password"] || !req.body["name"]){
            result["success"] = 0;
            result["error"] = "invalid request";
            res.json(result);
            return;
        }

        // LOAD DATA & CHECK DUPLICATION
        fs.readFile( __dirname + "/../data/user.json", 'utf8',  function(err, data){
            var users = JSON.parse(data);
            if(users[username]){
                // DUPLICATION FOUND
                result["success"] = 0;
                result["error"] = "duplicate";
                res.json(result);
                return;
            }

            // ADD TO DATA
            users[username] = req.body;

            // SAVE DATA
            fs.writeFile(__dirname + "/../data/user.json",
                         JSON.stringify(users, null, '\t'), "utf8", function(err, data){
                result = {"success": 1};
                res.json(result);
            })
        })
		*/
    });
	
	app.put('/updateUser/:username', function(req, res){

		User.update({ userid: req.params.username }, { $set: req.body }, function(err, output){
        if(err) res.status(500).json({ error: 'database failure' });
        //console.log(output);
        if(!output.n) return res.status(404).json({ error: 'user not found' });
        res.json( { message: 'user updated' } );
		})
		/*
        var result = {  };
        var username = req.params.username;

        // CHECK REQ VALIDITY
        if(!req.body["password"] || !req.body["name"]){
            result["success"] = 0;
            result["error"] = "invalid request";
            res.json(result);
            return;
        }

        // LOAD DATA & CHECK DUPLICATION
        fs.readFile( __dirname + "/../data/user.json", 'utf8',  function(err, data){
            var users = JSON.parse(data);
            if(!users[username]){
                // DUPLICATION FOUND
                result["success"] = 0;
                result["error"] = "not target";
                res.json(result);
                return;
            }

            // ADD TO DATA
            users[username] = req.body;

            // SAVE DATA
            fs.writeFile(__dirname + "/../data/user.json",
                         JSON.stringify(users, null, '\t'), "utf8", function(err, data){
                result = {"success": 1};
                res.json(result);
            })
        })
		*/
    });
	
	app.delete('/deleteUser/:username', function(req, res){
        User.remove({ userid: req.params.username }, function(err, output){
        if(err) return res.status(500).json({ error: "database failure" });

        /* ( SINCE DELETE OPERATION IS IDEMPOTENT, NO NEED TO SPECIFY )
        if(!output.result.n) return res.status(404).json({ error: "user not found" });
        res.json({ message: "user deleted" });
        */

        res.status(204).end();
		res.json( { message: 'user deleted' } );
		})
		/*
		
		var result = { };
        //LOAD DATA
        fs.readFile(__dirname + "/../data/user.json", "utf8", function(err, data){
            var users = JSON.parse(data);

            // IF NOT FOUND
            if(!users[req.params.username]){
                result["success"] = 0;
                result["error"] = "not found";
                res.json(result);
                return;
            }

            delete users[req.params.username];
            fs.writeFile(__dirname + "/../data/user.json",
                         JSON.stringify(users, null, '\t'), "utf8", function(err, data){
                result["success"] = 1;
                res.json(result);
                return;
            })
        })
		*/

    })
	
	app.get('/login/:username/:password', function(req, res){
        var sess;
        sess = req.session;
		
		User.findOne({userid: req.params.username, password: req.params.password}, function(err, user){
        if(err) return res.status(500).json({error: err});
        if(!user) return res.status(404).json({error: 'user not found'});
		sess.username = user.userid;
        sess.name = user.name;
        res.redirect('/');
		})

		/*
        fs.readFile(__dirname + "/../data/user.json", "utf8", function(err, data){
            var users = JSON.parse(data);
            var username = req.params.username;
            var password = req.params.password;
            var result = {};
            if(!users[username]){
                // USERNAME NOT FOUND
                result["success"] = 0;
                result["error"] = "not found";
                res.json(result);
                return;
            }

            if(users[username]["password"] == password){
                result["success"] = 1;
                sess.username = username;
                sess.name = users[username]["name"];
                res.json(result);

            }else{
                result["success"] = 0;
                result["error"] = "incorrect";
                res.json(result);
            }
        })
		*/
    })
	
	app.get('/logout', function(req, res){
        sess = req.session;
        if(sess.username){
            req.session.destroy(function(err){
                if(err){
                    console.log(err);
                }else{
                    res.redirect('/');
                }
            })
        }else{
            res.redirect('/');
        }
    })


}
