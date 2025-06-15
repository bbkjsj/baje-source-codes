
module.exports = ((app) => {
    require('../controllers/v1/sign')(app);
    require('../controllers/v1/admin/personel/haghighi/timeoff')(app);
    require('../controllers/v1/admin/personel/haghighi/mission')(app);
    require('../controllers/v1/admin/personel/haghighi')(app);
    require('../controllers/v1/admin/personel/hoghooghi')(app);

    
    require('../controllers/v1/jobtitle')(app);
    require('../controllers/v1/admin/contract')(app);
    require('../controllers/v1/admin/vehicle')(app);
    require('../controllers/v1/file')(app);
    require('../controllers/v1/image')(app);
    require('../controllers/v1/admin/excel')(app);
    require('../controllers/v1/admin/personel/doctor')(app);
    require('../controllers/v1/admin/incident')(app);
    require('../controllers/v1/visit')(app);
    require('../controllers/v1/admin/personel/settle')(app);
    require('../controllers/v1/admin/insurance/tamin')(app);
    require('../controllers/v1/admin/insurance/payment')(app);
    require('../controllers/v1/admin/insurance/personnel_insurance_deduction')(app);
    require('../controllers/v1/admin/hr/yearly_variables')(app);
    require('../controllers/v1/admin/insurance')(app);

    //common
    require('../controllers/v1/common')(app);

    require('../controllers/v1/survey/reset')(app);
    require('../controllers/v1/survey/call')(app);
    require('../controllers/v1/survey/notification')(app);
    require('../controllers/v1/survey/execution')(app);
    require('../controllers/v1/survey/leaderboard')(app);
    require('../controllers/v1/survey/kartabl')(app);
    require('../controllers/v1/survey/cron')(app);
    require('../controllers/v1/survey/report')(app);
    require('../controllers/v1/survey/problem')(app);
    require('../controllers/v1/survey/like')(app);
    require('../controllers/v1/survey/comment')(app);
    require('../controllers/v1/survey/signup')(app);
    require('../controllers/v1/survey/result')(app);
    require('../controllers/v1/survey/manager')(app);
    require('../controllers/v1/survey')(app);
  

    require('../controllers/v1/imprest')(app);
    require('../controllers/v1/admin/personel/historyclaim')(app);
    

    //microservice
    require('../controllers/v1/microservice')(app);

    //search
    require('../controllers/v1/search')(app);
});