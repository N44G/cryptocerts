const express     = require('express'),
      router      = express.Router();

router.get('/', function(req, res){
    res.send('Verify Form');
});

router.get('/:accountno/:key', function(req, res){
    res.send('Verify');
});



module.exports = router;