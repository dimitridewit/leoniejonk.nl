import express from 'express';
import passport from 'passport';

const router = express.Router();

router.get('/login', function(req, res) {
  res.render('leonie/login');
});

router.post('/login', passport.authenticate('local', {
  successRedirect: '/leonie',
  failureRedirect: '/leonie/login',
}));

router.get('/logout', function(req, res) {
  req.logout();
  res.redirect('/');
});


router.use((req, res, next) => {
  if(req.isAuthenticated()) {
    return next();
  }
  res.redirect('/leonie/login');
});

router.get('/', (req, res) => {
  res.render('/leonie/index');
});

module.exports = router;
